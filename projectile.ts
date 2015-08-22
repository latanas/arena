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

  private ap: number;               // Attack Points

  private ttl: number;              // Time to Live
  private ttlGhostMax: number;      // Time to Live as "Ghost" ( Ghost prevents damage to our own ship, and repeated damage after hit )
  private ttlGhost: number;

  private color: Color;

  constructor(s: number, p: PolarCoordinateAreal) {
    this.speed = s;

    this.position = p;
    this.positionInitial = p.copy();

    this.ap = 1.0;

    this.ttl         = 1.0;
    this.ttlGhostMax = 0.5;
    this.ttlGhost    = 0.5;

    this.color = new Color(1.0, 0.0, 0.0);
  }

  public animate(dt: number) {
    this.position.radius += dt * this.speed;
    this.positionInitial.radius += dt * (this.speed * 0.9);
    this.ttl -= dt;
    this.ttlGhost -= dt;
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

  private isCollision(collisionTarget: DynamicObject) {
    var v:Vector = Vector.minus( collisionTarget.position.vector(), this.position.vector() );
    return (v.distance() <= collisionTarget.position.areal);
  }
}
