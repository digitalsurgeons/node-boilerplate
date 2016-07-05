# DS Node.js Boilerplate

> Rule of Composition: Design programs to be connected to other programs.

## Quick Start

note: if this fails  then `npm i node-gyp -g` and try again.

```
npm install
npm run dev
```

open http://localhost:9090

## What is in DS Node.js Boilerplate?

### Static files

[st](https://www.npmjs.com/package/st) to server static files.  It comes with gzipping and cache configuration.

### Routing

[patterns](https://www.npmjs.com/package/patterns) to handle our routes.

### Database

[level](https://www.npmjs.com/package/level) is an embedded key/value store with stream support.

### websockets

[websocket-stream](https://www.npmjs.com/package/websocket-stream) a streaming wrapper around the light-weight ws module.

### templating

[trumpet](https://www.npmjs.com/package/trumpet) streams html into html.


## npm scripts

browserify and uglify: `npm run build`


watichify: `npm run watch`


start the server: `npm start`


start the server with watchify: `npm run dev`


start the server / make a browserify + uglify build: `npm run production`


run test: `npm t` or `npm run test`


run eslint: `npm run lint`

😎 (check package.json) `npm run baitAndSwitch`

## resources

### streams

> "Streams are like Arrays, but laid out in time, rather than in memory.""

- [stream handbook](https://github.com/substack/stream-handbook)
- [streams primer (video)](https://www.youtube.com/watch?v=yOSNQZm3Trw)
- [stream adventure](https://github.com/substack/stream-adventure)
- [harnessing the awesome power of streams (video)](https://www.youtube.com/watch?v=lQAV3bPOYHo)
- [full streams ahead](http://dry.ly/full-streams-ahead)
- [node streams](http://maxogden.com/node-streams.html)
- [flow control](https://gist.github.com/dominictarr/2401787#use-flow-control-over-control-flow)
- [history of streams](http://dominictarr.com/post/145135293917/history-of-streams)
- [pull streams](https://medium.com/@yoshuawuyts/streams-in-node-ab9f13e15d5#.3kpzaqq0h)

### browserify

- [browserify handbook](https://github.com/substack/browserify-handbook)
- [browserify adventure](https://github.com/substack/browserify-adventure)
- [browserify for webpack users](https://github.com/substack/browserify-handbook)

### leveldb

- [Intro to Leveldb (video)](https://www.youtube.com/watch?v=sR7p_JbEip0)
- [API](https://github.com/Level/levelup#api)
- [The Node.js of databases](https://r.va.gg/presentations/nodejsdub/#/)
- [poor man's firebase](http://procbits.com/2014/01/06/poor-mans-firebase-leveldb-rest-and-websockets)
- [level me up Scotty (workshop)](https://github.com/workshopper/levelmeup)
- [level me up Scotty (video)](https://www.youtube.com/watch?v=41oDDTRWjIQ)
- [What does "Scalable" mean anyway? (video)](https://www.youtube.com/watch?v=rLeCV7eODVg)
