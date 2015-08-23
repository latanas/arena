/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/
/// <reference path="../color.ts" />

describe("Color", () => {
  it("should construct a new colour", () => {
    var c:Color = new Color(0.1, 0.2, 0.3, 0.4);

    expect(c.r).toEqual(0.1);
    expect(c.g).toEqual(0.2);
    expect(c.b).toEqual(0.3);
    expect(c.a).toEqual(0.4);
  });

  it("should return valid CSS string", () => {
    var c:Color = null;

    c = new Color(0.0, 0.0, 0.0, 0.0);
    expect( c.css() ).toEqual( "rgba(0,0,0,0)");

    c = new Color(1.0, 0.0, 0.0, 0.0);
    expect( c.css() ).toEqual( "rgba(255,0,0,0)");

    c = new Color(0.0, 1.0, 0.0, 0.0);
    expect( c.css() ).toEqual( "rgba(0,255,0,0)");

    c = new Color(0.0, 0.0, 1.0, 0.0);
    expect( c.css() ).toEqual( "rgba(0,0,255,0)");

    c = new Color(0.0, 0.0, 0.0, 1.0);
    expect( c.css() ).toEqual( "rgba(0,0,0,1)");

    c = new Color(0.5, 0.5, 0.5, 0.5);
    expect( c.css() ).toEqual( "rgba(128,128,128,0.5)");
  });

  it("should limit components to the valid RGBA range", () => {
    var c:Color = null;

    c = new Color(-1.0, -1.0, -1.0, -1.0);
    expect( c.css() ).toEqual( "rgba(0,0,0,0)");

    c = new Color(2.0, 3.0, 4.0, 5.0);
    expect( c.css() ).toEqual( "rgba(255,255,255,1)");
  });
});
