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
