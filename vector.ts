/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE for more details.

  http://www.atanaslaskov.com/arena/
*/

// Cartesian 2d coordinate (x;y)
//
class Vector{
  public x: number;
  public y: number;

  constructor(x:number =0.0, y:number =0.0) {
    this.x = x;
    this.y = y;
  }

  public copy(): Vector {
    return new Vector(this.x, this.y);
  }

  public distance(): number {
    return Math.sqrt( this.x*this.x + this.y*this.y );
  }

  static plus(a: Vector, b: Vector): Vector {
    return new Vector( a.x+b.x, a.y+b.y );
  }

  static minus(a: Vector, b: Vector): Vector {
    return new Vector( a.x-b.x, a.y-b.y );
  }

  static scale(v: Vector, n: number) {
    return new Vector( v.x*n, v.y*n );
  }
}
