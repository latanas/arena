/*
  Project: Frontliner, Action/tactics game
  Author:  Atanas Laskov
  License: BSD license, see LICENSE for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector2.ts" />

class Spaceship{
  public position: number;
  public speed: number;
  public shotSpeed: number;

  protected moveDirection: number;

  protected triggerShot: boolean;
  protected shotPosition: Vector2;
  protected shotAngle: number;

  constructor(p: number) {
    this.position = p;
    this.speed = Math.PI*0.001;
    this.shotSpeed = -1.0;
    this.triggerShot = false;
    this.shotPosition = null;
    this.moveDirection = 0;
  }

  public render(context: any, p2: Vector2) {
    context.beginPath();
    context.arc( p2.x, p2.y, 20, 0, 2*Math.PI );
    context.stroke();

    if( this.shotPosition ) {
      context.beginPath();
      context.arc( this.shotPosition.x, this.shotPosition.y, 5, 0, 2*Math.PI );
      context.fill();
    }

    if( this.triggerShot ) {
      this.shotPosition = p2;
      this.shotAngle = this.position;
      this.triggerShot = false;
    }
  }

  public animate(dt: number) {
    this.position += dt * this.speed * this.moveDirection;
    if( this.shotPosition ) {
      this.shotPosition.x += dt * this.shotSpeed * Math.cos(this.shotAngle);
      this.shotPosition.y += dt * this.shotSpeed * Math.sin(this.shotAngle);
    }
  }
}
