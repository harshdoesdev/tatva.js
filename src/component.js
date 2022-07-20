import { deepFreeze, isFn } from "./util.js";

import { patch } from "./vdom.js";

export default class Component extends HTMLElement {

    props = {}

    state = null

    #frameRequest = null

    #oldTree = null

    constructor() {
        super();

        this.rootNode = this;
    }

    setState(newState) {
        const nextState = isFn(newState) ? newState(this.state) : newState;

        this.state = deepFreeze(nextState);
        
        this.#requestUpdate();
    }

    #update = () => {
        const attributes = Array.from(this.attributes);

        for(const { name, value } of attributes) {
            this.#updateProp(name, value)
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

    #updateProp(name, value) {
        if(!this.constructor.propTypes) {
            throw new Error(`No PropTypes have been defined.`);
        }

        const type = this.constructor.propTypes[name];

        if(!type) {
            throw new Error(`PropType for property ${name} has not been specified.`);
        }

        this.props[name] = type(value);
    }

    connectedCallback() {
        this.#update();

        this.componentDidConnect();
    }

    disconnectedCallback() {
        patch(this.rootNode, this.#oldTree, null);

        this.componentDidDisconnect();
    }

    attributeChangedCallback(propName, prevValue, newValue) {
        if(newValue === prevValue) {
            return;
        }

        this.#updateProp(propName, newValue, prevValue);

        this.#requestUpdate();
    }

    componentDidConnect() {}

    componentDidDisconnect() {}

    render(_state) {}

}