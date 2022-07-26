import { VNode, VText } from "./types";

import { deepFreeze, isFn } from "./util";

import { patch } from "./vdom";

type stringOrNull = string | null;

export default class Component extends HTMLElement {

    props = {}

    #currentState = null

    #frameRequest = null

    #oldTree = null

    rootNode: this | ShadowRoot;

    static propTypes: any;

    set state(newState) {
        this.#currentState = deepFreeze(newState);
    }

    get state() {
        return this.#currentState;
    }

    constructor() {
        super();

        this.rootNode = this;
    }

    #reRender = () => {
        const newTree = this.render(this.state, this.props);

        patch(this.rootNode, this.#oldTree, newTree);

        this.#oldTree = newTree;
    }

    #requestReRender() {
        if(this.#frameRequest) {
            cancelAnimationFrame(this.#frameRequest);
        }

        this.#frameRequest = requestAnimationFrame(this.#reRender);
    }

    setState(newState: any) {
        const nextState = isFn(newState) ? newState(this.state) : newState;

        this.state = nextState;

        this.#requestReRender();
    }

    #updateProps() {
        const attributes = Array.from(this.attributes);

        for(const { name, value } of attributes) {
            this.#updateProp(name, value);
        }
    }

    #updateProp(name: string, value: stringOrNull) {
        if(!(this.constructor as typeof Component).propTypes) {
            throw new Error(`No PropTypes have been defined.`);
        }

        const type = (this.constructor as typeof Component).propTypes[name];

        if(!type) {
            throw new Error(`PropType for property ${name} has not been specified.`);
        }

        this.props[name] = type(value);
    }

    connectedCallback() {
        this.#updateProps();

        this.#requestReRender();

        this.componentDidConnect();
    }

    disconnectedCallback() {
        patch(this.rootNode, this.#oldTree, null);

        this.componentDidDisconnect();
    }

    attributeChangedCallback(propName: string, prevValue: stringOrNull, newValue: stringOrNull) {
        if(newValue === prevValue) {
            return;
        }

        this.#updateProp(propName, newValue);

        this.#requestReRender();
    }

    componentDidConnect() {}

    componentDidDisconnect() {}

    render(_state: any, _props: any): VNode|VText {
        throw new Error('render method has not been defined.');
    }

}