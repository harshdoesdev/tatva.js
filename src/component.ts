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

    setState(newState: any) {
        const nextState = isFn(newState) ? newState(this.state) : newState;

        this.state = nextState;

        this.#requestUpdate();
    }

    #update = () => {
        const attributes = Array.from(this.attributes);

        for(const { name, value } of attributes) {
            this.#updateProp(name, value);
        }

        const newTree = this.render(this.state, this.props);

        patch(this.rootNode, this.#oldTree, newTree);

        this.#oldTree = newTree;
    }

    #requestUpdate() {
        if(this.#frameRequest) {
            cancelAnimationFrame(this.#frameRequest);
        }

        this.#frameRequest = requestAnimationFrame(this.#update);
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
        this.#requestUpdate();

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

        this.#requestUpdate();
    }

    componentDidConnect() {}

    componentDidDisconnect() {}

    render(_state: any, _props: any) {
        throw new Error('render method has not been defined.');
    }

}