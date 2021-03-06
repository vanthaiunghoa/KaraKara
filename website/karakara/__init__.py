import os
import re
import operator
import random
from functools import partial

# Pyramid imports
import pyramid.events
import pyramid.request
import pyramid.config
import pyramid.traversal
from pyramid.session import SignedCookieSessionFactory  # TODO: should needs to be replaced with an encrypted cookie or a hacker at an event may be able to intercept other users id's
from pyramid.i18n import get_localizer, TranslationStringFactory

# External Imports
from calaldees.string_convert import convert_str_with_type
from calaldees.data import extract_subkeys
from calaldees.json import read_json, json_serializer, json_string
from calaldees.date_tools import now
from calaldees.debug import postmortem
from calaldees.pyramid_helpers.cache_manager import setup_pyramid_cache_manager
from calaldees.pyramid_helpers.auto_format2 import setup_pyramid_autoformater, post_view_dict_augmentation
from calaldees.pyramid_helpers.session_identity2 import session_identity
from calaldees.social._login import NullLoginProvider, FacebookLogin, GoogleLogin
from calaldees.multisocket.auth_echo_server import AuthEchoServerManager

# Package Imports
from .traversal import TraversalGlobalRootFactory
from .templates import helpers as template_helpers
from .auth import ComunityUserStore, NullComunityUserStore
# SQLAlchemy imports
from .model import init_DBSession


import logging
log = logging.getLogger(__name__)

translation_string_factory = TranslationStringFactory('karakara')


def main(global_config, **settings):
    """
        This function returns a Pyramid WSGI application.
    """
    # Setup --------------------------------------------------------------------

    # Db
    init_DBSession(settings)

    # Pyramid Global Settings
    config = pyramid.config.Configurator(settings=settings, root_factory=TraversalGlobalRootFactory)  # , autocommit=True

    def assert_settings_keys(keys):
        for settings_key in key:
            assert config.registry.settings.get(settings_key)

    # Register Additional Includes ---------------------------------------------
    config.include('pyramid_mako')  # The mako.directories value is updated in the scan for addons. We trigger the import here to include the correct folders.

    # Reload on template change - Dedicated from pserve
    #template_filenames = map(operator.attrgetter('absolute'), file_scan(config.registry.settings['mako.directories']))
    #from pyramid.scripts.pserve import add_file_callback
    #add_file_callback(lambda: template_filenames)

    # Parse/Convert setting keys that have specified datatypes
    # Environment variables; capitalized and separated by underscores can override a settings key.
    # e.g.
    #   export KARAKARA_TEMPLATE_TITLE=Test
    #   can override 'karakara.template.title'
    for key in config.registry.settings.keys():
        value = os.getenv(key.replace('.', '_').upper(), '') if config.registry.settings['karakara.server.mode'] != 'test' else ''
        value = value or config.registry.settings[key]
        config.registry.settings[key] = convert_str_with_type(value)

    # Session identity
    config.add_request_method(partial(session_identity, session_keys={'id', 'admin', 'faves', 'user'}), 'session_identity', reify=True)

    # Setup Cache Manager config in view
    setup_pyramid_cache_manager(config)
    # Setup Autoformat view processor
    setup_pyramid_autoformater(config)

    @post_view_dict_augmentation.register_pre_render_decorator()
    def add_paths_to_response_dict(request, response):
        response['paths'] = {
            'context': pyramid.traversal.resource_path(request.context),
            'queue': '',
        }
        try:
            queue_context = request.context.queue_context
            if queue_context:
                response['paths'].update(template_helpers.paths_for_queue(queue_context.id))
        except AttributeError:
            pass

    # i18n
    config.add_translation_dirs(config.registry.settings['i18n.translation_dirs'])

    # Session Manager
    session_settings = extract_subkeys(config.registry.settings, 'session.')
    session_factory = SignedCookieSessionFactory(serializer=json_serializer, **session_settings)
    config.set_session_factory(session_factory)

    from .model.actions import last_track_db_update
    def _last_track_db_update(request):
        return last_track_db_update()
    # Track DB Version ---------------------------------------------------------
    config.add_request_method(_last_track_db_update, 'last_track_db_update', property=True, reify=True)

    # Cachebust etags ----------------------------------------------------------
    #  crude implementation; count the number of tags in db, if thats changed, the etags will invalidate
    if not config.registry.settings['server.etag.cache_buster']:
        config.registry.settings['server.etag.cache_buster'] = 'last_update:{0}'.format(str(last_track_db_update()))
        # TODO: Where is this used? How is this related to karakara.tracks.version?

    # Global State -------------------------------------------------------------
    config.registry.settings['karakara.tracks.version'] = random.randint(0, 20000000)


    # Search Config ------------------------------------------------------------
    import karakara.views.queue_search
    karakara.views.queue_search.search_config = read_json(config.registry.settings['karakara.search.view.config'])
    assert karakara.views.queue_search.search_config, 'search_config data required'


    # LogEvent -----------------------------------------------------------------

    log_event_logger = logging.getLogger('json_log_event')
    def log_event(request, **data):
        """
        It is expected that python's logging framework is used to output these
        events to the correct destination.
        Logstash can then read/process this log output for overview/stats
        """
        event = data.get('event')
        try:
            event = request.matched_route.name
        except Exception:
            pass
        try:
            event = request.context.__name__
        except Exception:
            pass
        data.update({
            'event': event,
            'session_id': request.session.get('id'),
            'ip': request.environ.get('REMOTE_ADDR'),
            'timestamp': now(),
        })
        log_event_logger.info(json_string(data))
    config.add_request_method(log_event)

    # WebSocket ----------------------------------------------------------------

    class NullAuthEchoServerManager(object):
        def recv(self, *args, **kwargs):
            pass
    socket_manager = NullAuthEchoServerManager()

    if config.registry.settings.get('karakara.websocket.port'):
        def authenticator(key):
            """Only admin authenticated keys can connect to the websocket"""
            cookie_name = config.registry.settings['session.cookie_name']
            if cookie_name in key:
                cookie = key
            else:
                cookie = '{0}={1}'.format(cookie_name, key)
            request = pyramid.request.Request({'HTTP_COOKIE': cookie})
            session_data = session_factory(request)
            return session_data and session_data.get('admin')
        def _int_or_none(setting_key):
            return int(config.registry.settings.get(setting_key)) if config.registry.settings.get(setting_key) else None
        try:
            _socket_manager = AuthEchoServerManager(
                authenticator=authenticator,
                websocket_port=_int_or_none('karakara.websocket.port'),
                tcp_port=_int_or_none('karakara.tcp.port'),
            )
            _socket_manager.start()
            socket_manager = _socket_manager
        except OSError:
            log.warn('Unable to setup websocket')

    def send_websocket_message(request, message):
        # TODO: This will have to be augmented with json and queue_id in future
        socket_manager.recv(message.encode('utf-8'))  # TODO: ?um? new_line needed?
    config.add_request_method(send_websocket_message)
    #config.registry['socket_manager'] = socket_manager


    # Login Providers ----------------------------------------------------------

    from .views.comunity_login import social_login
    social_login.user_store = ComunityUserStore()
    login_providers = config.registry.settings.get('login.provider.enabled')
    # Facebook
    if 'facebook' in login_providers:
        assert_settings_keys(
            ('login.facebook.appid', 'login.facebook.secret'),
            message='To use facebook as a login provider appid and secret must be provided'
        )
        social_login.add_login_provider(FacebookLogin(
            appid=config.registry.settings.get('login.facebook.appid'),
            secret=config.registry.settings.get('login.facebook.secret'),
            permissions=config.registry.settings.get('login.facebook.permissions'),
        ))
    # Google
    if 'google' in login_providers:
        social_login.add_login_provider(GoogleLogin(
            client_secret_file=config.registry.settings.get('login.google.client_secret_file'),
        ))
    # Firefox Persona (Deprecated technology but a useful reference)
    #if 'persona' in login_providers:
    #    social_login.add_login_provider(PersonaLogin(
    #        site_url=config.registry.settings.get('server.url')
    #    ))
    # No login provider
    if not login_providers and config.registry.settings.get('karakara.server.mode') != 'test':
        # Auto login if no service keys are provided
        social_login.add_login_provider(NullLoginProvider())
        social_login.user_store = NullComunityUserStore()
    template_helpers.javascript_inline['comunity'] = social_login.html_includes


    # KaraKara request additions -----------------------------------------------

    from unittest.mock import patch

    def call_sub_view(request, view_callable, acquire_cache_bucket_func):
        """
        A wrapper for called view_callable's to allow subrequests to use correct cache_buckets
        """
        if not hasattr(request, 'cache_bucket'):
            # FFS - don't ask questions ... just ... (sigh) ... patch can ONLY patch existing attributes
            setattr(request, 'cache_bucket', 'some placeholder shite')
        _cache_bucket = acquire_cache_bucket_func(request)
        with patch.object(request, 'cache_bucket', _cache_bucket):
            assert request.cache_bucket == _cache_bucket
            return view_callable(request)['data']

    config.add_request_method(call_sub_view)


    from .model_logic.queue_logic import QueueLogic
    config.add_request_method(QueueLogic, 'queue', reify=True)


    # Routes -------------------------------------------------------------------

    def settings_path(key):
        path = os.path.join(os.getcwd(), config.registry.settings[key])
        if not os.path.isdir(path):
            log.error('Unable to add_static_view {key}:{path}'.format(key=key, path=path))  #TODO: reaplce with formatstring
        return path

    # Static Routes
    config.add_static_view(name='ext', path=settings_path('static.externals'))  # cache_max_age=3600
    config.add_static_view(name='static', path=settings_path('static.assets'))  # cache_max_age=3600
    config.add_static_view(name='player', path=settings_path('static.player'))
    config.add_static_view(name='player2', path=settings_path('static.player2'))

    # AllanC - it's official ... static route setup and generation is a mess in pyramid
    #config.add_static_view(name=settings["static.media" ], path="karakara:media" )
    config.add_static_view(name='files', path=config.registry.settings['static.processmedia2.config']['path_processed'])

    # View Routes
    config.add_route('inject_testdata', '/inject_testdata')
    # Upload extras -----
    #config.add_static_view(name=settings['upload.route.uploaded'], path=settings['upload.path'])  # the 'upload' route above always matchs first
    config.add_route('upload', '/upload{sep:/?}{name:.*}')

    # Events -------------------------------------------------------------------
    config.add_subscriber(add_localizer_to_request, pyramid.events.NewRequest)
    config.add_subscriber(add_render_globals_to_template, pyramid.events.BeforeRender)

    # Tweens -------------------------------------------------------------------
    if config.registry.settings.get('karakara.server.mode') == 'development' and config.registry.settings.get('karakara.server.postmortem'):
        config.add_tween('karakara.postmortem_tween_factory')


    # Return -------------------------------------------------------------------
    config.scan(ignore='.tests')
    config.scan('calaldees.pyramid_helpers.views')
    return config.make_wsgi_app()


def add_localizer_to_request(event):
    request = event.request
    localizer = get_localizer(request)
    def auto_translate(*args, **kwargs):
        return localizer.translate(translation_string_factory(*args, **kwargs))
    request.localizer = localizer
    request.translate = auto_translate


def add_render_globals_to_template(event):
    request = event['request']
    event['_'] = request.translate
    event['localizer'] = request.localizer
    event['h'] = template_helpers
    event['traversal'] = pyramid.traversal


def postmortem_tween_factory(handler, registry):
    def postmortem_tween(request):
        return postmortem(handler, request)
    return postmortem_tween
