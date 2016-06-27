const through = require('through2')
const split = require('split2')
const websocket = require('websocket-stream');

const scoot = require('../../lib/scoot.js');
const so = scoot('msg')

const ws = websocket('ws://localhost:9090');
const sp = ws.pipe(split(JSON.parse))

sp.on('error', err => {
  console.error(err)
})

sp.pipe(through.obj(write))

const ui = {
  header: document.querySelector('header')
}

so(ws, 'hello from the client');

so(ws, {
  broadcast: 'this is a broadcast from a browser'
});

function write (row, enc, next) {
  if (!row) next()

  if (row.msg) {
    console.log('message:', row.msg)
  }

  if (row.header) {
    ui.header.innerHTML = `<h1>${row.header}</h1>`;
  }

  next()
}

