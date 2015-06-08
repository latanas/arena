/*

  Project: Frontliner
  Author:  Atanas Laskov

*/

class Spaceship{
  public position: number;
  public speed: number;

  private inputDirection: number;

  constructor(p: number) {
    this.position = p;
    this.speed = Math.PI*0.001;

    this.inputDirection = 0;
    document.addEventListener('keydown', (e) => {
      if( e.keyCode == 37 ) this.inputDirection = +1;
      if( e.keyCode == 39 ) this.inputDirection = -1;
    });
    document.addEventListener('keyup', (e) => {
      if( e.keyCode == 37 ) this.inputDirection = 0;
      if( e.keyCode == 39 ) this.inputDirection = 0;
    });
  }

  public render = (context: any, x: number, y: number) => {
    context.beginPath();
    context.arc( x, y, 10, 0, 2*Math.PI );
    context.fill();
  }

  public animate = (dt: number) => {
    //console.log(this.inputDirection);
    this.position += dt * this.speed * this.inputDirection;
  }
}

// Frontliner game
//
class Frontliner{
  private context: any;

  private width:  number;
  private height: number;

  ship: Spaceship;

  timePrevious: number;

  // Initialize canvas
  constructor() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    var c = document.createElement("canvas");
    c.width  = this.width;
    c.height = this.height;
    document.body.appendChild(c);

    this.context = c.getContext("2d");
    this.ship = new Spaceship(Math.PI/2.0);

    this.timePrevious = window.performance.now();
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

    var ship_x = Math.cos(this.ship.position)*radius + x;
    var ship_y = Math.sin(this.ship.position)*radius + y;
    this.ship.render(c, ship_x, ship_y);
    this.ship.animate(dt);

    window.requestAnimationFrame(this.render);
  }
}

// Construct game
//
var game = new Frontliner();
game.render();
