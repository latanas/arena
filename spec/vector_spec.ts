/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../vector.ts" />

describe("Test Class Vector", () => {
  it("should construct a vector", () => {
    var v:Vector = new Vector(1.0, 2.0);
    expect(v.x).toBe(1.0);
    expect(v.y).toBe(2.0);
  });
});
