export interface VNode {
    type: string,
    props: {},
    children: VNode[],
    node?: HTMLElement | SVGElement,
    isSvg?: boolean,
    key?: any
}

export type stringOrNull = string | null;
