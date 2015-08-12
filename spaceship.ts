/*
  Project: Frontliner, Action/tactics game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="arena_object.ts" />

class Spaceship implements ArenaObject{
  public speed: number;
  public position: PolarCoordinate;

  protected moveDirection: number;

  protected triggerShot: boolean;
  protected shotPosition: PolarCoordinate;
  protected shotSpeed: number;

  constructor(p: PolarCoordinate) {
    this.position = p;
    this.shotPosition = null;

    this.speed = Math.PI*0.001;
    this.shotSpeed = -1.0;
    this.triggerShot = false;
    this.moveDirection = 0;
  }

  public animate(dt: number) {
    this.position.angle += dt * this.speed * this.moveDirection;

    if( this.shotPosition ) {
      this.shotPosition.radius += dt * this.shotSpeed;
    }

    if( this.triggerShot ) {
      this.shotPosition = this.position.copy();
      this.triggerShot = false;
    }
  }

  public render(context: any, origin: Vector) {
    var v = Vector.plus( this.position.vector(), origin );

    context.beginPath();
    context.arc( v.x, v.y, 20, 0, 2*Math.PI );
    context.stroke();

    if( this.shotPosition ) {
      var sv = Vector.plus( this.shotPosition.vector(), origin );

      context.beginPath();
      context.arc( sv.x, sv.y, 5, 0, 2*Math.PI );
      context.fill();
    }
  }
}
