class Cache {

    store = {};
    timeouts = {};

    /**
     * @param {number} defaultTime Time to live in the cache. If left blank, cache will not clear out by default.
     * @param {boolean} [resetTimeOnGet = false] If item was read, the time to live will be reset to default time.
     */
    constructor(defaultTime, resetTimeOnGet, groups) {
        this.defaultTime = defaultTime || null;
        this.reset = resetTimeOnGet || null;
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
        }

        if (group) {
            this.store[group][key] = value;
            this.timeouts[group][key] = setTimeout(() => {
                this.store[group][key] = null;
            }, this.defaultTime);
        } else {
            this.store[key] = value;
            this.timeouts[key] = setTimeout(() => {
                this.store[key] = null;
            }, this.defaultTime);
        }

        returnCode.code = 0;
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
            if (this.store[group][key]) {
                clearTimeout(this.timeouts[group][key]);
                this.timeouts[group][key] = setTimeout(() => {
                    this.store[group][key] = null;
                }, this.defaultTime); 
                return this.store[group][key]
            } else {
                return undefined;
            }
        } else {
            if (this.store[key]) {
                clearTimeout(this.timeouts[key]);
                this.timeouts[key] = setTimeout(() => {
                    this.store[key] = null;
                }, this.defaultTime); 
                return this.store[key]
            } else {
                return undefined;
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
                clearTimeout(this.timeouts[group][key]);
                this.store[group][key] = null;
                return true;
            } else {
                return false;
            }
        } else {
            if (this.store[key]) {
                clearTimeout(this.timeouts[key]);
                this.store[key] = null;
                return true
            } else {
                return false;
            }
        }
    }
}

module.exports = Cache;

const test = new Cache();

console.log(test.add("a", "aaaa"));