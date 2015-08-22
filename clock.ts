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

  public dt:  number; // Time delta
  public fps: number; // Frames per second

  constructor() {
    this.clock = window.performance.now();

    // Reset clock when focus returns to the game window, or an FPS glitch will occur
    window.addEventListener("focus", () => {
      this.clock = window.performance.now();
    });
  }

  public tick() {
    var t = window.performance.now();
    this.dt = (t - this.clock) * 0.001; // sec

    if( this.dt <= 0 ) {
      this.dt = 0.001;
    }
    this.fps = 1.0 / this.dt;
    this.clock = t;

    // Return the time difference, because it is what we need for animation
    return this.dt;
  }
}
