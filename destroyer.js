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
    const _console_log = console.log;
    const _Array_forEach = Array.prototype.forEach;
    const forEach = (arr, callback, thisArg) => call(
        _Array_forEach
        ,arr
        ,[callback, thisArg]
    );

    const visitedObjects = new _WeakSet;

    const destroy = (scope, recurseProperties) => {
        if (null === scope) return;
        if ('object' != typeof scope && 'function' != typeof scope) return;

        if (call(_WeakSet_has, visitedObjects, [scope])) return;
        call(_WeakSet_add, visitedObjects, [scope]);
        
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
                destroy(getPrototypeOf(scope), recurseProperties);
            } catch (e) {
                //_console_log(scope, e);
            }

            if (recurseProperties) {
                forEach(
                    keys
                    ,(key) => {
                        try {
                            destroy(saved[key], true);
                        } catch (e) {
                            //_console_log(scope, e);
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

        try {
            const keys = ownKeys(scope);
            if (keys) {
                _console_log('Not deleted:', scope, keys);
            }
        } catch (e) {
            _console_log(scope, e);
        }
    };

    globalThis.destroy = destroy;
}