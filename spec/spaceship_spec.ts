/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/
/// <reference path="../spaceship.ts" />

describe("Spaceship", () => {
  it("should construct a new spaceship", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate(0.1, 0.2) );

    expect(s.position.angle).toEqual(0.1);
    expect(s.position.radius).toEqual(0.2 - 0.05);
  });

  it("should animate position", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate() );

    s.position.angle = 1.0;
    s.speed = 1.0;
    s.direction = 1.0;
    s.animate(0.1, 0.0);

    expect(s.position.angle).toEqual(1.1);

    s.position.angle = 1.0;
    s.speed = 1.0;
    s.direction = -1.0;
    s.animate(0.1, 0.0);

    expect(s.position.angle).toEqual(0.9);

    s.position.angle = 1.0;
    s.speed = 0.0;
    s.direction = 1.0;
    s.animate(0.1, 1.0);

    expect(s.position.angle).toEqual(1.1);
  });

  it("should respond to 'discard?' communication", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate() );
    expect( s.ask({verb: "discard?"}) ).toEqual( {verb: "smile!"} );

    s.hp = 0;
    expect( s.ask({verb: "discard?"}) ).toEqual({verb: "discard!"});

    s.hp = -1;
    expect( s.ask({verb: "discard?"}) ).toEqual({verb: "discard!"});
  });

  it("should respond to 'follow!' communication", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate() );
    expect( s.ask({verb: "follow!", argument: 10}) ).toEqual({verb: "follow!"});
    expect( s.position.radius ).toEqual(9.95);
  });

  it("should respond to 'attack!' communication", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate() );
    expect( s.ask({verb: "attack?"}) ).toEqual({verb: "smile!"});

    s.prepareAttack();
    var attackCommunication = s.ask({verb: "attack?"});

    expect( attackCommunication.verb ).toEqual("attack!");
    expect( attackCommunication.argument instanceof Projectile ).toBeTruthy();
  });

  it("should respond to 'damage!' communication", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate() );
    s.hp = 10;

    expect( s.ask({verb: "damage!", argument: 1}) ).toEqual({verb: "damage!"});
    expect( s.hp ).toEqual(9);
  });

  it("should respond to 'is?' communication", () => {
    var s:Spaceship = new Spaceship( new PolarCoordinate() );
    expect( s.ask({verb: "is?", argument: "spaceship"}) ).toEqual({verb: "is!"});
    expect( s.ask({verb: "is?", argument: "projectile"}) ).toEqual({verb: "smile!"});
    expect( s.ask({verb: "is?", argument: "badge"}) ).toEqual({verb: "smile!"});
  });
});
