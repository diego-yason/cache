const Cache = require("../index.js");

 describe("Tests Cache class", () => {

    let cache = new Cache();

    beforeEach(() => {
        cache = new Cache();
    })

    it("can create the Cache", () => {
        expect(cache.length).toBe(0);
    });
    
    it("can add and read values", () => {
        cache.add("test", "hello");
        cache.add("test", "hi", 1);
        cache.add("notest", "lies.", "hello");

        expect(cache.get("test")).toBe("hello");
        expect(cache.get("test", 1)).toBe("hi");
        expect(cache.get("wrong_id")).toBeUndefined();
    });

    it.todo("can block invalid adds");

    it("can detect overwrites", () => {
        cache.add("test", "abc");
        
        expect(cache.add("test", "def").code).toBe(1);
    })
    
    it.todo("can delete values at will");

    it.todo("can have ttl on values");
});