/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/
/// <reference path="../projectile.ts" />

describe("Projectile", () => {
  it("should construct a new projectile", () => {
    var p:Projectile = new Projectile( new PolarCoordinate(0.1, 0.2) );

    expect(p.position.angle).toEqual(0.1);
    expect(p.position.radius).toEqual(0.2);
  });

  it("should animate position", () => {
    var p:Projectile = new Projectile( new PolarCoordinate(1.0, 1.0) );
    p.animate(0.1, 0.0);

    expect(p.position.radius).toEqual(0.9);
  });

  it("should respond to 'discard?' communication", () => {
    var p:Projectile = new Projectile( new PolarCoordinate() );
    expect( p.ask({verb: "discard?"}) ).toEqual( {verb: "smile!"} );

    p.animate(2.0, 0.0);
    expect( p.ask({verb: "discard?"}) ).toEqual({verb: "discard!"});
  });

  it("should respond to 'collide?' communication", () => {
    var p1:Projectile = new Projectile( new PolarCoordinate() );
    var p2:Projectile = new Projectile( new PolarCoordinate() );
    var s2:Spaceship  = new Spaceship( new PolarCoordinate() );

    expect( p1.ask({verb: "collide?", argument: p2}) ).toEqual( {verb: "smile!"} );
    expect( p1.ask({verb: "collide?", argument: s2}) ).toEqual( {verb: "smile!"} );

    p1.speed = 0.0;
    p1.animate(0.5, 0.0); // .5 is "Ghost" time

    expect( p1.ask({verb: "collide?", argument: p2}) ).toEqual( {verb: "smile!"} );
    expect( p1.ask({verb: "collide?", argument: s2}) ).toEqual( {verb: "collide!", argument:1} );

    p1.position.radius = p1.position.areal*1.1;

    expect( p1.ask({verb: "collide?", argument: p2}) ).toEqual({verb: "smile!"});
    expect( p1.ask({verb: "collide?", argument: s2}) ).toEqual({verb: "smile!"});
  });

  it("should detect collisions", () => {
    var p:Projectile = new Projectile( new PolarCoordinate(0.0, 1.0) );
    var s:Spaceship = new Spaceship( new PolarCoordinate() );

    var distanceToAngle = (d: number) => {
      return Math.acos( (2.0-d*d)/2.0 );
    }

    s.position = new PolarCoordinateAreal(0.0, 1.0, p.position.areal);
    expect( p.isCollision(s) ).toBeTruthy();

    s.position = new PolarCoordinateAreal( 0.0, 1.0 + p.position.areal * 1.99, p.position.areal);
    expect( p.isCollision(s) ).toBeTruthy();

    s.position = new PolarCoordinateAreal( 0.0, 1.0 - p.position.areal * 1.99, p.position.areal);
    expect( p.isCollision(s) ).toBeTruthy();

    s.position = new PolarCoordinateAreal( distanceToAngle(p.position.areal) * 1.99, 1.0, p.position.areal);
    expect( p.isCollision(s) ).toBeTruthy();

    s.position = new PolarCoordinateAreal( 0.0, 1.0 + p.position.areal * 2.10, p.position.areal);
    expect( p.isCollision(s) ).toBeFalsy();

    s.position = new PolarCoordinateAreal( distanceToAngle(p.position.areal) * 2.10, 1.0, p.position.areal);
    expect( p.isCollision(s) ).toBeFalsy();
  });
});
