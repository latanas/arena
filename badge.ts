/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="dynamic_object.ts" />
/// <reference path="color.ts" />
/// <reference path="renderer.ts" />

// Badge of honor
//
class Badge implements DynamicObject {
  public speed:    number;
  public position: PolarCoordinateAreal;

  private accel: number;
  private accelMax: number;
  private color: Color;

  constructor() {
    this.speed = 0.0;

    this.accel = 0.0;
    this.accelMax = 2.0 * Math.PI;

    this.position = new PolarCoordinateAreal(Math.PI*0.5 + Math.random()*0.01, 0.0, Math.PI*0.025);
    this.color = new Color(0.9, 0.8, 0.0);
  }

  public animate(dt: number, origin_speed: number) {
    this.position.angle += dt * (this.speed + origin_speed);
    this.speed = dt * this.accel;
    this.accel = 0.0;
  }

  public render(renderer: Renderer, origin: Vector) {
    renderer.style(this.color, 3);
    renderer.spaceship(Vector.plus(origin, this.position.vector()), 0.0, 0.03);
  }

  public ask(sentence: DynamicMessage): DynamicMessage {
    // Somebody asked the Badge to follow to new position, it knows how to do this
    if( sentence.verb == "follow!" ) {
      this.position.radius = <number> sentence.argument + 0.05;
      return { verb: "follow!" };
    }

    // Somebody asked if this is a Badge of Honor
    if( (sentence.verb == "is?") && (sentence.argument == "badge") ) {
      return { verb: "is!" };
    }

    // Somebody asked the Badge if it collides with an object
    if( sentence.verb == "collide?" ) {
      var o:DynamicObject = <DynamicObject> sentence.argument;

      // We only care about collisions with other Badges
      if( o.ask({ verb:"is?", argument:"badge" }).verb == "is!" ) {
        // Apply repulsion force between the Badges, giving us some nice dynamic spacing
        //
        var distanceMax = this.position.areal + o.position.areal;
        var distance  = Math.abs(this.position.angle-o.position.angle);
        var direction = this.position.angle-o.position.angle >0? +1.0:-1.0;
        var accel     = this.accelMax * direction * ( 1.0 - distance/distanceMax );

        if( distance <= distanceMax ) {
          this.accel += accel;
          return { verb: "collide!", argument: accel}
        }
      }
    }
    return { verb: "smile!" };
  }
}
