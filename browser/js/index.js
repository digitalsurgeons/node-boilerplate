const through = require('through2');
const split = require('split2');
const websocket = require('websocket-stream');
const level = require('level');
const scoot = require('scoot-stream');

const db = level({
  valueEncoding: 'json',
  keyEncoding: require('bytewise')
});

db.createReadStream({
  gt: 'cats!',
  lt: 'cats!~'
}).on('data', data => {
  console.log(data);
});

const ui = {
  header: document.querySelector('header'),
  input: document.querySelector('input'),
  page: document.querySelector('.page')
};

const ws = websocket('ws://localhost:9090');
const sp = ws.pipe(split(JSON.parse));
const so = scoot('msg');

sp.on('error', err => {
  console.error(err);
});

sp.pipe(through.obj(write));

so(ws, 'hello from the client');

so(ws, {
  read: 'cats'
});

ui.input.addEventListener('keydown', ev => {
  if (ev.keyCode === 13) {
    const value = ui.input.value;

    const li = document.createElement('li');
    li.innerHTML = value;
    ul.appendChild(li);

    so(ws, {
      broadcast: value,
      cookie: document.cookie.split('session=')[1]
  });
  }
});

const ul = document.createElement('ul');
ui.page.appendChild(ul);


function write (row, enc, next) {
  if (!row) next();

  if (row.msg) {
    const li = document.createElement('li');
    li.innerHTML = row.msg;
    ul.appendChild(li);
  }

  if (row.header) {
    ui.header.innerHTML = `<h1>${row.header}</h1>`;
  }

  if (row.key) {
    if (row.key.indexOf('cats!') === 0) {
      db.put(row.key, row.value, err => {
        if (err) console.error(err);
	});
    }
  }

  next();
}
