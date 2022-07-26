interface VNode {
    type: string;
    props: {};
    children: VNode[];
    node?: HTMLElement | SVGElement;
    isSvg?: boolean;
    key?: any;
}
interface VText {
    type: string;
    data: any;
    node?: Text;
}

declare const h: (type: string, props: any, ...children: any[]) => VNode;
declare const svg: (type: string, props: any, ...children: any[]) => VNode;
declare const text: (data: any) => VText;

declare function createRef(current?: any): {
    current: any;
};

declare type stringOrNull = string | null;
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
    attributeChangedCallback(propName: string, prevValue: stringOrNull, newValue: stringOrNull): void;
    componentDidConnect(): void;
    componentDidDisconnect(): void;
    render(_state: any, _props: any): VNode | VText;
}

export { Component, createRef, h, svg, text };
