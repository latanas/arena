/*
  Project: Frontliner, Action/tactics game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />

// Gameplay arena
//
class Arena{
  public origin: Vector;
  public radius: number;

  private inflection_points: PolarCoordinate[];

  constructor(o:Vector, r:number) {
    this.origin = o;
    this.radius = r;

    this.inflection_points = [
      new PolarCoordinate(Math.PI*1, r*0.8),
      new PolarCoordinate(Math.PI*1.5, r*0.8),
    ]
  }

  public animate(dt: number) {
  }

  public render(context: any) {
    var step = Math.PI*0.1;

    context.beginPath();
    for( var a=0; a<=Math.PI*2-step; a+=step ) {
        var p1 = new PolarCoordinate( a, this.radius );
        var p2 = new PolarCoordinate( a+step, this.radius );

        for( var i=0; i<this.inflection_points.length; i++ ) {
          var ip = this.inflection_points[i];
          if( (ip.angle >= a) && (ip.angle <= a+step) ) {
            p1.radius = ip.radius;
          }
          if( (ip.angle >= a+step) && (ip.angle <= a+2*step) ) {
            p2.radius = ip.radius;
          }
        }

        var p_control = new PolarCoordinate( a+step*0.5, (p1.radius+p2.radius)*0.5 );
        var v1 = Vector.plus( this.origin, p1.vector() );
        var v2 = Vector.plus( this.origin, p2.vector() );
        var v_control = Vector.plus( this.origin, p_control.vector() );

        context.moveTo( v1.x, v1.y );
        context.bezierCurveTo( v_control.x, v_control.y, v_control.x, v_control.y, v2.x, v2.y );
    }
    context.stroke();
  }
}
