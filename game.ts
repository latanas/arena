/*
  Project: Frontliner
  Author:  Atanas Laskov

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="player_spaceship.ts" />
/// <reference path="enemy_spaceship.ts" />

class Game{
  private context: any;

  private width:  number;
  private height: number;

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

    var spacing = 100;
    var radius = (Math.min( this.width, this.height ) - spacing)/2.0;
    var x = radius + (this.width - radius*2.0)/2.0;
    var y = radius + (this.height - radius*2.0)/2.0;

    c.clearRect(0, 0, this.width, this.height);
    c.beginPath();
    c.arc( x, y, radius, 0, 2*Math.PI );
    c.stroke();

    for( var i=0; i<this.ship_list.length; i++) {
      var s = this.ship_list[i];

      var ship_x = Math.cos(s.position)*radius + x;
      var ship_y = Math.sin(s.position)*radius + y;

      s.render(c, ship_x, ship_y);
      s.animate(dt);
    }

    window.requestAnimationFrame(this.render);
  }
}
