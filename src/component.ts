import { VNode, VText, stringOrNull } from "./types";

import { deepFreeze, isFn } from "./util";

import { patch } from "./vdom";

export default class Component extends HTMLElement {

    props = {}

    #currentState = null

    #frameRequest = null

    #oldTree = null

    #hasLoaded = false

    #hasRendered = false

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
        }

        this.#frameRequest = requestAnimationFrame(this.#reRender);
    }

    setState(newState: any) {
        this.componentShouldUpdate();

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

        const oldValue = this.props[name];

        const newValue = type(value);

        this.componentShouldUpdate(oldValue, newValue, name);
        
        this.props[name] = newValue;
    }

    async connectedCallback() {
        this.#updateProps();

        if(!this.#hasLoaded) {
            this.#hasLoaded = true;

            await this.componentWillLoad();
        }

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
        
        this.#updateProp(propName, newValue);

        this.#requestReRender();
    }

    componentDidConnect() {}

    componentDidDisconnect() {}

    async componentWillLoad() {}

    componentDidLoad() {}

    componentShouldUpdate(_oldValue?: any, _newValue?: any, _propName?: string) {}

    async componentWillRender() {}

    componentDidRender() {}

    render(_state: any, _props: any): VNode|VText {
        throw new Error('render method has not been defined.');
    }

}