const modal = params => {
    const content = $('<div class="modal dtms-modal">').append(
        $('<div class="modal-dialog">').append(
            $('<div class="modal-content">').append(
                $('<div class="modal-header">').append(
                    $('<span class="notification-title">New team</span>'),
                    $('<button type="button" class="close">').append(
                        $('<span>&times;</span>').on('click', () => {
                            content.remove();
                        })
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
                            $('<button type="button" id="team-name-btn" class="btn btn-warning btn-lg">Create</button>')
                        )
                    )
                ),
                $('<div class="modal-footer">')
            )
        )
    );

    return content;
};

module.exports = {
    create : modal
};