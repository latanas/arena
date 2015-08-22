/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

// Animation clock
//
class Clock{
  private clock: number;
  private fpsUpdateTime: number;

  public dt:  number; // Time delta
  public fps: number; // Frames per second

  constructor() {
    this.clock = window.performance.now();
    this.fpsUpdateTime = 0;

    // Reset clock when focus returns to the game window, or an FPS glitch will occur
    window.addEventListener("focus", () => {
      this.clock = window.performance.now();
    });
  }

  public tick() {
    var t = window.performance.now();
    this.dt = (t - this.clock) * 0.001; // Sec

    if( this.dt <= 0 ) {
      this.dt = 0.001;
    }
    this.fps = 1.0 / this.dt;
    this.clock = t;

    // Every 0.5 seconds, show an updated figure
    //
    this.fpsUpdateTime -= this.dt;

    if( this.fpsUpdateTime <= 0 ) {
      this.fpsUpdateTime = 0.5;
      document.getElementById("fps").innerHTML = "Frame Rate: " + Math.round(this.fps) + "fps";
    }

    // Return the time difference, because it is what we need for animation
    return this.dt;
  }
}
