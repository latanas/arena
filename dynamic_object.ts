/*
  Project: Frontliner, Action/tactics game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/frontliner/
*/

/// <reference path="vector.ts" />
/// <reference path="polar_coordinate.ts" />

// Interface for dynamic objects in the game
//
interface DynamicObject{
  speed: number;
  position: PolarCoordinate;

  animate(dt: number);
  render(context: any, origin: Vector);
}
