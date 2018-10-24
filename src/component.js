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

const convertToDom = string => {
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

export default class Component {
    constructor ( string ) {
        this.context        = convertToDom(string);
        this.subscribers    = [];

        return this;
    }

    addHandler (event, fn) {
        this.context.addEventListener(event, e => {
            e.preventDefault();
            fn(e);
        });

        return this;
    }

    subscribe () {
        if (arguments.length)
        {
            const args = [...arguments];

            args.map( component => {
                this.subscribers.push(component);
                this.context.appendChild(component.context);
            } );
        }

        return this;
    }

    __renderFn () {
    }

    render ( state ) {
        if (this.subscribers.length)
        {
            this.subscribers.map( component => component.__renderFn(state, this.getContext()) );
        }

        this.__renderFn(state, this.context);

        return this;
    }

    onStateChange (fn) {
        this.__renderFn = fn;

        return this;
    }

    getContext () {
        return this.context;
    }
}