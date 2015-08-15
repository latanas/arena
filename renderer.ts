/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="color.ts" />

// Renderer interface
//
interface Renderer{
  style(color: Color, thickness: number);
  background();

  polyline(points: Vector[]);
  marker(position: Vector, size: number);
  spaceship(position: Vector, size: number, angle: number);
}

// Render using HMTL5 canvas
//
class CanvasRenderer implements Renderer{
  private context: CanvasRenderingContext2D;
  private width:   number;
  private height:  number;

  private scale:   number;
  private origin:  Vector;

  private numberPoints: number;

  constructor() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
    this.scale  = Math.min(this.width, this.height);
    this.origin = new Vector(this.width/2.0, this.height/2.0);

    var c = document.createElement("canvas");
    c.width  = this.width;
    c.height = this.height;
    document.body.appendChild(c);

    this.context = <CanvasRenderingContext2D> c.getContext("2d");
    this.context.lineJoin = "round";
    this.context.lineCap = "round";

    window.addEventListener('resize', (e) => {
      c.width = this.width = window.innerWidth;
      c.height = this.height = window.innerHeight;
      this.scale = Math.min(this.width, this.height);
      this.origin = new Vector(this.width/2.0, this.height/2.0);
    });
  }

  private rgba(c: Color) {
    var r=c.r*255.0, g=c.g*255.0, b=c.b*255.0, a=c.a;
    return "RGBA("+ r +","+ g +","+ b +","+ a +")";
  }

  public style(color: Color, thickness: number) {
    this.context.strokeStyle = this.rgba(color);
    this.context.lineWidth = thickness;
  }

  public background() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  public polyline(points: Vector[]) {
    if( !points.length ) {
      return;
    }
    var s = this.scale;
    var o = this.origin;

    this.context.beginPath();
    this.context.moveTo( points[0].x*s + o.x, points[0].y*s + o.y );

    for( var i=1; i<points.length; i++) {
        this.context.lineTo( points[i].x*s + o.x, points[i].y*s + o.y );
    }
    this.context.stroke();
  }

  public marker(position: Vector, size: number) {
    var s = this.scale;
    var o = this.origin;

    this.context.beginPath();
    this.context.arc( position.x*s + o.x, position.y*s + o.y, size, 0, 2*Math.PI );
    this.context.stroke();
  }

  public spaceship(position: Vector, size: number, angle: number) {
    this.marker(position, size);
  }
}
