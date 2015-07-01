/*
  Project: Frontliner, Action/tactics game
  Author:  Atanas Laskov
  License: BSD license, see LICENSE for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="arena.ts" />
/// <reference path="player_spaceship.ts" />
/// <reference path="enemy_spaceship.ts" />

class Game{
  private context: any;

  private width:  number;
  private height: number;

  private arena: Arena;
  private ship_list: any[];

  private timePrevious: number;

  // Initialize canvas
  constructor() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    var c = document.createElement("canvas");
    c.width  = this.width;
    c.height = this.height;
    document.body.appendChild(c);

    this.context = c.getContext("2d");
    this.timePrevious = window.performance.now();

    var spacing = 100;
    var radius = (Math.min( this.width, this.height ) - spacing)/2.0;
    var x:number = radius + (this.width - radius*2.0)/2.0;
    var y:number = radius + (this.height - radius*2.0)/2.0;
    this.arena = new Arena( new Vector2(x,y), radius );

    this.ship_list = [
      new PlayerSpaceship(Math.PI/2.0),
      new EnemySpaceship(-Math.PI/2.0),
    ];
  }

  // Render frame
  render = () => {
    var t  = window.performance.now();
    var dt = t - this.timePrevious;
    this.timePrevious = t;

    var c = this.context;

    c.clearRect(0, 0, this.width, this.height);
    this.arena.render(c);
    this.arena.animate(dt);

    for( var i=0; i<this.ship_list.length; i++) {
      var s = this.ship_list[i];
      var p2 = this.arena.getVector( s.position, this.arena.radius - 50 )

      s.render(c, p2);
      s.animate(dt);
    }

    window.requestAnimationFrame(this.render);
  }
}
