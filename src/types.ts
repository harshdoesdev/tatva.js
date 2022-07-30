export interface VNode {
    type: string,
    props: {},
    children: VNode[],
    node?: HTMLElement | SVGElement,
    key?: any
}

export type Props = Record<string, any> | null;

export interface VText {
    type: string,
    data: string,
    node?: Text
}

export type stringOrNull = string | null;
