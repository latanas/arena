/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="spaceship.ts" />

// Player controled spaceship
//
class PlayerSpaceship extends Spaceship{
  constructor(p: PolarCoordinate) {
    super(p);

    document.addEventListener('keydown', (e) => {
      if( e.keyCode == 37 ) this.moveDirection = +1;
      if( e.keyCode == 39 ) this.moveDirection = -1;
      if( e.keyCode == 32 ) this.triggerShot = true;
    });

    document.addEventListener('keyup', (e) => {
      if( e.keyCode == 37 ) this.moveDirection = 0;
      if( e.keyCode == 39 ) this.moveDirection = 0;
    });
  }
}
