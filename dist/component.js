var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Component_instances, _Component_currentState, _Component_frameRequest, _Component_oldTree, _Component_update, _Component_requestUpdate, _Component_updateProp;
import { deepFreeze, isFn } from "./util.js";
import { patch } from "./vdom.js";
export default class Component extends HTMLElement {
    constructor() {
        super();
        _Component_instances.add(this);
        this.props = {};
        _Component_currentState.set(this, null);
        _Component_frameRequest.set(this, null);
        _Component_oldTree.set(this, null);
        _Component_update.set(this, () => {
            const attributes = Array.from(this.attributes);
            for (const { name, value } of attributes) {
                __classPrivateFieldGet(this, _Component_instances, "m", _Component_updateProp).call(this, name, value);
            }
            const newTree = this.render(this.state, this.props);
            patch(this.rootNode, __classPrivateFieldGet(this, _Component_oldTree, "f"), newTree);
            __classPrivateFieldSet(this, _Component_oldTree, newTree, "f");
        });
        this.rootNode = this;
    }
    set state(newState) {
        __classPrivateFieldSet(this, _Component_currentState, deepFreeze(newState), "f");
    }
    get state() {
        return __classPrivateFieldGet(this, _Component_currentState, "f");
    }
    setState(newState) {
        const nextState = isFn(newState) ? newState(this.state) : newState;
        this.state = nextState;
        __classPrivateFieldGet(this, _Component_instances, "m", _Component_requestUpdate).call(this);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _Component_instances, "m", _Component_requestUpdate).call(this);
        this.componentDidConnect();
    }
    disconnectedCallback() {
        patch(this.rootNode, __classPrivateFieldGet(this, _Component_oldTree, "f"), null);
        this.componentDidDisconnect();
    }
    attributeChangedCallback(propName, prevValue, newValue) {
        if (newValue === prevValue) {
            return;
        }
        __classPrivateFieldGet(this, _Component_instances, "m", _Component_updateProp).call(this, propName, newValue, prevValue);
        __classPrivateFieldGet(this, _Component_instances, "m", _Component_requestUpdate).call(this);
    }
    componentDidConnect() { }
    componentDidDisconnect() { }
    render(_state) { }
}
_Component_currentState = new WeakMap(), _Component_frameRequest = new WeakMap(), _Component_oldTree = new WeakMap(), _Component_update = new WeakMap(), _Component_instances = new WeakSet(), _Component_requestUpdate = function _Component_requestUpdate() {
    if (__classPrivateFieldGet(this, _Component_frameRequest, "f")) {
        cancelAnimationFrame(__classPrivateFieldGet(this, _Component_frameRequest, "f"));
    }
    __classPrivateFieldSet(this, _Component_frameRequest, requestAnimationFrame(__classPrivateFieldGet(this, _Component_update, "f")), "f");
}, _Component_updateProp = function _Component_updateProp(name, value) {
    if (!this.constructor.propTypes) {
        throw new Error(`No PropTypes have been defined.`);
    }
    const type = this.constructor.propTypes[name];
    if (!type) {
        throw new Error(`PropType for property ${name} has not been specified.`);
    }
    this.props[name] = type(value);
};
