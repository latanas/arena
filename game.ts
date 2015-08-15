/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="renderer.ts" />

/// <reference path="arena.ts" />
/// <reference path="dynamic_object.ts" />
/// <reference path="player_spaceship.ts" />
/// <reference path="enemy_spaceship.ts" />
/// <reference path="projectile.ts" />

// Game initializes and manages the dynamic objects
//
class Game{
  private renderer: Renderer;
  private clock: number;

  private arena: Arena;
  private dynamicObjects: DynamicObject[];

  constructor(r: Renderer) {
    this.renderer = r;
    this.clock = window.performance.now();

    this.arena = new Arena( new Vector(0.0, 0.0), 0.5 );

    this.dynamicObjects = [
      new PlayerSpaceship( new PolarCoordinate(Math.PI/2.0, 0.5-0.05) ),
      new EnemySpaceship( new PolarCoordinate(-Math.PI/2.0, 0.5-0.05) )
    ];
  }

  // Animation frame
  //
  animationFrame = () => {
    var t  = window.performance.now();
    var dt = t - this.clock;
    this.clock = t;

    var r = this.renderer;
    r.background();

    // Game arena
    this.arena.render(r);
    this.arena.animate(dt);

    // Dynamic objects
    var dynamicObjectsRefresh = [];

    for( var i=0; i<this.dynamicObjects.length; i++) {
      var o = this.dynamicObjects[i];
      o.render(r, this.arena.origin);
      o.animate(dt, 0.0);

      // Ask the object to follow arena contour
      o.ask({ verb: "follow!", argument: this.arena.radiusAt( o.position.angle )-0.05 })

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
