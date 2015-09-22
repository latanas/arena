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
  private tAttackMax: number;
  private tAttack: number;

  private tJumpMax: number;
  private tJump: number;

  private numberShots: number;

  constructor(p: PolarCoordinate) {
    super(p);

    this.speed     = this.speed*0.6;
    this.direction = +1;

    this.tAttackMax = 0.25;
    this.tAttack    = this.tAttackMax*1.0;

    this.tJumpMax = 9.0;
    this.tJump    = this.tJumpMax*1.0;

    this.numberShots = 0;
  }

  // Animate the enemy ship
  //
  public animate(dt: number, origin_speed: number) {
    super.animate(dt, origin_speed);
    if( this.isJumping ) return;

    this.tAttack -= dt;
    this.tJump -= dt;

    if( (this.tAttack <= 0) && this.numberShots ) {
      this.prepareAttack();

      this.tAttack = this.tAttackMax*1.0;
      this.numberShots--;
    }

    if( this.tJump <= 0 ) {
      this.prepareJump();

      this.tJump = (Math.random()*0.5 + 0.5) * this.tJumpMax;
      this.numberShots = 0;
    }
  }

  // Communicate with the enemy ship
  //
  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the enemy if it collides with another object
    if( (sentence.verb == "collide?") && !this.isJumping ) {

      var o:DynamicObject = <DynamicObject> sentence.argument;

      // We only care about the player
      if( o.ask({ verb:"is?", argument:"player" }).verb == "is!" ) {

        // Reduce angle and find distance to player
        //
        var anglePlayer = o.position.angle % (Math.PI*2.0);
        if( anglePlayer < 0 ) anglePlayer += Math.PI*2.0;

        var angleEnemy = this.position.angle % (Math.PI*2.0);
        if( angleEnemy < 0 ) angleEnemy += Math.PI*2.0;

        var distance = angleEnemy-anglePlayer;
        if( distance < 0 ) distance += Math.PI*2.0;

        var distanceMin = Math.min(distance, Math.PI*2.0 - distance);

        // Collision response flags
        //
        var isTouched   = (distanceMin < this.position.areal + o.position.areal);
        var isNear      = (distanceMin < 0.3*Math.PI);
        var isApproach  = (distanceMin < 0.8*Math.PI);

        // Player is near, make an evasive jump
        //
        if( isNear ) {
          this.numberShots = 0;
          this.prepareJump(() => { this.numberShots = 3; });

          return { verb: "collide!", argument: isTouched? 10:0 } // Damage if touched
        }

        // Player is approaching, try to incease the distance
        //
        if( isApproach ) {
          var direction =  distanceMin < distance ? -1:+1;

          if( direction != this.direction ) {
            this.numberShots = 5;
            this.direction = direction;

            return { verb: "collide!", argument: 0 }
          }
        }
      }
    }
    return super.ask(sentence);
  }
}
