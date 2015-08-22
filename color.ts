/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

// Colour in RGBA fromat
//
class Color{
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r:number =1.0, g:number =1.0, b:number =1.0, a:number =1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public rgba_string() {
    var r=Math.round(this.r*255.0), g=Math.round(this.g*255.0), b=Math.round(this.b*255.0), a=this.a;
    return "RGBA("+ r +","+ g +","+ b +","+ a +")";
  }
}
