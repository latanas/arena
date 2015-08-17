/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="dynamic_object.ts" />
/// <reference path="color.ts" />
/// <reference path="renderer.ts" />

// Projectile released by a spaceship
//
class Projectile implements DynamicObject {
  public speed:    number;
  public position: PolarCoordinateAreal;

  private positionInitial: PolarCoordinate;
  private ttl: number;
  private color: Color;

  constructor(s: number, p: PolarCoordinateAreal) {
    this.speed = s;
    this.position = p;
    this.positionInitial = p.copy();
    this.ttl = 4000.0;
    this.color = new Color(1.0, 0.0, 0.0);
  }

  public animate(dt: number) {
    this.position.radius += dt * this.speed;
    this.positionInitial.radius += dt * (this.speed * 0.9);
    this.ttl -= dt;
  }

  public render(renderer: Renderer, origin: Vector) {
    renderer.style( this.color, 1 );
    renderer.polyline([
      Vector.plus( this.positionInitial.vector(), origin ),
      Vector.plus( this.position.vector(), origin )
    ]);
  }

  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the Projectile if it's time to get discarded
    if( sentence.verb == "discard?" && this.ttl <= 0 ) {
      // Yes, time to live has expired.
      return { verb: "discard!" };
    }

    // Otherwise just smile
    return { verb: "smile!" };
  }
}
