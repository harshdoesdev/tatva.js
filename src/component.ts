import { VNode, stringOrNull, VText } from "./types";

import { deepFreeze, isFn } from "./util";

import { patch } from "./vdom";

export default class Component extends HTMLElement {

    props = {}

    #currentState = null

    #frameRequest = null

    #oldTree = null

    #hasLoaded = false

    #hasRendered = false

    rootNode: this | ShadowRoot = this;

    static propTypes: any;

    set state(newState) {
        this.#currentState = deepFreeze(newState);
    }

    get state() {
        return this.#currentState;
    }

    #reRender = async () => {
        await this.componentWillRender();

        const newTree = this.render(this.state, this.props);

        patch(this.rootNode, this.#oldTree, newTree);

        this.#oldTree = newTree;

        this.componentDidRender();
    }

    #requestReRender() {
        if(this.#frameRequest) {
            cancelAnimationFrame(this.#frameRequest);
            this.#frameRequest = null;
        }

        this.#frameRequest = requestAnimationFrame(this.#reRender);
    }

    #shouldRender(newValue?: any, oldValue?: any, name?: string) {
        return (!this.#hasRendered || this.#frameRequest != null)
            ? true
            : this.componentShouldUpdate(oldValue, newValue, name);
    }

    setState(newState: any) {
        const nextState = isFn(newState) ? newState(this.state) : newState;

        this.state = nextState;

        if(!this.#shouldRender()) {
            return;
        }

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

        const oldValue = this.props[name];

        const newValue = type(value);
        
        this.props[name] = newValue;

        if(!this.#hasRendered) {
            return true;
        }

        return this.#shouldRender(newValue, oldValue, name);
    }

    async connectedCallback() {
        this.#updateProps();

        if(!this.#hasLoaded) {
            this.#hasLoaded = true;

            await this.componentWillLoad();
        }

        this.#hasRendered = true;

        this.#requestReRender();

        this.componentDidLoad();

        this.componentDidConnect();
    }

    disconnectedCallback() {
        patch(this.rootNode, this.#oldTree, null);

        this.componentDidDisconnect();
    }

    attributeChangedCallback(propName: string, oldValue: stringOrNull, newValue: stringOrNull) {
        if(newValue === oldValue) {
            return;
        }
        
        if(!this.#updateProp(propName, newValue)) {
            return;
        }

        this.#requestReRender();
    }

    componentDidConnect() {}

    componentDidDisconnect() {}

    async componentWillLoad() {}

    componentDidLoad() {}

    componentShouldUpdate(_oldValue?: any, _newValue?: any, _propName?: string) {
        return true;
    }

    async componentWillRender() {}

    componentDidRender() {}

    render(_state: any, _props: any): VNode|VText {
        throw new Error('render method has not been defined.');
    }

}