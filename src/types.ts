export interface VElement {
    type: string,
    props: {},
    children: VNode[],
    node?: HTMLElement | SVGElement,
    key?: any
}

export type VProps = Record<string, any> | null;

export type VChildren = VNode[];

export interface VText {
    type: string,
    data: string,
    node?: Text
}

export type VNode = VElement | VText | null;

export type stringOrNull = string | null;
