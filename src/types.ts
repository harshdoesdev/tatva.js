export interface VNode {
    type: string,
    props: {},
    children: VNode[],
    node?: HTMLElement | SVGElement,
    isSvg?: boolean,
    key?: any
}

export interface VText {
    type: string,
    data: any,
    node?: Text
}
