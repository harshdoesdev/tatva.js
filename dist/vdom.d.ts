export function h(type: any, props: any, ...children: any[]): {
    type: any;
    props: any;
    children: any[];
};
export function svg(type: any, props: any, ...children: any[]): {
    type: any;
    props: any;
    children: any[];
    isSvg: boolean;
};
export function text(data: any): {
    type: string;
    data: any;
};
export function patch(rootNode: any, oldTree: any, newTree: any): void;
