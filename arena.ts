/*
  Project: Frontliner, Action/tactics game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector.ts" />

// Gameplay arena
//
class Arena{
  public origin: Vector;
  public radius: number;

  constructor(o:Vector, r:number) {
    this.origin = o;
    this.radius = r;
  }

  public animate(dt: number) {
  }

  public render(context: any) {
    context.beginPath();
    context.arc( this.origin.x, this.origin.y, this.radius, 0, 2*Math.PI );
    context.stroke();
  }
}
