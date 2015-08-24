/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/
/// <reference path="../polar_coordinate.ts" />
/// <reference path="../vector.ts" />

describe("PolarCoordinate", () => {
  it("should construct a new polar coordinate", () => {
    var c:PolarCoordinate = new PolarCoordinate( Math.PI, 0.1 );

    expect(c.angle).toEqual( Math.PI );
    expect(c.radius).toEqual( 0.1 );
  });

  it("should make a copy of itself", () => {
    var c1:PolarCoordinate = new PolarCoordinate( Math.PI, 0.1 );
    var c2:PolarCoordinate = c1.copy();

    expect(c2).not.toBe(c1); // (c2 should be a new instance)
    expect(c2.angle).toEqual( Math.PI );
    expect(c2.radius).toEqual( 0.1 )
  });

  it("should convert into vector", () => {
    var c:PolarCoordinate = null;
    var v:Vector = null;

    c = new PolarCoordinate( 0.0, 0.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    c = new PolarCoordinate( 0.0, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( 1.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    c = new PolarCoordinate( Math.PI * 0.1, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( limitPrecision(Math.cos(Math.PI * 0.1)) );
    expect( limitPrecision(v.y) ).toEqual( limitPrecision(Math.sin(Math.PI * 0.1)) );

    c = new PolarCoordinate( Math.PI * 0.5, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 1.0 );

    c = new PolarCoordinate( Math.PI * 0.8, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( limitPrecision(Math.cos(Math.PI * 0.8)) );
    expect( limitPrecision(v.y) ).toEqual( limitPrecision(Math.sin(Math.PI * 0.8)) );

    c = new PolarCoordinate( Math.PI, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( -1.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    c = new PolarCoordinate( Math.PI * 1.5, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( limitPrecision(Math.cos(Math.PI * 1.5)) );
    expect( limitPrecision(v.y) ).toEqual( limitPrecision(Math.sin(Math.PI * 1.5)) );

    c = new PolarCoordinate( Math.PI * 2.0, 1.0 );
    v = c.vector();
    expect( limitPrecision(v.x) ).toEqual( 1.0 );
    expect( Math.abs(limitPrecision(v.y)) ).toEqual( 0.0 );
  });

  it("should construct a new polar coordinate with area of effect", () => {
    var c:PolarCoordinateAreal = new PolarCoordinateAreal( Math.PI, 0.1, 0.2 );

    expect(c.angle).toEqual( Math.PI );
    expect(c.radius).toEqual( 0.1 );
    expect(c.areal).toEqual( 0.2 );
  });

  it("should be able to convert areal", () => {
    var ca:PolarCoordinateAreal = new PolarCoordinateAreal( Math.PI, 0.1, 0.2 );
    var c:PolarCoordinate = <PolarCoordinate> ca;

    expect(c.angle).toEqual( Math.PI );
    expect(c.radius).toEqual( 0.1 );
  });

  it("should make a copy areal", () => {
    var c1:PolarCoordinateAreal = new PolarCoordinateAreal( Math.PI, 0.1, 0.2 );
    var c2:PolarCoordinateAreal = c1.copy();

    expect(c2).not.toBe(c1); // (c2 should be a new instance)
    expect(c2.angle).toEqual( Math.PI );
    expect(c2.radius).toEqual( 0.1 )
    expect(c2.areal).toEqual( 0.2 );
  });
});
