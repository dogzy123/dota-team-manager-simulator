const backdrop = $('#backdrop');

const _create = params => {
    const modalId = "dtms-modal" + Math.round(Date.now() * Math.random() + 1000);

    let template = $('<div id="'+ modalId +'" class="dtms-modal modal">');
    const mContent  = $('<div class="modal-content">');
    const confirmButton = $('<button type="button" class="btn btn-warning">OK</button>');

    let mFooter = $('<div class="modal-footer">');

    if (params.onConfirm && !params.decisions.length)
    {
        confirmButton.on('click', function () {
            if (typeof params.onConfirm === 'function')
            {
                params.onConfirm();
            }

            backdrop.removeClass('modal-backdrop');
            template.remove();
            template = null;
        });

        mFooter.append(confirmButton);
    }

    if (params.decisions.length)
    {
        params.decisions.forEach( opt => {
            mFooter.append(
                $('<button type="button" class="btn btn-warning">'+ opt.title +'</button>').on('click', e => {
                    backdrop.removeClass('modal-backdrop');
                    template.remove();
                    template = null;

                    if (opt.triggerFn && typeof opt.triggerFn === 'function')
                    {
                        opt.triggerFn();
                    }
                })
            );
        } );
    }

    return template.append(
            $('<div class="modal-dialog">').append(
                mContent.append(
                    $('<div class="modal-header">').append(
                        $('<span class="notification-title">' + params.title + '</span>'),
                        $('<button type="button" class="close">').append(
                            $('<span>&times;</span>').on('click', e => {
                                template.remove();
                                backdrop.removeClass('modal-backdrop');
                            })
                        )
                    ),
                    $('<div class="modal-body">').append(
                        $('<span class="notification-text">'+ params.msg +'</span>')
                    ),
                    mFooter
                )
            )
        );
};

module.exports = {
    create : _create
};