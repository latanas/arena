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

// Base class for a spaceship
//
class Spaceship implements DynamicObject{
  public speed:    number;
  public position: PolarCoordinateAreal;

  public hp: number;
  public hpMax: number;

  protected direction: number;

  protected projectileSpeed: number;
  protected projectileAreal: number;
  protected projectile: Projectile;

  protected color: Color;
  protected colorHp: Color;
  protected colorBar: Color;

  constructor(p: PolarCoordinate) {
    this.position = new PolarCoordinateAreal(p.angle, p.radius, 0.05);
    this.speed = 1.0;
    this.projectileSpeed = 1.0;
    this.projectileAreal = 0.05;

    this.direction = +0;
    this.projectile = null;

    this.hpMax = this.hp = 10.0;
    this.color = new Color(0.0, 0.0, 0.0);
    this.colorHp = new Color(1.0, 0.0, 0.0);
    this.colorBar = new Color(0.5, 0.5, 0.5)
  }

  public animate(dt: number, origin_speed: number) {
    this.position.angle += dt * (this.speed + origin_speed) * this.direction;
  }

  public render(renderer: Renderer, origin: Vector) {
    var v:Vector = this.position.vector()
    var p:Vector = Vector.plus( v, origin );
    var hpStatus = (this.hp / this.hpMax)-0.5;
    var hpPos = this.position.areal*0.6;

    renderer.style( this.color, 1 );
    renderer.spaceship( p, this.position.areal, this.position.angle - Math.PI*0.5 );
    renderer.style( this.colorHp, 3 );
    renderer.polyline([
      Vector.plus( p, new Vector((-0.5)*hpPos, (+1.0)*hpPos)),
      Vector.plus( p, new Vector(hpStatus*hpPos, (+1.0)*hpPos))
    ]);
  }

  // Ask the spaceship
  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the Spaceship if it's time to get discarded
    if( sentence.verb == "discard?" && this.hp <= 0 ) {
      // Yes, time to live has expired.
      return { verb: "discard!" };
    }

    // Somebody asked the Spaceship to follow to new position, it knows how to do this
    if( sentence.verb == "follow!" ) {
      this.position.radius = <number> sentence.argument;
      return { verb: "follow!" };
    }

    // Somebody asked the Spaceship if it wants to attack
    if( sentence.verb == "attack?" && this.projectile ) {
      // Yes, we want to attack. Reply with the projectile
      var msg = { verb: "attack!", argument: this.projectile };
      this.projectile = null;
      return msg;
    }

    // Somebody the Spaceship to take damage
    if( sentence.verb == "damage!" ) {
      this.hp = Math.max(0.0,  this.hp-sentence.argument);
      return { verb: "damage!" };
    }

    // Somebody asked us if we are a Spaceship
    if( (sentence.verb == "is?") && (sentence.argument == "spaceship") ) {
      return { verb: "is!" };
    }

    // Otherwise just smile
    return { verb: "smile!" };
  }

  // Prepare for attach
  protected prepareAttack(){
    var p = this.position.copy();

    this.projectile = new Projectile(
        -1.0*this.projectileSpeed,
        new PolarCoordinateAreal(p.angle, p.radius, this.projectileAreal)
    );
  }
}
