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

  private inflection_points: PolarCoordinateAreal[];
  private computed_step:  number;
  private computed_rads:  number[];

  // Construct arena
  constructor(o:Vector, r:number) {
    this.origin = o;
    this.radius = r;

    // Add some inflection points
    this.inflection_points = [
      new PolarCoordinateAreal(Math.PI*1.0, r*1.2, Math.PI * 0.1),
      new PolarCoordinateAreal(Math.PI*1.5, r*0.8, Math.PI * 0.1),
    ]
    this.computed_step = Math.PI*0.01;
    this.compute();
  }

  // Get the radius of the arena at the given apolar coordinate
  public radius_at(angle: number) {
    angle = angle % (Math.PI * 2.0);
    if( angle < 0 ) angle += Math.PI * 2.0;

    var ips = this.inflection_points;
    var r = this.radius;

    // For each of the inflection points, calculate its weight
    for( var i=0; i<ips.length; i++ ) {
      var ip = ips[i];

      var weight = 0.0;
      var distance = Math.abs(ip.angle-angle) / ip.areal;

      if( distance <= 1.0 ) {
        // Use the sine, an easy way to fit a smooth curve around the inflection point
        weight = (Math.sin( Math.PI*0.5 + Math.PI*distance )+1.0)*0.5;
      }
      r = (1.0-weight)*r + weight*ip.radius;
    }
    return r;
  }

  // Compute the radius at incremental steps
  public compute() {
    this.computed_rads = [];
    for( var a=0; a<=Math.PI*2.0-this.computed_step; a+=this.computed_step ) {
      this.computed_rads.push( this.radius_at(a) );
    }
  }

  // Animate the arena
  public animate(dt: number) {
  }

  // Render the arena
  public render(context: any) {
    var ps = this.computed_step;
    var pr = this.computed_rads;
    var angle = 0;

    // Render precomputed outline
    context.beginPath();
    for( var i=0; i<pr.length; i++ ) {
      var r1 = pr[i];
      var r2 = pr[ (i==pr.length-1)? 0:i+1 ];

      var p1 = new PolarCoordinate(angle, r1);
      var p2 = new PolarCoordinate(angle+ps, r2);
      angle += ps;

      var v1 = Vector.plus( this.origin, p1.vector() );
      var v2 = Vector.plus( this.origin, p2.vector() );

      context.moveTo( v1.x, v1.y );
      context.lineTo( v2.x, v2.y );
    }
    context.stroke();

    // Render the inflection points, for debugging
    for( var n=0; n<this.inflection_points.length; n++ ) {
      var ipv = Vector.plus( this.origin, this.inflection_points[ n ].vector() );

      context.beginPath();
      context.arc( ipv.x, ipv.y, 5, 0, 2*Math.PI );
      context.fill();
    }
  }
}
