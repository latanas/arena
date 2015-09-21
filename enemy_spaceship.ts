/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="spaceship.ts" />

// Enemy spacheship is controlled by the computer
//
class EnemySpaceship extends Spaceship{
  private tDirectionChangeMax: number;
  private tDirectionChange: number;

  private tAttackMax: number;
  private tAttack: number;

  private numberShots: number;

  constructor(p: PolarCoordinate) {
    super(p);

    this.speed     = this.speed*0.7;
    this.direction = +1;

    this.tDirectionChangeMax = 2.0;
    this.tAttackMax          = 0.25;

    this.tDirectionChange = this.tDirectionChangeMax*0.5;
    this.tAttack          = this.tAttackMax*1.0;
    this.numberShots      = 0;
  }

  // Animate the enemy ship
  //
  public animate(dt: number, origin_speed: number) {
    super.animate(dt, origin_speed);
    if( this.isJumping ) return;

    this.tDirectionChange -= dt;
    this.tAttack          -= dt;

    if( this.tDirectionChange <= 0 ) {
      this.charge();
    }

    if( (this.tAttack <= 0) && this.numberShots ) {
      this.prepareAttack();
      this.tAttack = this.tAttackMax*1.0;
      this.numberShots--;
    }
  }

  // Communicate with the enemy ship
  //
  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the enemy if it collides with another object
    if( sentence.verb == "collide?" ) {
      var o:DynamicObject = <DynamicObject> sentence.argument;

      // We only care about the player
      if( o.ask({ verb:"is?", argument:"player" }).verb == "is!" ) {

        var a1 = o.position.angle % (Math.PI*2.0);
        var a2 = this.position.angle % (Math.PI*2.0)

        if( a1 < 0 ) a1 += Math.PI*2.0;
        if( a2 < 0 ) a2 += Math.PI*2.0;

        var distance = a2 - a1;

        // Player has collided with us, make an evasive jump
        if( Math.abs(distance) < 0.5*Math.PI ) {

          this.numberShots = 0;
          this.prepareJump(this.charge);

          return { verb: "collide!", argument: 0 }
        }
      }
    }
    return super.ask(sentence);
  }

  // Start releasing projectiles
  //
  private charge = ()=> {
    this.numberShots      = 5;
    this.direction        = this.direction * (-1);
    this.tDirectionChange = this.tDirectionChangeMax*1.0;
  }
}
