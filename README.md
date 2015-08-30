Arena Game
==========

#### Install dependencies:
```
npm install
```

#### Build:
```
source ./arena.sh
tsc -p .
```

#### Unit test:
```
tsc -p spec/
jasmine
```

#### Play:
http://www.atanaslaskov.com/arena/

It is possible to play locally but you have to run a web server
or the external .json files would not load in Chrome and some other browsers.
It's fairly easy to do:

```
python3 -m http.server
```
Then you can play at localhost:8000.
