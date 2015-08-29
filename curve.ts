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

// Curve inflection
//
class CurveInflection extends PolarCoordinateAreal {
  public smoothing: string;

  constructor(angle:number =0, radius:number =0, areal:number =0, smoothing:string ="smooth") {
    super(angle, radius, areal);
    this.smoothing = smoothing;
  }
}

// Curve expressed in polar coordinates
//
class Curve{
  public origin: Vector;
  public radius: number;

  private inflectionPoints: CurveInflection[];
  private computedStep:     number;
  private computedRadiuses: PolarCoordinate[];

  private color: Color;

  constructor(o:Vector, r:number) {
    this.origin = o;
    this.radius = r;

    this.inflectionPoints = [];
    this.computedStep = Math.PI*0.01;
    this.computedRadiuses = [];

    this.color = new Color(0, 0, 0);
  }

  // Load curve inflection poitns
  //
  public load(jsonData: any[]) {
    for(var i=0; i<jsonData.length; i++) {
      var ipData = jsonData[i];

      var ip = new CurveInflection(
        ipData.angle * Math.PI,
        ipData.radius * this.radius,
        ipData.areal * Math.PI
      );

      if( ip.smoothing ) {
        ip.smoothing = ipData.smoothing;
      }
      this.inflectionPoints.push(ip);
    }
    this.compute();
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

  // Animate the curve
  //
  public animate(dt: number) {
  }

  // Render the curve
  //
  public render(renderer: Renderer) {
    var pr = this.computedRadiuses;
    var ip = this.inflectionPoints;
    var points = [];

    // Render precomputed outline
    for( var i=0; i<pr.length; i++ ) {
      points.push( Vector.plus(this.origin, pr[i].vector()) );
    }
    if(pr.length) {
      points.push( Vector.plus(this.origin, pr[0].vector()) ); // Close the outline
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
