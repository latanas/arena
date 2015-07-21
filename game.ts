/*
  Project: Frontliner, Action/tactics game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="arena.ts" />
/// <reference path="player_spaceship.ts" />
/// <reference path="enemy_spaceship.ts" />

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />

// Game class initializes the graphics and manages game objects
//
class Game{
  // Renderer
  private context: any;
  private width:   number;
  private height:  number;

  // Animation clock
  private clock: number;

  // Gameplay arena, ships and projectiles
  private arena: Arena;
  private ship_list: any[];

  // Initialize game
  //
  constructor() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    var c = document.createElement("canvas");
    c.width  = this.width;
    c.height = this.height;
    document.body.appendChild(c);

    this.context = c.getContext("2d");
    this.clock = window.performance.now();

    var spacing = 100;
    var radius = (Math.min( this.width, this.height ) - spacing)/2.0;
    var x:number = radius + (this.width - radius*2.0)/2.0;
    var y:number = radius + (this.height - radius*2.0)/2.0;

    this.arena = new Arena( new Vector(x,y), radius );

    this.ship_list = [
      new PlayerSpaceship( new PolarCoordinate(Math.PI/2.0, radius-100) ),
      new EnemySpaceship( new PolarCoordinate(-Math.PI/2.0, radius-100) ),
    ];
  }

  // Animation frame
  //
  animationFrame = () => {
    var t  = window.performance.now();
    var dt = t - this.clock;
    this.clock = t;

    var c = this.context;
    c.clearRect(0, 0, this.width, this.height);

    // Render and animate gameplay arena
    this.arena.render(c);
    this.arena.animate(dt);

    // Render and animate ships
    for( var i=0; i<this.ship_list.length; i++) {
      var s = this.ship_list[i];
      s.render(c, this.arena.origin);
      s.animate(dt);
    }

    window.requestAnimationFrame( this.animationFrame );
  }
}
