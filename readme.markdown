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

---

```
npm run build
```

browserify and uglify

---

```
npm run watch
```

watichify

---

```
npm start
```

starts the server

---

```
npm run dev
```

starts the server with watchify on.

---

```
npm run production
```

starts the server and makes a browserify + uglify build.

---

```
npm t or npm run test
```

runs test on everything in /test

---

```
npm run lint
```

runs a eslint on everything.

---

```
npm run baitAndSwitch
```

😎 let's just say we'll need to update lint and test real quick.
