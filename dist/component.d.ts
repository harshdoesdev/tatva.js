export default class Component extends HTMLElement {
    props: {};
    state: any;
    rootNode: Component;
    setState(newState: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(propName: any, prevValue: any, newValue: any): void;
    componentDidConnect(): void;
    componentDidDisconnect(): void;
    render(_state: any): void;
    #private;
}
