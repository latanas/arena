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
  private dtDirectionChagne: number;

  constructor(p: PolarCoordinate) {
    super(p);

    this.speed = this.speed/4.0;
    this.moveDirection = +1;
    this.dtDirectionChagne = 500.0;
  }

  public animate(dt: number) {
    super.animate(dt);
    this.dtDirectionChagne -= dt;

    if( this.dtDirectionChagne <= 0 ) {
      this.dtDirectionChagne = 1000.0;
      this.moveDirection = this.moveDirection * (-1);
      this.triggerShot = true;
    }
  }
}
