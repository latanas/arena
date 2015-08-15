/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />
/// <reference path="renderer.ts" />

// Interface for a message
//
interface DynamicMessage{
  verb: string;
  argument?: any;
}

// Interface for dynamic objects in the game
//
interface DynamicObject{
  speed:    number;
  position: PolarCoordinateAreal;

  // Animate and render
  animate(dt: number, origin_speed: number);
  render(renderer: Renderer, origin: Vector);

  // Ask politely
  ask(sentence: DynamicMessage): DynamicMessage;
}
