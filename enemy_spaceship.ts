/*
  Project: Frontliner, Action/tactics game
  Author:  Atanas Laskov
  License: BSD license, see LICENSE for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="spaceship.ts" />

class EnemySpaceship extends Spaceship{
  private dtDirectionChagne: number;

  constructor(p: number) {
    super(p)

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
