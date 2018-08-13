const backdrop = $('#backdrop');

const _getBody = (body) => {
    return $('<div class="modal-body">').append(
        $('<p>'+ body +'</p>')
    );
};

const _getHeader = (header, template) => {
    return $('<div class="modal-header">').append(
        $('<h5>' + header + '</h5>'),
        $('<button type="button" class="close">').append(
            $('<span>&times;</span>').on('click', () => {
                template.remove();
                backdrop.removeClass('modal-backdrop');
            })
        )
    );
};

const _create = (params) => {
    const template  = $('<div class="modal dtms-modal">');
    const mDialog   = $('<div class="modal-dialog">');
    const mContent  = $('<div class="modal-content">');

    const confirmButton = $('<button type="button" class="btn btn-warning">OK</button>').on('click', () => {
        template.remove();
        backdrop.removeClass('modal-backdrop');
    });

    let mHeader, mBody, mFooter;

    if (params.title)
    {
        mHeader = _getHeader(params.title, template);
    }

    if (params.msg)
    {
        mBody = _getBody(params.msg);
    }

    mFooter = $('<div class="modal-footer">');

    if (params.buttons)
    {
        params.buttons.forEach( (button) => {
            mFooter.append(
                $('<button type="button" class="btn btn-warning">'+ button.name +'</button>').on('click', function () {
                    button.callback();
                    template.remove();
                    params.callback();
                })
            );
        } );
    }

    if (params.onConfirm && !params.buttons)
    {
        confirmButton.on('click', function () {
            if (typeof params.onConfirm === 'function')
            {
                params.onConfirm();
            }

            template.remove();
        });

        mFooter.append(confirmButton);
    }

    return template.append(
        mDialog.append(
            mContent.append(
                mHeader,
                mBody,
                mFooter
            )
        )
    );
};

const _init = (fn) => {
    if (fn && typeof fn === 'function')
    {
        fn();
    }
};

module.exports = {
    create : _create,
    init   : _init
};