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

  public position: PolarCoordinateAreal;      // Current position
  private positionInitial: PolarCoordinate;   // Initial position, used to draw a "trail"

  public ap: number;               // Attack Points

  private ttl: number;              // Time to Live
  private ttlGhostMax: number;      // Time to Live as "Ghost" ( Ghost prevents damage to our own ship, and repeated damage after hit )
  private ttlGhost: number;

  private color: Color;

  constructor(p: PolarCoordinate) {
    this.speed = -1.0;
    this.position = new PolarCoordinateAreal(p.angle, p.radius, 0.05);
    this.positionInitial = p.copy();

    this.ap = 1.0;

    this.ttl         = 2.0;
    this.ttlGhostMax = 0.5;
    this.ttlGhost    = 0.5;

    this.color = new Color(1.0, 0.2, 0.2);
  }

  public animate(dt: number, origin_speed: number) {
    this.position.radius += dt * this.speed;
    this.positionInitial.radius += dt * (this.speed * 0.7);
    this.ttl -= dt;
    this.ttlGhost -= dt;
  }

  public render(renderer: Renderer, origin: Vector) {
    var pt = [
      Vector.plus( this.position.vector(), origin ),
      Vector.plus( this.positionInitial.vector(), origin )
    ];

    var gradient = {
      start: pt[0], startColor: this.color,
      end: pt[1], endColor: new Color(this.color.r, this.color.g, this.color.b, 0.0),
    };

    renderer.style(gradient, 5 );
    renderer.polyline(pt);
  }

  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the Projectile if it's time to get discarded
    if( sentence.verb == "discard?" && this.ttl <= 0 ) {
      // Yes, time to live has expired.
      return { verb: "discard!" };
    }

    // Somebody asked the Projectile if it collides with an object
    if( (sentence.verb == "collide?") && (this.ttlGhost <= 0) ) {
      var o:DynamicObject = <DynamicObject> sentence.argument;

      // We only care about collisions with spaceships
      if( o.ask({ verb:"is?", argument:"spaceship" }).verb == "is!" ) {
        if( this.isCollision(o) ) {
          this.ttlGhost = this.ttlGhostMax;
          return { verb: "collide!", argument: this.ap }
        }
      }
    }

    // Otherwise just smile
    return { verb: "smile!" };
  }

  public isCollision(collisionTarget: DynamicObject) {
    var v:Vector = Vector.minus( collisionTarget.position.vector(), this.position.vector() );
    return (v.distance() <= this.position.areal + collisionTarget.position.areal);
  }
}
