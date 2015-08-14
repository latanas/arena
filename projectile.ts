/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="dynamic_object.ts" />

// Weapon projectile released by a Spaceship
//
class Projectile implements DynamicObject {
  public speed:    number;
  public position: PolarCoordinateAreal;

  private positionInitial: PolarCoordinate;
  private ttl: number;

  constructor(s: number, p: PolarCoordinateAreal) {
    this.speed = s;
    this.position = p;
    this.positionInitial = p.copy();
    this.ttl = 4000.0;
  }

  public animate(dt: number) {
    this.position.radius += dt * this.speed;
    this.positionInitial.radius += dt * (this.speed * 0.9);
    this.ttl -= dt;
  }

  public render(context: any, origin: Vector) {
    var v1 = Vector.plus( this.position.vector(), origin );
    var v2 = Vector.plus( this.positionInitial.vector(), origin );

    context.beginPath();
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.stroke();
  }

  public ask(sentence: DynamicMessage): DynamicMessage {
    // Sombody asked the Projectile if it's time to get discarded
    if( sentence.verb == "discard?" && this.ttl <= 0 ) {
      // Yes, time to live has expired.
      return { verb: "discard!" };
    }

    // Otherwise just smile
    return { verb: "smile!" };
  }
}
