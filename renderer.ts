/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="color.ts" />

// Gradient between two colors
//
interface Gradient{
  start: Vector;
  startColor: Color;

  end: Vector;
  endColor: Color;
}

// Renderer interface
//
interface Renderer{
  style(color: Color | Gradient, thickness: number);
  rotation(angle: number);
  background(position: Vector, scale: number, alpha: number);

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

  private angle:   number;
  private scale:   number;
  private origin:  Vector;

  private numberPoints: number;
  private template: Vector[];

  private backgroundImage: HTMLImageElement;

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

    this.angle = 0.0;

    this.template = [
      new Vector( -0.5, +0.5 ),
      new Vector( -0.5, +0.0 ),
      new Vector( +0.0, -0.5 ),
      new Vector( +0.5, +0.0 ),
      new Vector( +0.5, +0.5 ),
      new Vector( +0.0, +0.0 ),
      new Vector( -0.5, +0.5 ),
    ];

    this.backgroundImage = <HTMLImageElement> (new Image());
    this.backgroundImage.src = "assets/eso_eagle_nebula.jpg"
  }

  public style(color: Color | Gradient, thickness: number) {
    if( color instanceof Color ) {
      this.context.strokeStyle = color.css();
    }
    else {
      var g: Gradient = <Gradient> color;
      var s = this.scale;
      var o = this.origin;

      var linearGradient = this.context.createLinearGradient(
        Math.round(g.start.x*s + o.x), Math.round(g.start.y*s + o.y),
        Math.round(g.end.x*s + o.x), Math.round(g.end.y*s + o.y)
      );
      linearGradient.addColorStop(0, g.startColor.css());
      linearGradient.addColorStop(1, g.endColor.css());
      this.context.strokeStyle = linearGradient;
    }
    this.context.lineWidth = thickness;
  }

  public rotation(angle: number) {
    this.angle = angle;
  }

  public background(position: Vector, scale: number, alpha: number) {
    var o = this.origin;

    this.context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
    this.context.translate( o.x, o.y );
    this.context.rotate( -1.0*this.angle );
    this.context.translate( -1.0*o.x, -1.0*o.y);

    if( !this.backgroundImage.width ) {
      return;
    }
    var nx = this.backgroundImage.width * scale;
    var ny = this.backgroundImage.height * scale;
    var xStart = position.x % nx;
    var yStart = position.y % ny;

    if( xStart>0 ) xStart = xStart-nx;
    if( yStart>0 ) yStart = yStart-ny;
    this.context.globalAlpha = alpha;

    for(var x=xStart; x<this.width; x+=nx) {
      for(var y=yStart; y<this.height; y+=ny) {
        this.context.clearRect(x, y, nx, ny);
        this.context.drawImage(this.backgroundImage, x, y, nx, ny);
      }
    }
    this.context.globalAlpha = 1.0;
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

  public spaceship(position: Vector, angle: number, size: number) {
    var p: Vector[] = [];
    var sin = Math.sin(angle), cos = Math.cos(angle);

    for(var i=0; i<this.template.length; i++) {
      var x = this.template[i].x, y = this.template[i].y;
      var v = new Vector( x*cos-y*sin, x*sin+y*cos );
      p.push( Vector.plus(position, Vector.scale(v,size)) );
    }
    this.polyline(p);
  }
}
