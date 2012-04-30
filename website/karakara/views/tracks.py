from pyramid.view import view_config

from ..lib.auto_format    import auto_format_output
from ..model.models       import DBSession
from ..model.model_tracks import Track


#-------------------------------------------------------------------------------
# Track
#-------------------------------------------------------------------------------

@view_config(route_name='track'  )
#@view_config(route_name='track_f')
@auto_format_output
def track_view(request):
    """
    View individual track details
    """
    id    = request.matchdict['id']
    #id    = 't1'
    track = DBSession.query(Track).with_polymorphic('*').get(id)
    return {'status':'ok','message':track.description}


@view_config(route_name='track_list')
@auto_format_output
def track_list(request):
    """
    Browse tracks
    """
    return {'status':'ok','message':'list'}


@view_config(route_name='track_list_all')
@auto_format_output
def track_list_all(request):
    """
    Return a list of every track in the system (typically for printing)
    """
    return {}

