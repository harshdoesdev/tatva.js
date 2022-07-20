import { kindOf } from "./util.js";
const TEXT_NODE = '#text';
const SVG_NS = 'http://www.w3.org/2000/svg';
const EVENT_LISTENER_RGX = /^on/;
export const h = (type, props, ...children) => ({ type, props, children });
export const svg = (type, props, ...children) => ({ type, props, children, isSvg: true });
export const text = data => ({ type: TEXT_NODE, data });
const propIsCSSVar = v => v[0] === '-' && v[1] === '-';
const patchStyles = (node, oldStyles, newStyles) => {
    const styles = Object.assign(Object.assign({}, oldStyles), newStyles);
    for (const [prop, value] of Object.entries(styles)) {
        const oldStyleValue = oldStyles[prop];
        if (newStyles[prop]) {
            if (oldStyleValue !== value) {
                if (propIsCSSVar(prop)) {
                    node.style.setProperty(prop, value);
                }
                else {
                    node.style[prop] = value;
                }
            }
        }
        else {
            node.style.removeProperty(prop);
        }
    }
};
const strToClassList = str => str.trim().split(/\s+/);
const patchClassList = (node, oldClassList, newClassList) => {
    const classes = [...oldClassList, ...newClassList];
    for (let i = 0; i < classes.length; i++) {
        const className = classes[i];
        if (!oldClassList.includes(className)) {
            node.classList.add(className);
        }
        else if (!newClassList.includes(className)) {
            node.classList.remove(className);
        }
    }
};
const setProp = (node, key, value, isSvg = false) => {
    if (key === 'key') {
    }
    else if (value == null || value === false) {
        node.removeAttribute(key);
    }
    else if (key === 'style' && kindOf(value) !== 'string') {
        patchStyles(node, {}, value);
    }
    else {
        if (isSvg) {
            if (EVENT_LISTENER_RGX.test(key)) {
                node[key] = value;
            }
            else {
                node.setAttribute(key, value);
            }
        }
        else {
            node[key] = value;
        }
    }
};
const createDomNode = (vnode) => {
    if (!vnode) {
        return;
    }
    if (vnode.type === TEXT_NODE) {
        const textNode = document.createTextNode(vnode.data);
        vnode.node = textNode;
        return textNode;
    }
    const { type, props, children } = vnode;
    const node = vnode.isSvg
        ? document.createElementNS(SVG_NS, type)
        : document.createElement(type);
    for (const [key, value] of Object.entries(props)) {
        setProp(node, key, value, vnode.isSvg);
    }
    if (children.length) {
        const fragment = document.createDocumentFragment();
        children.forEach(vChild => {
            if (!vChild) {
                return;
            }
            const childNode = createDomNode(vChild);
            fragment.appendChild(childNode);
        });
        node.appendChild(fragment);
    }
    vnode.node = node;
    return node;
};
const patchChildren = (node, oldChildren, newChildren) => {
    const children = Array.from(node.children);
    const length = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < length; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        if (oldChild) {
            patch(node, oldChild, newChild);
        }
        else if (newChild) {
            const nodeChild = children[i];
            const newChildNode = createDomNode(newChild);
            if (nodeChild) {
                node.insertBefore(newChildNode, nodeChild);
            }
            else {
                node.appendChild(newChildNode);
            }
        }
    }
};
const patchProps = (node, oldProps, newProps, isSvg = false) => {
    const props = Object.assign(Object.assign({}, oldProps), newProps);
    for (const [key, value] of Object.entries(props)) {
        if (Reflect.has(newProps, key)) {
            const oldValue = oldProps[key];
            if (oldValue !== value) {
                if (key === 'className') {
                    patchClassList(node, strToClassList(oldValue), strToClassList(value));
                }
                else if (key === 'style' && kindOf(value) !== 'string') {
                    patchStyles(node, oldValue, value);
                }
                else {
                    setProp(node, key, value, isSvg);
                }
            }
        }
        else {
            node.removeAttribute(key);
        }
    }
};
const destroyVNode = vnode => {
    if (vnode.type !== TEXT_NODE) {
        let child;
        while (child = vnode.node.lastChild) {
            child.remove();
        }
    }
    vnode.node.remove();
    vnode.node = null;
};
export const patch = (rootNode, oldTree, newTree) => {
    if (!oldTree && newTree) {
        const node = createDomNode(newTree);
        rootNode.appendChild(node);
    }
    else if (!newTree) {
        destroyVNode(oldTree);
    }
    else if (oldTree.type === newTree.type) {
        if (oldTree.type === TEXT_NODE) {
            if (oldTree.data !== newTree.data) {
                oldTree.node.data = newTree.data;
            }
        }
        else if (oldTree.key === newTree.key) {
            patchChildren(oldTree.node, oldTree.children, newTree.children);
            patchProps(oldTree.node, oldTree.props, newTree.props, newTree.isSvg);
        }
        newTree.node = oldTree.node;
    }
    else {
        const newNode = createDomNode(newTree);
        rootNode.insertBefore(newNode, oldTree.node);
        destroyVNode(oldTree);
    }
};
