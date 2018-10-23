import {convertToDom} from "./utils";

export default class Component {
    constructor ( string ) {
        this.context        = convertToDom(string);
        this.subscribers    = [];

        return this;
    }

    addHandler (e, fn) {
        this.context.addEventListener(e, fn);

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