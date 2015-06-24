/*
  Project: Frontliner
  Author:  Atanas Laskov

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="spaceship.ts" />

class PlayerSpaceship extends Spaceship{
  constructor(p: number) {
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
