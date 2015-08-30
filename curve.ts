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

// Curve represented in polar coordinates
//
class Curve{
  public origin: Vector;
  public radius: number;

  private inflectionPoints: CurveInflection[];

  private computedStep:     number;
  private computedRadiuses: PolarCoordinate[];

  private morphTargetComputed: PolarCoordinate[];
  private morphTargetWeight:   number;

  private color: Color;

  constructor(o:Vector, r:number) {
    this.origin = o;
    this.radius = r;

    this.inflectionPoints = [];

    this.computedStep = Math.PI*0.01;
    this.computedRadiuses = [];
    this.compute();

    this.morphTargetComputed = null;
    this.morphTargetWeight   = 0.0;

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

  // Get radius at the given angle
  //
  public radiusAt(angle: number) {
    // Reduce angle
    var a = angle % (Math.PI * 2.0);
    if( a < 0 ) a += Math.PI * 2.0;

    var ips = this.inflectionPoints;
    var r = this.radius;

    // For each of the inflection points, calculate the weight
    for( var i=0; i<ips.length; i++ ) {
      var ip = ips[i];

      var weight = 0.0;
      var d1 = Math.abs(ip.angle-a), d2 = Math.abs(ip.angle-a+Math.PI*2.0);
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
    return this.computedRadiuses;
  }

  // Get computed radius
  //
  public computedRadiusAt(angle: number) {
    // Reduce angle
    var a = angle % (Math.PI * 2.0);
    if( a < 0 ) a += Math.PI * 2.0;

    // Index in computed array
    var i = Math.floor( a / this.computedStep );
    var j = (i==this.computedRadiuses.length-1)? 0:i+1;
    var w = (a % this.computedStep) / this.computedStep;

    // Interpolate between two precomputed indexes
    var r = this.computedRadiuses[i].radius*(1.0-w) + this.computedRadiuses[j].radius*w;
    if( !this.morphTargetComputed ) return r;

    // Interpolate with morph target
    var rm = this.morphTargetComputed[i].radius*(1.0-w) + this.morphTargetComputed[j].radius*w;
    var wm = this.morphTargetWeight;
    return r*(1.0-wm) + rm*wm;
  }

  // Set animation morph target
  //
  public animationMorphTarget( morphTargetComputed: PolarCoordinate[] ) {
    this.morphTargetComputed = morphTargetComputed;
    this.morphTargetWeight   = 0.0;
  }

  // Query if morphing completed
  //
  public animationMorphCompleted() {
    return this.morphTargetWeight>=1.0;
  }

  // Animate the curve
  //
  public animate(dt: number) {
    if( this.morphTargetComputed && (this.morphTargetWeight<1.0) ) {
      this.morphTargetWeight = Math.min(1.0, this.morphTargetWeight + dt);
    }
  }

  // Render the curve
  //
  public render(renderer: Renderer) {
    var pr  = this.computedRadiuses;
    var prm = this.morphTargetComputed;
    var w   = this.morphTargetWeight;

    var points: Vector[] = [];
    var makePoint: (n: number)=>Vector = null;

    if( prm ) {
      // Blend points from two curves
      makePoint = (n: number)=>{
        var p1 = pr[n].vector();
        var p2 = prm[n].vector();

        //return Vector.plus(this.origin, p1);
        return new Vector(
          this.origin.x + p1.x*(1.0-w) + p2.x*w,
          this.origin.y + p1.y*(1.0-w) + p2.y*w
        );
      }
    }
    else {
      // Simple curve point
      makePoint = (n: number)=>{
        return Vector.plus(this.origin, pr[n].vector());
      }
    }

    // Render precomputed outline
    //
    for( var i=0; i<pr.length; i++ ) {
      points.push( makePoint(i) );
    }
    if(pr.length) {
      points.push( makePoint(0) ); // Close the outline
    }
    renderer.style( this.color, 3 );
    renderer.polyline(points);

    // Render the inflection points, for debugging
    var ip = this.inflectionPoints;

    renderer.style( this.color, 1 );
    for( var n=0; n<ip.length; n++ ) {
      renderer.marker( Vector.plus(this.origin, ip[n].vector()), 5 );
    }
  }
}
