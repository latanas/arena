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

    this.dynamicObjects = [];
    this.spawnPlayer();
    this.spawnEnemy();
  }

  // Single action frame of the game
  //
  actionFrame = () => {
    var t  = window.performance.now();
    var dt = t - this.clock;
    this.clock = t;

    var r = this.renderer;
    r.background();

    // Game arena
    this.arena.render(r);
    this.arena.animate(dt);

    // Dynamic objects
    //
    for( var i=0; i<this.dynamicObjects.length; i++) {
      var o = this.dynamicObjects[i];
      if( !o ) continue;

      o.render(r, this.arena.origin);
      o.animate(dt, 0.0);

      // Ask the object to follow arena contour
      o.ask({ verb: "follow!", argument: this.arena.radiusAt( o.position.angle )-0.05 })

      // Ask the object if it wants to attack
      var attack = o.ask({verb: "attack?"});

      // The object says "attack!", so it must give us a Projectile
      if( attack.verb == "attack!") {
        this.spawnObject( <Projectile> attack.argument );
      }

      // Ask the object if it collides with another one
      for( var j=0; j<this.dynamicObjects.length; j++) {
        var oo = this.dynamicObjects[j];
        if( (i == j) || !oo ) continue;
        var collide = o.ask({ verb: "collide?", argument: oo });

        if( collide.verb == "collide!" ) {
          oo.ask({ verb: "damage!", argument: collide.argument });
        }
      }

      // If a ship is discarded, we want to spawn a new one
      if( o.ask({verb: "discard?"}).verb == "discard!" ) {
        if( o.ask({ verb: "gameover?" }).verb == "gameover!" ) {
          setTimeout(this.spawnPlayer, 3000);
        }
        else if( o.ask({ verb: "is?", argument: "spaceship" }).verb == "is!" ) {
          setTimeout(this.spawnEnemy, 3000);
        }
        this.dynamicObjects[i] = null;
      }
    }
    window.requestAnimationFrame( this.actionFrame );
  }

  // Spawn an object in a free slot
  private spawnObject(o: DynamicObject) {
    for( var i=0; i<this.dynamicObjects.length; i++) {
      if( !this.dynamicObjects[i] ) {
        this.dynamicObjects[i] = o;
        return;
      }
    }
    this.dynamicObjects.push(o);
  }

  // Spawn a new enemy spaceship
  spawnEnemy = () => {
    console.log("Respawn spaceship.");
    this.spawnObject(
      new EnemySpaceship( new PolarCoordinate( /*Math.random()*Math.PI*0.5 + 1.2*/(-0.5)*Math.PI, 0.45) )
    );
  }

  // Spawn a new player spaceship
  spawnPlayer = () => {
    console.log("Respawn player.");
    this.spawnObject(
      new PlayerSpaceship( new PolarCoordinate(Math.PI*0.5, 0.45) )
    );
  }
}
