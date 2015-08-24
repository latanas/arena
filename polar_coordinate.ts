/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />

// Polar coordinate represented as (angle; radius)
//
class PolarCoordinate{
  public angle:  number;
  public radius: number;

  constructor(angle:number =0, radius:number =0) {
    this.angle  = angle;
    this.radius = radius;
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

// Polar coordinate with an area of effect arount it (areal)
//
class PolarCoordinateAreal extends PolarCoordinate{
  public areal: number;

  constructor(angle:number =0, radius:number =0, areal:number =0) {
    super(angle,radius);
    this.areal = areal;
  }

  public copy(): PolarCoordinateAreal {
    return new PolarCoordinateAreal(this.angle, this.radius, this.areal);
  }
}
