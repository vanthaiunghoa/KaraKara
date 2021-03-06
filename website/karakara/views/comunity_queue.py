from pyramid.view import view_config

from . import action_ok, action_error, comunity_only, method_delete_router


from ..model import DBSession, commit
from ..model.model_queue import Queue, QueueSetting
from ..model.actions import delete_queue


@view_config(
    context='karakara.traversal.ComunityQueueContext',
    request_method='GET',
)
@comunity_only
def comunity_queue_view(request):
    return action_ok(data={'queues': tuple(queue.to_dict() for queue in DBSession.query(Queue))})


@view_config(
    context='karakara.traversal.ComunityQueueContext',
    request_method='POST',
)
@comunity_only
def comunity_queue_add(request):
    _ = request.translate
    for key in ('queue_id', 'queue_password'):
        if not request.params.get(key):
            raise action_error(_('api.error.param_required ${param}', mapping={'param': key}), code=400)
    if request.params.get('queue_id') != request.params.get('queue_id').lower():
        raise action_error(_('api.error.queue_id.uppercase_forbidden'), code=400)

    queue = Queue()
    queue.id = request.params.get('queue_id').lower()
    DBSession.add(queue)

    commit()  # This is required as in postgres we are not using the orm and the settings insert fails because queue has not been constructed yet. Consider correct use of orm?

    queue_setting = QueueSetting()
    queue_setting.queue_id = request.params.get('queue_id')
    queue_setting.key = 'karakara.private.password'
    queue_setting.value = request.params.get('queue_password')
    DBSession.add(queue_setting)

    return action_ok(code=201)


@view_config(
    context='karakara.traversal.ComunityQueueContext',
    custom_predicates=(
        method_delete_router,
        lambda info, request: request.params.get('queue.id')
    )
)
@comunity_only
def queue_item_del(request):
    delete_queue(request.params.get('queue.id'))
    return action_ok()
