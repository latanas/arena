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
    context.stroke();
  }

  public animate = (dt: number) => {
    //console.log(this.inputDirection);
    this.position += dt * this.speed * this.inputDirection;
  }
}
