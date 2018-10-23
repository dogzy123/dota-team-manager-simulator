const getProp = (string, prop) => {
    // "#id.class$html"
    let propValue = "";

    if (string.indexOf(prop) > -1)
    {
        let leftString = string.substring(string.indexOf(prop) + 1);

        let end = leftString.match(/[#.$]/) ? leftString.match(/[#.$]/).index : leftString.length;

        propValue = leftString.substring(0, end);
    }

    return propValue;
};

export const convertToDom = ( string ) => {
    // div#menu.wrapper$Menu
    const el   = document.createElement(string.split(/[.#$]/g)[0]);
    const tags = string.match(/[.#$]/g);

    tags.map( tag => {
        switch (tag) {
            case "#":
                el.setAttribute('id', getProp(string,'#'));
                break;
            case ".":
                el.setAttribute('class', getProp(string, '.'));
                break;
            case "$":
                el.innerHTML = getProp(string,'$');
                break;
        }
    } );

    return el;
};