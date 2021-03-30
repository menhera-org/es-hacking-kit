'use strict';
{
    // Preserve important objects
    const getPrototypeOf = Reflect.getPrototypeOf;
    const ownKeys = Reflect.ownKeys;
    const call = Reflect.apply;
    const construct = Reflect.construct;
    const _Object = Object;
    const _Object_is = Object.is;
    const _Object_create = Object.create;
    const _Object_freeze = Object.freeze;
    const _Object_prototype = Object.prototype;
    const _WeakSet = WeakSet;
    const _WeakSet_has = WeakSet.prototype.has;
    const _WeakSet_add = WeakSet.prototype.add;
    const _WeakSet_delete = WeakSet.prototype.delete;
    const _console_log = console ? ('function' == typeof console.log ? console.log : () => {}) : () => {};
    const _Array_forEach = Array.prototype.forEach;
    const _JSON_stringify = JSON.stringify;
    const forEach = (arr, callback, thisArg) => call(
        _Array_forEach
        ,arr
        ,[callback, thisArg]
    );

    const weakset_add = (weakSet, obj) => call(_WeakSet_add, weakSet, [obj]);
    const weakset_has = (weakSet, obj) => call(_WeakSet_has, weakSet, [obj]);
    const weakset_delete = (weakSet, obj) => call(_WeakSet_delete, weakSet, [obj]);

    const visitedObjects = new _WeakSet;

    const destroy = (scope, recurseProperties) => {
        if (null === scope) return null;
        if ('object' != typeof scope && 'function' != typeof scope) return null;

        if (weakset_has(visitedObjects, scope)) return '<recursion>';
        weakset_add(visitedObjects, scope);

        const results = _Object_create(null);
        
        if (recurseProperties || !_Object_is(scope, _Object_prototype)) {
            const keys = ownKeys(scope);
            const saved = _Object_create(null);
            forEach(
                keys
                ,(key) => {
                    try {
                        try {
                            saved[key] = scope[key];
                        } catch (e) {
                            //_console_log(scope, e);
                        }
                        delete scope[key];
                    } catch (e) {
                        //_console_log(scope, e);
                    }
                }
            );

            try {
                results.__proto__ = destroy(getPrototypeOf(scope), recurseProperties);
            } catch (e) {
                //_console_log(scope, e);
                results.__proto__ = '<error>';
            }

            if (recurseProperties) {
                forEach(
                    keys
                    ,(key) => {
                        try {
                            results[key] = destroy(saved[key], true);
                        } catch (e) {
                            //_console_log(scope, e);
                            results[key] = '<error>';
                        }
                    }
                );
            }
        }

        try {
            _Object_freeze(scope);
        } catch (e) {
            _console_log(scope, e);
        }

        const remains = _Object_create(null);
        remains.__proto__ = results.__proto__ || null;
        try {
            const keys = ownKeys(scope);
            forEach(
                keys
                ,(key) => {
                    remains[key] = results[key] || null;
                }
            );
        } catch (e) {
            _console_log(scope, e);
        }
        return remains;
    };

    globalThis.destroy = destroy;

    globalThis.destroyGlobalThis = (recurseProperties) => {
        const msg = 'remains: ' + _JSON_stringify(destroy(globalThis, recurseProperties), null, 4);
        return msg;
    };
}