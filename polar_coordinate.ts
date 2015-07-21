/*
  Project: Frontliner, Action/tactics game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector.ts" />

// Polar coordinate represented as (angle; radius)
//
class PolarCoordinate{
  public angle:  number;
  public radius: number;

  constructor(a:number, r:number) {
    this.angle  = a;
    this.radius = r;
  }

  public copy(): PolarCoordinate {
    return new PolarCoordinate(this.angle, this.radius);
  }

  public vector(): Vector {
    return new Vector(
      Math.cos(this.angle)*this.radius,
      Math.sin(this.angle)*this.radius
    );
  }
}
