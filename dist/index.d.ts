interface VNode {
    type: string;
    props: {};
    children: VNode[];
}
interface VSVGNode extends VNode {
    isSvg: boolean;
}
interface VTextNode {
    type: string;
    data: any;
}
declare const h: (type: string, props: any, ...children: any[]) => VNode;
declare const svg: (type: string, props: any, ...children: any[]) => VSVGNode;
declare const text: (data: any) => VTextNode;

declare class Component extends HTMLElement {
    #private;
    props: {};
    rootNode: this | ShadowRoot;
    static propTypes: any;
    set state(newState: any);
    get state(): any;
    constructor();
    setState(newState: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(propName: string, prevValue: string | null, newValue: string | null): void;
    componentDidConnect(): void;
    componentDidDisconnect(): void;
    render(_state: any, _props: any): void;
}

export { Component, h, svg, text };
