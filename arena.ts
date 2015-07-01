/*
  Project: Frontliner, Action/tactics game
  Author:  Atanas Laskov
  License: BSD license, see LICENSE for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector2.ts" />

class Arena{
  public position: Vector2;
  public radius: number;

  constructor(p:Vector2, r:number) {
    this.position = p;
    this.radius = r;
  }

  public render(context: any) {
    context.beginPath();
    context.arc( this.position.x, this.position.y, this.radius, 0, 2*Math.PI );
    context.stroke();
  }

  public animate(dt: number) {
  }

  public getVector(angle: number, distance: number): Vector2 {
    return new Vector2(
      this.position.x + Math.cos(angle)*distance,
      this.position.y + Math.sin(angle)*distance
    );
  }
}
