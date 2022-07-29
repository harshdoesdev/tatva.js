export const deepFreeze = (obj: any) => {
    Object.values(obj).forEach(value => {
        if(typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });

    return Object.freeze(obj);
};

export const kindOf = (v: any) => typeof v;

export const isFn = (v: any) => kindOf(v) === 'function';

export const isStr = (v: any) => kindOf(v) === 'string';