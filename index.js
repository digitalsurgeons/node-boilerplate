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
const trumpet = require('trumpet'); // streaming html into html
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
const scoot = require('scoot-stream'); // s.write(JSON.stringify(x) +'/n') shortcut

const so = scoot('msg'); // I wrote scoot-stream.

// server gzipped static files from the dist folder
const serve = st({
  path: 'browser/dist/',
  cache: false // edit or delete this line for production
});

// creates or connects a lexiographically sorted database in /db
// if /db does not exist it will be created
const db = level('db', {
  valueEncoding: 'json',
  keyEncoding: require('bytewise')
});

const catopts = [
  {
    key: 'cats!gizmo',
    value: ['outdoors', 'hunting mice']
  },
  {
    key: 'cats!pepper',
    value: ['indoors', 'cuddling with hoomans']
  }
];

db.batch(catopts, err => {
  if (err) console.error(err);
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

    // create a session cookie
    const sid = crypto.randomBytes(64).toString('hex');
    sessions[sid] = form.username;

    // put the user in the db
    db.put(`users!${sid}`, form.username, err => {
      if (err) console.error(err);
    });

    // set the session cookie
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

  // set the html <header>
  so(stream, {
    header: 'DS Node.js Boilerplate'
  });

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

    // if the user sent their cookie
    if (row.cookie) {
      // get their name from the db
      db.get(`users!${row.cookie}`, (err, user) => {
        if (err) console.error(err);

        // if they are broadcasting
        if (row.broadcast) {
          sockets.forEach(socket => {
            if (socket !== stream) {
              so(socket, `${user} > ${row.broadcast}`);
            }
          });
        }
      });
    }

    if (row.read === 'cats') {
      const cats = db.createReadStream({
        gt: 'cats!',
        lt: 'cats!~'
      });

      cats.on('data', data => {
        so(stream, data);
      });
    }

    // call next row
    next();
  }));

  sockets.push(stream);

  // example message the client
  so(stream, 'hello from the server!');

  // example broadcast
  sockets.forEach(socket => so(socket, 'this is a broadcast'));

  eof(stream, () => {
    const ix = sockets.indexOf(stream);
    if (ix > -1) sockets.splice(ix, 1);
  });

}


function render (page) {
  return (req, res) => {
    // set content type
    res.setHeader('content-type', 'text/html');

    // create html stream, gzip, then pipe to response
    const tr = trumpet();
    tr.pipe(oppressor(req)).pipe(res);

    // create a write stream to the .page selector
    const pageStream = tr.select('.page').createWriteStream();

    // check if the user is "logged in"
    const cookies = cookie.parse(req.headers.cookie || '');
    const isSession = cookies.session && has(sessions, cookies.session);

    if (isSession) {
      // pipe a read stream to the page selector
      const chat = trumpet();
      chat.pipe(pageStream);

      // update the usernmae
      const username = chat.select('.username').createWriteStream();
      username.end(sessions[cookies.session]);

      // pipe the chat html to the stream that pipes to .page
      fs.createReadStream('browser/pages/chat.html').pipe(chat);

    } else {
      // pipe the rendered html to stream that pipes to .page
      fs.createReadStream(`browser/pages/${page}.html`).pipe(pageStream);
    }

    // pipe the root html to the html stream
    fs.createReadStream('browser/index.html').pipe(tr);
  };
}
