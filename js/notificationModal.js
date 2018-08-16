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
                backdrop.removeClass('modal-backdrop');
                template.remove();

                if (opt.triggerFn && typeof opt.triggerFn === 'function')
                {
                    opt.triggerFn();
                }
            })
        );
    } );

    return footer;
};

const _create = params => {
    const mContent  = $('<div class="modal-content">');
    const confirmButton = $('<button type="button" class="btn btn-warning">OK</button>');

    let mHeader, mBody, mFooter = $('<div class="modal-footer">');

    template = $('<div class="modal dtms-modal">');

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

            backdrop.removeClass('modal-backdrop');
            template.remove();
        });

        mFooter.append(confirmButton);
    }

    if (params.decisions.length)
    {
        mFooter = _getFooter(params.decisions);
    }

    return template.append(
            $('<div class="modal-dialog">').append(
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