/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/
/// <reference path="../vector.ts" />

describe("Vector", () => {
  it("should construct a new vector", () => {
    var v:Vector = new Vector(0.1, 0.2);

    expect(v.x).toEqual(0.1);
    expect(v.y).toEqual(0.2);
  });

  it("should make a copy of itself", () => {
    var v1:Vector = new Vector(0.3, 0.4);
    var v2:Vector = v1.copy();

    expect(v2).not.toBe(v1); // (v2 should be a new instance)
    expect(v2.x).toEqual(0.3);
    expect(v2.y).toEqual(0.4)
  });

  it("should calculate 2D distance", () => {
    var v: Vector = null;

    v = new Vector(0.0, 0.0);
    expect( v.distance() ).toEqual(0.0);

    v = new Vector(1.0, 0.0);
    expect( v.distance() ).toEqual(1.0);

    v = new Vector(0.0, 1.0);
    expect( v.distance() ).toEqual(1.0);

    v = new Vector(10.0, 0.0);
    expect( v.distance() ).toEqual( 10.0 );

    v = new Vector(0.0, 0.10);
    expect( v.distance() ).toEqual( 0.10 );

    v = new Vector(1.0, 1.0);
    expect( limitPrecision(v.distance()) ).toEqual( 1.414 );

    v = new Vector(-1.0, 1.0);
    expect( limitPrecision(v.distance()) ).toEqual( 1.414 );

    v = new Vector(1.0, -1.0);
    expect( limitPrecision(v.distance()) ).toEqual( 1.414 );

    v = new Vector(5.0, 10.0);
    expect( limitPrecision(v.distance()) ).toEqual( 11.180 );

    v = new Vector(0.5, 1.0);
    expect( limitPrecision(v.distance()) ).toEqual( 1.118 );
  });

  it("should add two vectors", () => {
    var v: Vector = null;

    v = Vector.plus( new Vector(0.0, 0.0), new Vector(0.0, 0.0) );
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    v = Vector.plus( new Vector(1.0, 0.0), new Vector(0.0, 1.0) );
    expect( limitPrecision(v.x) ).toEqual( 1.0 );
    expect( limitPrecision(v.y) ).toEqual( 1.0 );

    v = Vector.plus( new Vector(1.0, 2.0), new Vector(3.0, 4.0) );
    expect( limitPrecision(v.x) ).toEqual( 4.0 );
    expect( limitPrecision(v.y) ).toEqual( 6.0 );
  });

  it("should substract two vectors", () => {
    var v: Vector = null;

    v = Vector.minus( new Vector(0.0, 0.0), new Vector(0.0, 0.0) );
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    v = Vector.minus( new Vector(1.0, 0.0), new Vector(0.0, 1.0) );
    expect( limitPrecision(v.x) ).toEqual( 1.0 );
    expect( limitPrecision(v.y) ).toEqual( -1.0 );

    v = Vector.minus( new Vector(1.0, 2.0), new Vector(3.0, 4.0) );
    expect( limitPrecision(v.x) ).toEqual( -2.0 );
    expect( limitPrecision(v.y) ).toEqual( -2.0 );
  });

  it("should scale a vecor by constant multiplier", () => {
    var v: Vector = null;

    v = Vector.scale( new Vector(0.0, 0.0), 10 );
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    v = Vector.scale( new Vector(1.0, 1.0), 0 );
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    v = Vector.scale( new Vector(1.0, 0.0), 10 );
    expect( limitPrecision(v.x) ).toEqual( 10.0 );
    expect( limitPrecision(v.y) ).toEqual( 0.0 );

    v = Vector.scale( new Vector(0.0, 1.0), 10 );
    expect( limitPrecision(v.x) ).toEqual( 0.0 );
    expect( limitPrecision(v.y) ).toEqual( 10.0 );

    v = Vector.scale( new Vector(1.0, 2.0), 10 );
    expect( limitPrecision(v.x) ).toEqual( 10.0 );
    expect( limitPrecision(v.y) ).toEqual( 20.0 );

    v = Vector.scale( new Vector(1.0, 2.0), 0.1 );
    expect( limitPrecision(v.x) ).toEqual( 0.1 );
    expect( limitPrecision(v.y) ).toEqual( 0.2 );

    v = Vector.scale( new Vector(1.0, 2.0), -0.1 );
    expect( limitPrecision(v.x) ).toEqual( -0.1 );
    expect( limitPrecision(v.y) ).toEqual( -0.2 );

    v = Vector.scale( new Vector(-1.0, -2.0), -0.1 );
    expect( limitPrecision(v.x) ).toEqual( 0.1 );
    expect( limitPrecision(v.y) ).toEqual( 0.2 );
  });
});
