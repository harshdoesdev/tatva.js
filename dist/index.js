const deepFreeze = (obj) => {
  Object.values(obj).forEach((value) => {
    if (typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
};
const kindOf = (v) => typeof v;
const isFn = (v) => kindOf(v) === "function";

const TEXT_NODE = "#text";
const SVG_NS = "http://www.w3.org/2000/svg";
const EVENT_LISTENER_RGX = /^on/;
const h = (type, props, ...children) => ({ type, props, children });
const text = (data) => ({ type: TEXT_NODE, data });
const strToClassList = (str) => str.trim().split(/\s+/);
const setProp = (node, key, value) => {
  if (key === "key") ; else if (key === "ref") {
    if (isFn(value)) {
      value(node);
    } else {
      value.current = node;
    }
  } else if (value == null || value === false) {
    node.removeAttribute(key);
  } else if (key === "style" && kindOf(value) !== "string") {
    patchStyles(node, {}, value);
  } else {
    if (EVENT_LISTENER_RGX.test(key)) {
      node[key] = value;
    } else if (key === "value") {
      node.value = value;
    } else {
      node.setAttribute(key, value);
    }
  }
};
const createDomNode = (vnode, isSvg = false) => {
  if (!vnode) {
    return;
  }
  if (vnode.type === TEXT_NODE) {
    const textNode = document.createTextNode(vnode.data);
    vnode.node = textNode;
    return textNode;
  }
  const { type, props, children } = vnode;
  isSvg ||= type === "svg";
  const node = isSvg ? document.createElementNS(SVG_NS, type) : document.createElement(type);
  for (const [key, value] of Object.entries(props)) {
    setProp(node, key, value);
  }
  if (children.length) {
    const fragment = document.createDocumentFragment();
    children.forEach((vChild) => {
      if (!vChild) {
        return;
      }
      const childNode = createDomNode(vChild, isSvg);
      fragment.appendChild(childNode);
    });
    node.appendChild(fragment);
  }
  vnode.node = node;
  return node;
};
const patchStyles = (node, oldStyles, newStyles) => {
  const styles = { ...oldStyles, ...newStyles };
  for (const [prop, value] of Object.entries(styles)) {
    const oldStyleValue = oldStyles[prop];
    if (newStyles[prop]) {
      if (oldStyleValue !== value) {
        if (prop[0] === "-") {
          node.style.setProperty(prop, value);
        } else {
          node.style[prop] = value;
        }
      }
    } else {
      node.style.removeProperty(prop);
    }
  }
};
const patchClassList = (node, oldClassList, newClassList) => {
  const classes = [...oldClassList, ...newClassList];
  for (let i = 0; i < classes.length; i++) {
    const className = classes[i];
    if (!oldClassList.includes(className)) {
      node.classList.add(className);
    } else if (!newClassList.includes(className)) {
      node.classList.remove(className);
    }
  }
};
const patchChildren = (node, oldChildren, newChildren, isSvg) => {
  const children = Array.from(node.children);
  const length = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < length; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    if (oldChild) {
      patch(node, oldChild, newChild, isSvg);
    } else if (newChild) {
      const newChildNode = createDomNode(newChild);
      const nodeChild = children[i];
      if (nodeChild) {
        node.insertBefore(newChildNode, nodeChild);
      } else {
        node.appendChild(newChildNode);
      }
    }
  }
};
const patchProps = (node, oldProps, newProps) => {
  const props = { ...oldProps, ...newProps };
  for (const [key, value] of Object.entries(props)) {
    if (Reflect.has(newProps, key)) {
      const oldValue = oldProps[key];
      if (oldValue !== value) {
        if (key === "class") {
          patchClassList(node, strToClassList(oldValue), strToClassList(value));
        } else if (key === "style" && kindOf(value) !== "string") {
          patchStyles(node, oldValue, value);
        } else {
          setProp(node, key, value);
        }
      }
    } else {
      node.removeAttribute(key);
    }
  }
};
const destroyVNode = (vnode) => {
  if (vnode.type !== TEXT_NODE) {
    let child;
    while (child = vnode.node.lastChild) {
      child.remove();
    }
  }
  vnode.node.remove();
  vnode.node = null;
};
const patch = (rootNode, oldTree, newTree, isSvg = false) => {
  if (!oldTree && newTree) {
    const node = createDomNode(newTree, isSvg);
    rootNode.appendChild(node);
  } else if (!newTree) {
    destroyVNode(oldTree);
  } else if (oldTree.type === newTree.type) {
    if (oldTree.type === TEXT_NODE) {
      if (oldTree.data !== newTree.data) {
        oldTree.node.data = newTree.data;
      }
    } else if (oldTree.key === newTree.key) {
      patchChildren(oldTree.node, oldTree.children, newTree.children, isSvg);
      patchProps(oldTree.node, oldTree.props, newTree.props);
    }
    newTree.node = oldTree.node;
  } else {
    const newNode = createDomNode(newTree, isSvg);
    rootNode.insertBefore(newNode, oldTree.node);
    destroyVNode(oldTree);
  }
};

function createRef(current = null) {
  return { current };
}

class Component extends HTMLElement {
  props = {};
  #currentState = null;
  #frameRequest = null;
  #oldTree = null;
  #hasLoaded = false;
  #hasRendered = false;
  rootNode = this;
  static propTypes;
  set state(newState) {
    this.#currentState = deepFreeze(newState);
  }
  get state() {
    return this.#currentState;
  }
  #reRender = async () => {
    await this.componentWillRender();
    const newTree = this.render(this.state, this.props);
    patch(this.rootNode, this.#oldTree, newTree);
    this.#oldTree = newTree;
    this.componentDidRender();
  };
  #requestReRender() {
    if (this.#frameRequest) {
      cancelAnimationFrame(this.#frameRequest);
      this.#frameRequest = null;
    }
    this.#frameRequest = requestAnimationFrame(this.#reRender);
  }
  #shouldRender(newValue, oldValue, name) {
    return !this.#hasRendered || this.#frameRequest != null ? true : this.componentShouldUpdate(oldValue, newValue, name);
  }
  setState(newState) {
    const nextState = isFn(newState) ? newState(this.state) : newState;
    this.state = nextState;
    if (!this.#shouldRender()) {
      return;
    }
    this.#requestReRender();
  }
  #updateProps() {
    const attributes = Array.from(this.attributes);
    for (const { name, value } of attributes) {
      this.#updateProp(name, value);
    }
  }
  #updateProp(name, value) {
    if (!this.constructor.propTypes) {
      throw new Error(`No PropTypes have been defined.`);
    }
    const type = this.constructor.propTypes[name];
    if (!type) {
      throw new Error(`PropType for property ${name} has not been specified.`);
    }
    const oldValue = this.props[name];
    const newValue = type(value);
    this.props[name] = newValue;
    if (!this.#hasRendered) {
      return true;
    }
    return this.#shouldRender(newValue, oldValue, name);
  }
  async connectedCallback() {
    this.#updateProps();
    if (!this.#hasLoaded) {
      this.#hasLoaded = true;
      await this.componentWillLoad();
    }
    this.#hasRendered = true;
    this.#requestReRender();
    this.componentDidLoad();
    this.componentDidConnect();
  }
  disconnectedCallback() {
    patch(this.rootNode, this.#oldTree, null);
    this.componentDidDisconnect();
  }
  attributeChangedCallback(propName, oldValue, newValue) {
    if (newValue === oldValue) {
      return;
    }
    if (!this.#updateProp(propName, newValue)) {
      return;
    }
    this.#requestReRender();
  }
  componentDidConnect() {
  }
  componentDidDisconnect() {
  }
  async componentWillLoad() {
  }
  componentDidLoad() {
  }
  componentShouldUpdate(_oldValue, _newValue, _propName) {
    return true;
  }
  async componentWillRender() {
  }
  componentDidRender() {
  }
  render(_state, _props) {
    throw new Error("render method has not been defined.");
  }
}

export { Component, createRef, h, text };
//# sourceMappingURL=index.js.map
