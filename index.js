/*************************************************************************\
 *  Welcome to the DS Node.js Boilerplate!                               *
 *  This should be enough to get you started with build Node.js Apps.    *
 *  Please remove things that you don't need.                            *
 *  Also feel free to change anything and submit pull request.           *
\*************************************************************************/

// core Node.js modules
const http = require('http'); // http client
const fs = require('fs'); // file system
const crypto = require('crypto'); // crypto

// useful npm modules that do one thing and one thing well (unix philosophy)
const hyperstream = require('hyperstream'); // streaming html into html
const routes = require('patterns')(); // http router
const st = require('st'); // static file server
const body = require('body/any'); // form body parser
const oppressor = require('oppressor'); // gzip
const websocket = require('websocket-stream'); // websockets
const level = require('level'); // database
const cookie = require('cookie'); // cookie parser
const has = require('has'); // Object.prototype.hasOwnProperty.call shortcut
const split = require('split2'); // split text stream into line stream
const through = require('through2'); // transform stream
const eof = require('end-of-stream'); // callback at end of stream

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
const sessions = {};

// routing
routes.add('GET /', render('login'));
routes.add('POST /login', (req, res, params) => {
  body(req, res, (err, form) => {
    if (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(err + '\n');
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

  });
});

// http server
// if the request method and url is a defined route then call it's function
// else serve a static file from the dist folder, or 404
const server = http.createServer((req, res) => {
  const match = routes.match(`${req.method} ${req.url}`);

  if (match) {
    const fn = match.value;
	req.params = match.params;
	fn(req, res);
  }
  else serve(req, res);

});

// listen for http request on port 9090
server.listen(9090, () => {
  console.log('Server is running on http://localhost:9090');
});

// websocket server
const wss = websocket.createServer({server: server}, connection);

// track your sockets
const sockets = [];

// WebSocket Stream for the server and the browser
function connection (stream) {

  const sp = stream.pipe(split(JSON.parse));

  const header = JSON.stringify({
    header: 'DS Node.js Boilerplate'
  });

  // set the html <header>
  stream.write(header + '\n');

  sp.on('error', err => {
    console.error(err);
  });

  sp.pipe(through.obj((row, enc, next) => {
    if (!row) next();

    // handle each row of JSON here


    // example message from the client
    if (row.msg) {
      console.log(row.msg);
    }


    // broadcast to everyone else
    if (row.broadcast) {
      sockets.forEach(socket => {
        if (socket !== stream) {
          socket.write(JSON.stringify({msg: row.broadcast}) + '\n');
        }
	  });
    }

    // call next row
    next();
  }));

  sockets.push(stream);

  // example message the client
  const clientMsg = JSON.stringify({msg: 'hello from the server!'});
  stream.write(clientMsg + '\n');

  // example broadcast
  sockets.forEach(socket => {
    socket.write(JSON.stringify({msg: 'this is a broadcast'}) + '\n');
  });

  eof(stream, () => {
    const ix = sockets.indexOf(stream);
    if (ix > -1) sockets.splice(ix, 1);
  });

}


function render (page) {
  return (req, res) => {
    res.setHeader('content-type', 'text/html');

    // check if the user is "logged in"
    const cookies = cookie.parse(req.headers.cookie || '');
    const isSession = cookies.session && has(sessions, cookies.session);

    const chat = {
      '.page': fs.createReadStream('browser/pages/chat.html')
    };

    const pageHTML = {
      '.page': fs.createReadStream(`browser/pages/${page}.html`)
    };

    const indexHTML = fs.createReadStream('browser/index.html');
    const updateUsername = hyperstream({
        '.username': sessions[cookies.session]
    });
    const selectors = isSession ?
      chat :
      pageHTML;

    indexHTML
      .pipe(hyperstream(selectors))
      .pipe(updateUsername)
      .pipe(oppressor(req))
	  .pipe(res);
  };
}
