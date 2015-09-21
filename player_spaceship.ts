/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="spaceship.ts" />

// Spaceship controled by the player
//
class PlayerSpaceship extends Spaceship{
  private playerScore: number;
  private swing: number;

  constructor(p: PolarCoordinate) {
    super(p);

    this.color = new Color(1.0, 1.0, 1.0);

    this.hpMax = this.hp = 40.0;
    this.playerScore = 0;
    this.swing = 0.0;

    document.addEventListener('keydown', (e) => {
      if( e.keyCode == 37 ) this.direction = +1;
      if( e.keyCode == 39 ) this.direction = -1;
      if( e.keyCode == 32 ) this.prepareAttack();
    });
    document.addEventListener('keyup', (e) => {
      if( e.keyCode == 37 ) this.direction = 0;
      if( e.keyCode == 39 ) this.direction = 0;
    });
    document.getElementById("game_over").style.opacity = "0.0";
  }

  public animate(dt: number, origin_speed: number) {
    super.animate(dt, origin_speed);
    this.swing += 0.3*dt;
  }

  public render(renderer: Renderer, origin: Vector) {
    super.render(renderer, origin);
    renderer.rotation( this.position.angle - Math.PI*(Math.sin(this.swing)*0.04 + 0.5) );
  }

  // Ask the spaceship
  public ask(sentence: DynamicMessage): DynamicMessage {
    // Player spaceship overides the normal "destroy" message with "gameover"
    if( sentence.verb == "gameover?" && this.hp <= 0 ) {
      // The "game over" screen has CSS-transition on opacity, we don't need to animate it manually
      document.getElementById("game_over").style.opacity = "1.0";
      return { verb: "gameover!" };
    }

    // Somebody asked us if we are the player ship
    if( (sentence.verb == "is?") && (sentence.argument == "player") ) {
      return { verb: "is!" };
    }

    // Otherwise, ask the parent
    return super.ask(sentence);
  }
}
