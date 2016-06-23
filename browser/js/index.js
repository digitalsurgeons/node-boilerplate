const through = require('through2')
const split = require('split2')
const websocket = require('websocket-stream');

const ws = websocket('ws://localhost:9090');
const sp = ws.pipe(split(JSON.parse))

const ui = {
  header: document.querySelector('header')
}

sp.on('error', err => {
  console.error(err)
})

sp.pipe(through.obj(write))

const serverMsg = JSON.stringify({msg: 'hello from the client'});
ws.write(serverMsg + '\n');

const broadcast = JSON.stringify({
  broadcast: 'this is a broadcast from a browser'
});
ws.write(broadcast +'\n');

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

