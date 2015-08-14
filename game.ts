/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />

/// <reference path="arena.ts" />
/// <reference path="dynamic_object.ts" />
/// <reference path="player_spaceship.ts" />
/// <reference path="enemy_spaceship.ts" />
/// <reference path="projectile.ts" />

// Game initializes and manages the dynamic objects
//
class Game{
  // Renderer and animation clock
  private context: CanvasRenderingContext2D;
  private width:   number;
  private height:  number;
  private clock:   number;

  private arena: Arena;
  private dynamicObjects: DynamicObject[];

  constructor() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    var c = document.createElement("canvas");
    c.width  = this.width;
    c.height = this.height;
    document.body.appendChild(c);

    this.context = <CanvasRenderingContext2D> c.getContext("2d");
    this.clock = window.performance.now();

    var spacing = 100;
    var radius = (Math.min( this.width, this.height ) - spacing)/2.0;
    var x:number = radius + (this.width - radius*2.0)/2.0;
    var y:number = radius + (this.height - radius*2.0)/2.0;

    this.arena = new Arena( new Vector(x,y), radius );

    this.dynamicObjects = [
      new PlayerSpaceship( new PolarCoordinate(Math.PI/2.0, radius-100) ),
      new EnemySpaceship( new PolarCoordinate(-Math.PI/2.0, radius-100) )
    ];
  }

  // Animation frame
  //
  animationFrame = () => {
    var t  = window.performance.now();
    var dt = t - this.clock;
    this.clock = t;

    var c = this.context;
    c.clearRect(0, 0, this.width, this.height);

    // Game arena
    this.arena.render(c);
    this.arena.animate(dt);

    // Dynamic objects
    var dynamicObjectsRefresh = [];

    for( var i=0; i<this.dynamicObjects.length; i++) {
      var o = this.dynamicObjects[i];
      o.render(c, this.arena.origin);
      o.animate(dt, 0.0);

      // Ask the object to follow arena contour
      o.ask({ verb: "follow!", argument: this.arena.radiusAt( o.position.angle )-50 })

      // Ask the object if it wants to attack
      var attack = o.ask({verb: "attack?"});

      // The object says "attack!" so it must give us a Projectile
      if( attack.verb == "attack!") {
        dynamicObjectsRefresh.push( <Projectile> attack.argument );
      }

      // Ask the object if it wants to be discarded
      var discard = o.ask({verb: "discard?"});

      // The object doesn't want to be discarded, put it on the refresh list
      if( discard.verb != "discard!") {
        dynamicObjectsRefresh.push( o );
      }
    }

    this.dynamicObjects = dynamicObjectsRefresh;
    window.requestAnimationFrame( this.animationFrame );
  }
}
