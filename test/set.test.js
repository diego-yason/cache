const Cache = require("../index.js");

describe("Tests Cache class", () => {

    let cache = new Cache(); // for intellisense

    beforeEach(() => {
        jest.useRealTimers();
        cache = new Cache();
    })

    it("can create the Cache", () => {
        expect(cache.length).toBe(0);
    });
    
    it("can add and read values", () => {
        cache.add("test", "hello");
        cache.add("test", "hi", 1);
        cache.add("notest", "lies.", "hello");

        expect(cache.get("test").data).toBe("hello");
        expect(cache.get("test", 1).data).toBe("hi");
        expect(cache.get("wrong_id").data).toBeUndefined();
    });

    it("can add null values", () => {
        cache.add("test", null);

        expect(cache.get("test").data).toBeNull();
    });

    it("can block invalid adds", () => {
        expect(cache.add("", "test").code).toBe(-2);
        expect(cache.add("test").code).toBe(-3);
    });

    it("can detect overwrites", () => {
        cache.add("test", "abc");
        
        expect(cache.add("test", "def").code).toBe(1);
    })
    
    it("can delete values at will", () => {
        cache.add("test", "zdc");

        expect(cache.get("test").code).toBe(0);

        cache.remove("test");

        expect(cache.get("test").data).toBeUndefined();
    });

    it("can have ttl on values", () => {
        cache = new Cache(100000);

        jest.useFakeTimers();
        
        cache.add("test", 0);
        
        expect(cache.get("test")).toBeDefined();

        jest.advanceTimersByTime(100000);

        expect(cache.get("test").data).toBeUndefined()

        cache = new Cache(100000, true);

        cache.add("test", 1);

        expect(cache.get("test")).toBeDefined();

        jest.advanceTimersByTime(99999);

        expect(cache.get("test")).toBeDefined();

        jest.advanceTimersByTime(1000);

        expect(cache.get("test")).toBeDefined();

        jest.advanceTimersByTime(100000);

        expect(cache.get("test").data).toBeUndefined();
    });
});