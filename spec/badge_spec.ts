/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/
/// <reference path="../badge.ts" />

describe("Badge", () => {
  it("should respond to 'follow!' communication", () => {
    var b:Badge = new Badge();
    expect( b.ask({verb: "follow!", argument: 10}) ).toEqual({verb: "follow!"});
    expect( b.position.radius ).toEqual(10.05);
  });

  it("should respond to 'collide?' communication", () => {
    var b1:Badge = new Badge();
    var b2:Badge = new Badge();
    var msg: DynamicMessage = null;

    b1.position.angle = 0.00001;
    b2.position.angle = 0.0;
    msg = b1.ask({verb: "collide?", argument: b2})

    expect( msg.verb ).toEqual("collide!");
    expect( limitPrecision(msg.argument) ).toEqual( limitPrecision(2.0*Math.PI) );

    b1.position.angle = (b1.position.areal + b2.position.areal)*0.99999;
    b2.position.angle = 0.0;
    msg = b1.ask({verb: "collide?", argument: b2})

    expect( msg.verb ).toEqual("collide!");
    expect( limitPrecision(msg.argument) ).toEqual( 0.0 );

    b1.position.angle = (b1.position.areal + b2.position.areal)*1.1;
    b2.position.angle = 0.0;

    expect( b1.ask({verb: "collide?", argument: b2}) ).toEqual({verb: "smile!"});
  });

  it("should respond with collision only to other badges", () => {
    var b1:Badge = new Badge();
    var b2:Badge = new Badge();
    var s2:Spaceship = new Spaceship( new PolarCoordinate() );
    var p2:Projectile = new Projectile( new PolarCoordinate() );

    b1.position.angle = 0.00001;
    b2.position.angle = 0.0;
    s2.position.angle = 0.0;
    p2.position.angle = 0.0;

    expect( b1.ask({verb: "collide?", argument: b2}).verb ).toEqual("collide!");
    expect( b1.ask({verb: "collide?", argument: s2}).verb ).toEqual("smile!");
    expect( b1.ask({verb: "collide?", argument: p2}).verb ).toEqual("smile!");
  });

  it("should respond to 'is?' communication", () => {
    var b:Badge = new Badge();
    expect( b.ask({verb: "is?", argument: "badge"}) ).toEqual({verb: "is!"});
    expect( b.ask({verb: "is?", argument: "spaceship"}) ).toEqual({verb: "smile!"});
    expect( b.ask({verb: "is?", argument: "projectile"}) ).toEqual({verb: "smile!"});
  });
});
