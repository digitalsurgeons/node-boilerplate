/*************************************************************************\
 *  Welcome to the DS Node.js Boilerplate!                               *
 *  This should be enough to get you started with build Node.js Apps.    *
 *  Please remove things that you don't need.                            *
 *  Also feel free to change anything and submit pull request.           *
\*************************************************************************/

// core Node.js modules
const http = require('http'); // http client
const fs = require('fs'); // file system
const crypto = require('crypto') // crypto
const EventEmitter = require('events').EventEmitter // event emitter

// useful npm modules that do one thing and one thing well (unix philosophy)
const emitStream = require('emit-stream') // streaming event emiiter
const JSONStream = require('JSONStream') // streaming JSON
const MuxDemux = require('mux-demux') // multiplex-demultiplex object streams
const hyperstream = require('hyperstream') // streaming html into html
const routes = require('patterns')(); // http router
const st = require('st'); // static file server
const body = require('body/any') // form body parser
const oppressor = require('oppressor') // gzip
const websocket = require('websocket-stream'); // websockets
const level = require('level'); // database
const cookie = require('cookie') // cookie parser
const has = require('has') // Object.prototype.hasOwnProperty.call shortcut
const split = require('split2')
const through = require('through2')
const eof = require('end-of-stream')

// server gzipped static files from the dist folder
const serve = st({
  path: 'browser/dist',
  cache: false // edit or delete this line for production
});

// creates or connects a lexiographically sorted database in /db
// if /db does not exist it will be created
const db = level('db', {
  valueEncoding: 'json',
  keyEncoding: require('bytewise')
});

// set up a sessions
const sessions = {}

// routing
routes.add('GET /', render('login'));
routes.add('POST /login', (req, res, params) => {
  body(req, res, (err, form) => {
    if (err) {
      console.error(err)
      res.statusCode = 404
      res.end(err + '\n')
    }

    // set a session cookie
    const sid = crypto.randomBytes(64).toString('hex');
    sessions[sid] = form.username;
    res.setHeader('set-cookie', `session=${sid}`);

    // redirect home
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  })
})

// http server
// if the request method and url is a defined route then call it's function
// else serve a static file from the dist folder, or 404
const server = http.createServer((req, res) => {
  const match = routes.match(`${req.method} ${req.url}`);

  if (!match) {
    serve(req, res);
    return true;
  }

  const fn = match.value;
  req.params = match.params;

  fn(req, res);
});

// listen for http request on port 9090
server.listen(9090, () => {
  console.log('Server is running on http://localhost:9090');
});

// websocket server
const wss = websocket.createServer({server: server}, connection);

// track your sockets
const sockets = [];

// WebSocket + EventEmitter + Streams API for the server and the browser
function connection (stream) {
  // MuxDemux method
  const mx = MuxDemux(socketsRouter);
  stream.pipe(mx).pipe(stream);

  // through stream method
  stream.pipe(split(JSON.parse)).pipe(through.obj(write))
  sockets.push(stream);

  eof(stream, () => {
    const ix = sockets.indexOf(stream)
    if (ix > -1) sockets.splice(ix, 1)
  })

  function write (row, enc, next) {
    if (!row) next();

    // broadcast
    if (row.broadcast) {
      const msg = JSON.stringify({msg: row.broadcast});
      sockets.forEach(socket => {
        socket.write(msg + '\n');
      })
    }

    // message from the client
    if (row.server) {
      console.log(row.server);
    }

    // message back the client
    const clientMsg = JSON.stringify({msg: 'hello from the server!'});
    stream.write(clientMsg + '\n')
    next()
  }

}

function socketsRouter (stream) {
  const meta = stream.meta;
  let socket;
  if (meta === 'server') {
    socket = new EventEmitter();
    emitStream(socket).pipe(stream);
  } else if (meta ==='client') {
    socket = emitStream(stream)
  }

  socket.emit('hello', 'DS Node.js Boilerplate')
  socket.on('client', msg => console.log(msg));
}


function render (page) {
  return (req, res) => {
    res.setHeader('content-type', 'text/html');

    // check if the user is "logged in"
    const cookies = cookie.parse(req.headers.cookie || '');
    const isSession = cookies.session && has(sessions, cookies.session);

    const chat = {
      '.username': sessions[cookies.session], // this needs to go in chat
      '.page': fs.createReadStream('browser/pages/chat.html')
    };

    const pageHTML = {
      '.page': fs.createReadStream(`browser/pages/${page}.html`)
    };

    const indexHTML = fs.createReadStream('browser/index.html');
    const updateUsername = hyperstream({
        '.username': sessions[cookies.session]
    })
    const selectors = isSession ?
      chat :
      pageHTML

    indexHTML
      .pipe(hyperstream(selectors))
      .pipe(updateUsername)
      .pipe(oppressor(req))
      .pipe(res);
  }
}
