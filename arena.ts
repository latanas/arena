/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="color.ts" />
/// <reference path="renderer.ts" />

// Gameplay arena
//
class Arena{
  public origin: Vector;
  public radius: number;

  private inflectionPoints: PolarCoordinateAreal[];

  private computedStep:      number;
  private computedRadiuses:  PolarCoordinate[];

  private color: Color;

  // Construct the arena
  //
  constructor(o:Vector, r:number) {
    this.origin = o;
    this.radius = r;

    // Add some inflection points
    this.inflectionPoints = [
      new PolarCoordinateAreal(Math.PI*0.0, r*1.2, Math.PI * 0.1),
      new PolarCoordinateAreal(Math.PI*0.2, r*0.9, Math.PI * 0.1),
      new PolarCoordinateAreal(Math.PI*0.5, r*0.9, Math.PI * 0.1),
      new PolarCoordinateAreal(Math.PI*0.8, r*0.9, Math.PI * 0.1),
      new PolarCoordinateAreal(Math.PI*1.0, r*1.2, Math.PI * 0.1),
      new PolarCoordinateAreal(Math.PI*1.5, r*0.9, Math.PI * 0.3),
    ]
    this.computedStep = Math.PI*0.01;
    this.compute();
    this.color = new Color(0, 0, 0);
  }

  // Get radius at the given polar coordinate
  //
  public radiusAt(angle: number) {
    // Reduce angle
    angle = angle % (Math.PI * 2.0);
    if( angle < 0 ) angle += Math.PI * 2.0;

    var ips = this.inflectionPoints;
    var r = this.radius;

    // For each of the inflection points, calculate the weight
    for( var i=0; i<ips.length; i++ ) {
      var ip = ips[i];

      var weight = 0.0;
      var d1 = Math.abs(ip.angle-angle), d2 = Math.abs(ip.angle-angle+Math.PI*2.0);
      var distance = Math.min(d1,d2) / ip.areal;

      if( distance <= 1.0 ) {
        // Use the sine, an easy way to fit a smooth curve around the inflection point
        weight = (Math.sin( Math.PI*0.5 + Math.PI*distance )+1.0)*0.5;
      }
      r = (1.0-weight)*r + weight*ip.radius;
    }
    return r;
  }

  // Compute the radius at incremental steps
  //
  public compute() {
    this.computedRadiuses = [];
    for( var a=0; a<=Math.PI*2.0-this.computedStep; a+=this.computedStep ) {
      this.computedRadiuses.push( new PolarCoordinate(a, this.radiusAt(a)) );
    }
  }

  // Animate the arena
  //
  public animate(dt: number) {
  }

  // Render the arena
  //
  public render(renderer: Renderer) {
    var pr = this.computedRadiuses;
    var ip = this.inflectionPoints;
    var points = [];

    // Render precomputed outline
    for( var i=0; i<=pr.length; i++ ) {
      var p = pr[ (i==pr.length)? 0:i ];
      points.push( Vector.plus(this.origin, p.vector()) );
    }
    renderer.style( this.color, 3 );
    renderer.polyline(points);

    // Render the inflection points, for debugging
    renderer.style( this.color, 1 );
    for( var n=0; n<ip.length; n++ ) {
      renderer.marker( Vector.plus(this.origin, ip[n].vector()), 5 );
    }
  }
}
