let template;

const _getBody = (body) => {
    return $('<div class="modal-body">').append(
        $('<p>'+ body +'</p>')
    );
};

const _getHeader = (header) => {
    return $('<div class="modal-header">').append(
                $('<h5>'+ header +'</h5>'),
                $('<button type="button" class="close">').append(
                    $('<span>&times;</span>')
                )
            );
};

const _getFooter = (params) => {
    return $('<div class="modal-footer">').append(
        $('<button type="button" class="btn btn-warning">OK</button>').on('click', function () {
            template.remove();
            if (params.onConfirm)
            {
                if (typeof params.onConfirm === 'function')
                {
                    params.onConfirm();
                }
            }
        })
    );
};

const _create = (params) => {
    template = $('<div class="modal dtms-modal">');

    const mDialog = $('<div class="modal-dialog">');
    const mContent = $('<div class="modal-content">');

    let mHeader, mBody, mFooter;

    if (params.title)
    {
        mHeader = _getHeader(params.title);
    }

    if (params.msg)
    {
        mBody = _getBody(params.msg);
    }


    mFooter = _getFooter(params);

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

exports.Notifications = {
    create : _create
};