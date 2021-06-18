const { clear } = require("console");

class Cache {

    store = {};
    timeouts = {};
    length = 0;

    /**
     * @param {number} defaultTime Time to live in the cache. If left blank, cache will not clear out by default.
     * @param {boolean} [resetTimeOnGet = false] If item was read, the time to live will be reset to default time.
     * @param {Array<any>} [groups = []] Array of group names to initialize with 
     */
    constructor(defaultTime = null, resetTimeOnGet = false, groups = []) {
        // type checking
        if (!(defaultTime == null || typeof defaultTime == "number")) {
            // not null or number
            throw new TypeError("Incorrect type for defaultTime. Valid types: number or null");
        }

        if (typeof resetTimeOnGet != "boolean") {
            throw new TypeError("Incorrect type for resetTimeOnGet. Valid type: boolean.");
        }

        if (!Array.isArray(groups)) {
            throw new TypeError("groups is not an array.");
        }
        
        this.defaultTime = defaultTime;
        this.reset = resetTimeOnGet;

        for (let i = 0; i < groups.length; i++) {
            this.timeouts[groups[i]] = {};
            this.store[groups[i]] = {};
        }
    }

    /**
     * If there is an existing key, the value will be overridden.
     * @param {any} key Key of the value, used as the reference
     * @param {any} value Value that will be given when read from the key
     * @param {string | number} [group = null] Under what group name/number will the value be? If blank, assume no group
     * @returns {number} See return_codes.txt for details
     */
    add = (key, value, group) => {
        const returnCode = {
            code: null,
            data: {}
        };

        if (!key && !value) {
            returnCode.code = -4;
            return returnCode;
        } else if (!key) {
            returnCode.code = -2;
            returnCode.data["value"] = value;
            return returnCode;
        } else if (typeof value == "undefined") {
            returnCode.code = -3;
            returnCode.data["key"] = key;
            return returnCode;
        } else if (!(typeof group == "string" || typeof group == "number" || typeof group == "undefined")) {
            returnCode.code = -5;
            returnCode.data = {
                key: key,
                value: value
            };
            return returnCode;
        }

        if (group) {
            if (!this.store[group]) {
                this.store[group] = {};
                this.timeouts[group] = {};
            }

            if (this.store[group][key]) {
                returnCode.code = 1;
            }

            this.store[group][key] = value;

            if (this.defaultTime) {
                this.timeouts[group][key] = setTimeout(() => {
                    this.store[group][key] = undefined;
                    this.length--;
                }, this.defaultTime);
            }
        } else {

            if (this.store[key]) {
                returnCode.code = 1;
            }

            this.store[key] = value;

            if (this.defaultTime) {
                this.timeouts[key] = setTimeout(() => {
                    this.store[key] = undefined;
                    this.length--;
                }, this.defaultTime);
            }
        }

        this.length++;

        returnCode.code = returnCode.code || 0;
        returnCode.data = {
            key: key,
            value: value
        };
        return returnCode;
    }

    /**
     * Get values added to the cache
     * @param {*} key Identifier of the value
     * @param {*} [group = null] Under what group the value is
     * @returns {any | undefined} Only returns undefined if key was not added or it has timed out 
     */
    get = (key, group) => {
        if (group) {
            if (typeof this.store[group][key] != "undefined") {
                if (this.defaultTime && this.reset) {
                    clearTimeout(this.timeouts[group][key]);
                    this.timeouts[group][key] = setTimeout(() => {
                        this.store[group][key] = undefined;
                        this.length--;
                    }, this.defaultTime); 
                }
                return { code: 0, data: this.store[group][key] };
            } else {
                return { code: 0, data: undefined };
            }
        } else {
            if (typeof this.store[key] != "undefined") {
                if (this.defaultTime) {
                    clearTimeout(this.timeouts[key]);
                    this.timeouts[key] = setTimeout(() => {
                        this.store[key] = undefined;
                        this.length--;
                    }, this.defaultTime); 
                }
                return { code: 0, data: this.store[key] };
            } else {
                return { code: 0, data: undefined };
            }
        }
    }

    /**
     * Get values added to the cache
     * @param {*} key Identifier of the value
     * @param {*} [group = null] Under what group the value is
     * @returns {boolean} Returns true when removed 
     */
    remove = (key, group) => {
        if (group) {
            if (this.store[group][key]) {
                if (this.defaultTime) {
                    clearTimeout(this.timeouts[group][key]);
                }
                this.store[group][key] = undefined;
                this.length--;
                return true;
            } else {
                return false;
            }
        } else {
            if (this.store[key]) {
                if (this.defaultTime) {
                    clearTimeout(this.timeouts[key]);
                }
                this.store[key] = undefined;
                this.length--;
                return true
            } else {
                return false;
            }
        }
    }

    /**
     * Resets Cache to default state
     */
    clear = () => {
        this.store = {};
        this.length = 0;

        const remove = objs => {
            Object.values(objs).forEach(value => {
                if (value.constructor.name == "Timeout") {
                    clearTimeout(value);
                } else {
                    remove(value);
                }
            })
        }

        remove(this.timeouts);
    }
}

module.exports = Cache;