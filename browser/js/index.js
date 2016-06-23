const EventEmitter = require('events').EventEmitter
const through = require('through2')
const split = require('split2')
const websocket = require('websocket-stream');
const emitStream = require('emit-stream');
const MuxDemux = require('mux-demux')

const ws = websocket('ws://localhost:9090');
const mx = MuxDemux()
ws.pipe(mx).pipe(ws)
ws.pipe(split(JSON.parse)).pipe(through.obj(write))
const server = emitStream(mx.createReadStream('server'))
const client = new EventEmitter()
emitStream(client).pipe(mx.createWriteStream('client'))

const ui = {
  header: document.querySelector('header')
}

server.on('hello', msg => {
  ui.header.innerHTML = `<h1>${msg}</h1>`;
})

client.emit('client', 'hello server');


const broadcast = JSON.stringify({broadcast: 'this is a broadcast'});
ws.write(broadcast + '\n');

const serverMsg = JSON.stringify({server: 'hello from the client'});
ws.write(serverMsg + '\n');


function write (row, enc, next) {
  if (!row) next()
  if (row.msg) {
    console.log('message:', row.msg)
  }
  next()
}
