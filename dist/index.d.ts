interface VElement {
    type: string;
    props: {};
    children: VNode[];
    node?: HTMLElement | SVGElement;
    key?: any;
}
declare type VProps = Record<string, any> | null;
declare type VChildren = VNode[];
interface VText {
    type: string;
    data: string;
    node?: Text;
}
declare type VNode = VElement | VText | null;
declare type stringOrNull = string | null;

declare const h: (type: string, props: VProps, ...children: VChildren) => VElement;
declare const text: (data: string) => VText;

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
    setState(newState: any): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    attributeChangedCallback(propName: string, oldValue: stringOrNull, newValue: stringOrNull): void;
    componentDidConnect(): void;
    componentDidDisconnect(): void;
    componentWillLoad(): Promise<void>;
    componentDidLoad(): void;
    componentShouldUpdate(_oldValue?: any, _newValue?: any, _propName?: string): boolean;
    componentWillRender(): Promise<void>;
    componentDidRender(): void;
    render(_state: any, _props: any): VNode | VText;
}

export { Component, createRef, h, text };
