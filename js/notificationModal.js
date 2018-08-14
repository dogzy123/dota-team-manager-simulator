const backdrop = $('#backdrop');

let template;

const _getBody = body => {
    return $('<div class="modal-body">').append(
        $('<span class="notification-text">'+ body +'</span>')
    );
};

const _getHeader = header => {
    return $('<div class="modal-header">').append(
        $('<span class="notification-title">' + header + '</span>'),
        $('<button type="button" class="close">').append(
            $('<span>&times;</span>').on('click', () => {
                template.remove();
                backdrop.removeClass('modal-backdrop');
            })
        )
    );
};

const _getFooter = options => {
    const footer = $('<div class="modal-footer">');

    options.forEach( opt => {
        footer.append(
            $('<button type="button" class="btn btn-warning">'+ opt.title +'</button>').on('click', e => {
                template.remove();
                backdrop.removeClass('modal-backdrop');

                if (opt.triggerFn)
                {
                    opt.triggerFn();
                }
            })
        );
    } );

    return footer;
};

const _create = params => {
    const mDialog   = $('<div class="modal-dialog">');
    const mContent  = $('<div class="modal-content">');

    template  = $('<div class="modal dtms-modal">');

    const confirmButton = $('<button type="button" class="btn btn-warning">OK</button>').on('click', () => {
        template.remove();
        backdrop.removeClass('modal-backdrop');
    });

    let mHeader, mBody, mFooter = $('<div class="modal-footer">');

    if (params.title)
    {
        mHeader = _getHeader(params.title);
    }

    if (params.msg)
    {
        mBody = _getBody(params.msg);
    }

    if (params.onConfirm)
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

    if (params.decisions.length)
    {
        mFooter = _getFooter(params.decisions);
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

module.exports = {
    create : _create
};