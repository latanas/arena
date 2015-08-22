/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="spaceship.ts" />

// Enemy spacheship, controled by the computer
//
class EnemySpaceship extends Spaceship{
  private tDirectionChangeMax: number;
  private tDirectionChange: number;

  private tAttackMax: number;
  private tAttack: number;
  private numberShots: number;

  constructor(p: PolarCoordinate) {
    super(p);

    this.speed     = this.speed*0.4;
    this.direction = +1;

    this.tDirectionChangeMax = 2000.0;
    this.tAttackMax          = 250.0;

    this.tDirectionChange = this.tDirectionChangeMax*0.5;
    this.tAttack          = this.tAttackMax*1.0;
    this.numberShots      = 0;
  }

  // Animate the enemy ship
  public animate(dt: number, origin_speed: number) {
    super.animate(dt, origin_speed);

    this.tDirectionChange -= dt;
    this.tAttack          -= dt;

    if( this.tDirectionChange <= 0 ) {
      this.direction = this.direction * (-1);
      this.numberShots = 5;
      this.tDirectionChange = this.tDirectionChangeMax*1.0;
    }

    if( (this.tAttack <= 0) && this.numberShots ) {
      this.prepareAttack();
      this.tAttack = this.tAttackMax*1.0;
      this.numberShots--;
    }
  }
}
