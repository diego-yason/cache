const index = require("../index.js");

describe("Tests Cache class", () => {

    it("can create the Cache", () => {
        const cache = new index();
        expect(cache.length).toBe(0);
    });
    
    it("can add values", () => {
        const cache = new index();
        cache.add("test", "hello");
        cache.add("test", "hi", 1);
        cache.add("notest", "lies.", "hello");

        expect(cache.get("test")).toBe("hello");
        expect(cache.get("test", 1)).toBe("hi");
        expect(cache.get("wrong_id")).toBeUndefined();
    });

    it.todo("can block invalid adds");
    
    it.todo("can read values");
    
    it.todo("can delete values at will");

    it.todo("can have ttl on values");
});