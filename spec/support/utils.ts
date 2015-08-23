/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

// Limit precision to 3 decimal places
//
function limitPrecision(n: number) {
  return Math.round( n * 1000.0 ) / 1000;
}
