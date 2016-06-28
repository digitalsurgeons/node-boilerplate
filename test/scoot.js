const scoot = require('scoot-stream');
const test = require('tape');
const through = require('through2');
const split = require('split2');
const stream = through();

test('simple', t => {
  t.plan(1);

  const sp = stream.pipe(split(JSON.parse));
  sp.on('error', err => {
    t.fail(err);
  });

  const so = scoot('test');

  so(stream, 'pass?');

  sp.pipe(through.obj((row, enc, next) => {
    if (!row) next();

    if (row.test) {
      t.same(row.test, 'pass?');
    }

    next();
  }));
});
