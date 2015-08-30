/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="renderer.ts" />
/// <reference path="curve.ts" />
/// <reference path="clock.ts" />

/// <reference path="dynamic_object.ts" />
/// <reference path="data_file.ts" />

/// <reference path="player_spaceship.ts" />
/// <reference path="enemy_spaceship.ts" />
/// <reference path="projectile.ts" />
/// <reference path="badge.ts" />

// Game initializes and manages dynamic objects
//
class Game{
  private renderer: Renderer;

  private clock: Clock;
  private isPaused: boolean;

  private dynamicObjects: DynamicObject[];

  private arenaList: Curve[];
  private arenaBackgroundPosition: Vector;
  private arenaBackgroundScale: number;
  private arenaBackgroundAlpha: number;

  constructor(r: Renderer) {
    this.renderer = r;
    this.clock    = new Clock();
    this.isPaused = false;

    this.dynamicObjects = [];
    this.arenaBackgroundPosition = new Vector();
    this.arenaBackgroundScale = 1.0;
    this.arenaBackgroundAlpha = 1.0;

    // Initialize two empty arenas
    this.arenaList = [
      new Curve( new Vector(0.0, 0.0), 0.45 ),
      new Curve( new Vector(0.0, 0.0), 0.35 ),
    ];

    // Load data into one arena, and set it as morph target
    new DataFile(
      "arena.json",
      (jsonData) => {
        this.arenaList[0].load(jsonData);
        this.arenaList[1].animationMorphTarget( this.arenaList[0].compute() );

        this.spawnPlayer();
        setTimeout(()=>{ this.spawnEnemy(); }, 1500);
      }
    );
  }

  // Currently active arena
  //
  public arena(): Curve{
    var i:number = this.arenaList[1].animationMorphCompleted()? 0:1;
    return this.arenaList[i];
  }

  // Single action frame of the game
  //
  actionFrame = () => {
    var dt = this.clock.tick();

    this.render();
    if( !this.isPaused ) this.animate(dt);
    window.requestAnimationFrame( this.actionFrame );
  }

  // Make a picture
  //
  private render() {
    var r = this.renderer;
    r.background( this.arenaBackgroundPosition, this.arenaBackgroundScale, this.arenaBackgroundAlpha);

    this.arena().render(r);

    for( var i=0; i<this.dynamicObjects.length; i++) {
      var o = this.dynamicObjects[i];

      if( !o ) continue;
      o.render(r, this.arena().origin);
    }
  }

  // Make things move
  //
  private animate(dt: number) {
    this.arenaBackgroundPosition.x -= dt * 30.0;
    this.arenaBackgroundPosition.y += dt * 2.0;
    this.arenaBackgroundScale = (Math.sin( this.clock.clock*0.00008 )+1.0)*0.2+0.6;
    this.arenaBackgroundAlpha = (Math.sin( this.clock.clock*0.002 )+1.0)*0.08 + 0.6;
    this.arena().animate(dt);

    // Dynamic objects
    //
    for( var i=0; i<this.dynamicObjects.length; i++) {
      var o = this.dynamicObjects[i];
      if( !o ) continue;
      o.animate(dt, 0.0);

      // Ask the object to follow arena contour
      o.ask({ verb: "follow!", argument: this.arena().computedRadiusAt( o.position.angle ) })

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
          this.isPaused = true;
          setTimeout(this.spawnPlayer, 4000);
          setTimeout(this.spawnEnemy, 6000);
        }
        else if( o.ask({ verb: "is?", argument: "spaceship" }).verb == "is!" ) {
          this.spawnObject( new Badge() );
          setTimeout(this.spawnEnemy, 3000);
        }
        this.dynamicObjects[i] = null;
      }
    }
  }

  // Spawn an object in a free slot
  //
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
  //
  spawnEnemy = () => {
    console.log("Respawn spaceship.");
    this.spawnObject(
      new EnemySpaceship( new PolarCoordinate( /*Math.random()*Math.PI*0.5 + 1.2*/(-0.5)*Math.PI, 0.4) )
    );
  }

  // Spawn a new player spaceship
  //
  spawnPlayer = () => {
    console.log("Respawn player.");

    this.isPaused = false;
    this.dynamicObjects.length = 0;

    this.spawnObject(
      new PlayerSpaceship( new PolarCoordinate(Math.PI*0.5, 0.4) )
    );
  }
}
