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
declare type stringOrNull = string | null;

declare const h: (type: string, props: any, ...children: any[]) => VNode;
declare const svg: (type: string, props: any, ...children: any[]) => VNode;
declare const text: (data: any) => VText;

declare function createRef(current?: any): {
    current: any;
};

declare class Component extends HTMLElement {
    #private;
    props: {};
    rootNode: this | ShadowRoot;
    static propTypes: any;
    set state(newState: any);
    get state(): any;
    constructor();
    setState(newState: any): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    attributeChangedCallback(propName: string, oldValue: stringOrNull, newValue: stringOrNull): void;
    componentDidConnect(): void;
    componentDidDisconnect(): void;
    componentWillLoad(): Promise<void>;
    componentDidLoad(): void;
    componentShouldUpdate(_oldValue?: any, _newValue?: any, _propName?: string): void;
    componentWillRender(): Promise<void>;
    componentDidRender(): void;
    render(_state: any, _props: any): VNode | VText;
}

export { Component, createRef, h, svg, text };
