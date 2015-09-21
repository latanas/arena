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
/// <reference path="projectile.ts" />

// Base class for a spaceship
//
class Spaceship implements DynamicObject{
  public speed: number;
  public direction: number;
  public position:  PolarCoordinateAreal;

  public hp: number;
  public hpMax: number;

  public color: Color;

  protected projectile: Projectile;

  protected isJumping:  boolean;
  protected jumpAngle:  number;
  protected jumpRadius: number;
  protected jumpDone:   ()=>void;

  constructor(p: PolarCoordinate) {
    this.position = new PolarCoordinateAreal(p.angle, p.radius - 0.05, 0.05);
    this.speed    = 1.0;

    this.direction  = +0;
    this.projectile = null;

    this.hpMax = 10.0;
    this.hp    = 10.0;

    this.color = new Color(0.0, 1.0, 0.0);

    this.isJumping  = false;
    this.jumpAngle  = 0.0;
    this.jumpRadius = 1.0;
  }

  // Animate the spaceship
  //
  public animate(dt: number, origin_speed: number) {
    // If the ship is in the process of jumping, animate the radius and angle
    if( this.isJumping ) {

      this.position.radius += this.speed * dt;
      this.jumpAngle += 2.0 * (this.position.angle - this.jumpAngle) * dt;

      if( this.position.radius >= this.jumpRadius ) {
        this.position.radius = this.jumpRadius;
        this.isJumping = false;

        if( this.jumpDone ) this.jumpDone();
      }
    }
    else {
      // Otherwise, animate only the angle
      this.position.angle += dt * (this.speed + origin_speed) * this.direction;
    }
  }

  // Display the spaceship
  //
  public render(renderer: Renderer, origin: Vector) {
    var position: Vector = Vector.plus( this.position.vector(), origin );
    var angle: number = (this.isJumping? this.jumpAngle : this.position.angle) - Math.PI*0.5;

    renderer.style( this.color, 1 );
    renderer.spaceship( position, angle, this.position.areal );

    renderer.style( new Color(this.color.r, this.color.g, this.color.b, 0.5), 10.0 );
    renderer.marker( position, 2.0, 1.0);

    renderer.style( this.color, 3.0 );
    renderer.marker( position, 10.0, this.hp / this.hpMax);
  }

  // Communicate with the spaceship
  //
  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the Spaceship if it's time to get discarded
    if( sentence.verb == "discard?" && this.hp <= 0 ) {
      // Yes, time to live has expired.
      return { verb: "discard!" };
    }

    // Somebody asked the Spaceship to follow to new position
    if( sentence.verb == "follow!" ) {
      var jumpRadius = <number> sentence.argument - 0.05;

      if( this.isJumping ) this.jumpRadius = jumpRadius; // Set new follow target
      else this.position.radius = jumpRadius;              // Follow immediately

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

  // Prepare for attack
  //
  public prepareAttack(){
    var p = this.position.copy();

    this.projectile = new Projectile(
        new PolarCoordinate(p.angle, p.radius),
        this.color
    );
  }

  // Prepare for evasive jump
  //
  public prepareJump(done: ()=>void){
    this.isJumping = true;
    this.jumpAngle = this.position.angle;
    this.jumpDone  = done;

    this.position.angle  = this.position.angle - Math.PI;
    this.position.radius = (-1.0)*this.position.radius;
  }
}
