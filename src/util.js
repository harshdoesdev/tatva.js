export const deepFreeze = obj => {
    Object.values(obj).forEach(value => {
        if(typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });

    return Object.freeze(obj);
};

const objProto = {};

export const isPlainObj = v => objProto.toString.call(v) === '[object Object]';

export const kindOf = v => typeof v;

export const isFn = v => kindOf(v) === 'function';