/*
  Project: Arena game
  Author:  Copyright (C) 2015, Atanas Laskov

  License: BSD license, see LICENSE.md for more details.

  http://www.atanaslaskov.com/arena/
*/

// Data file loader
//
class DataFile{
  constructor(jsonFileName: string, done: (jsonData)=>void) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>{
      if( xhr.readyState==4 && xhr.status==200 ) {
        done( JSON.parse(xhr.responseText) );
      }
    }
    xhr.open("GET", "assets/" + jsonFileName, true);
    xhr.send();
  }
}
