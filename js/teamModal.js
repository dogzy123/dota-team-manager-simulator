const backDrop = $('#backdrop');

const _create = handlers => {
    const closeIcon = $('<span>&times;</span>');
    const createBtn = $('<button type="button" id="team-name-btn" class="btn btn-warning btn-lg">Create</button>');

    if (handlers)
    {
       if (handlers.onClose && typeof handlers.onClose === 'function')
       {
           closeIcon.on('click', e => {
               content.remove();
               backDrop.removeClass('backdrop-modal');
               handlers.onClose();
           });
       }

       if (handlers.onCreate && typeof handlers.onCreate === 'function')
       {
           const params = {};

           createBtn.on('click', e => {
               // set params
               params.name = $('#team-name').val();

               //remove dom
               content.remove();
               backDrop.removeClass('modal-backdrop');

               // set data to handlers
               handlers.onCreate(params);
           });
       }
   }

    const content = $('<div class="modal dtms-modal">').append(
        $('<div class="modal-dialog">').append(
            $('<div class="modal-content">').append(
                $('<div class="modal-header">').append(
                    $('<span class="notification-title">New team</span>'),
                    $('<button type="button" class="close">').append(
                        closeIcon
                    )
                ),
                $('<div class="modal-body">').append(
                    $('<div class="form-group">').append(
                        $('<div class="col-sm-12">').append(
                            $('<div class="input-group">').append(
                                $('<label for="" class="input-group-addon">Name</label>'),
                                $('<input id="team-name" type="text" class="form-control">')
                            )
                        ),
                        $('<div class="col-sm-6" style="float: right">').append(
                            createBtn
                        )
                    )
                ),
                $('<div class="modal-footer">')
            )
        )
    );

    backDrop.addClass('modal-backdrop');

    return content;
};

module.exports = {
    create : _create
};