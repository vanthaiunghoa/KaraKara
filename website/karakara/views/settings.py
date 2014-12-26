import re

from pyramid.view import view_config

from externals.lib.misc import convert_str_with_type

from . import web, action_ok, action_error, method_put_router, is_admin

import logging
log = logging.getLogger(__name__)


@view_config(route_name='settings')
@web
def settings(request):
    """
    Surface settings as an API.
    This allows clients to qurey server settup rather than having to hard code bits into the clients
    """
    if not is_admin(request):
        log.debug('settings requested by non admin')  # I'm curious if anyone will find this. would be fun to search logs after an event for this string

    if method_put_router(None, request):
        # with PUT requests, update settings
        #  only changing in production is bit over zelious #request.registry.settings.get('karakara.server.mode')!='production'
        if request.registry.settings.get('karakara.server.mode') != 'test' and not is_admin(request):
            raise action_error(message='Settings modification for non admin users forbidden', code=403)

        for key, value in request.params.items():
            fallback_type = None
            if request.registry.settings.get(key) != None:
                fallback_type = type(request.registry.settings.get(key))
            request.registry.settings[key] = convert_str_with_type(value, fallback_type=fallback_type)

    setting_regex = re.compile(request.registry.settings.get('api.settings.regex', 'TODOmatch_nothing_regex'))
    return action_ok(
        data={
            'settings': {
                setting_key: request.registry.settings.get(setting_key)
                for setting_key in
                [key for key in request.registry.settings.keys() if setting_regex.match(key)]
            }
        }
    )
