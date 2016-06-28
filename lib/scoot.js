module.exports = prop => (stream, msg) => {
  if (!prop) throw new Error('scoot requires a default property');
  if (!stream) throw new Error('scoot requires a stream');

  if (typeof msg === 'string') {
    const obj = {};
    obj[prop] = msg;
    stream.write(`${JSON.stringify(obj)}\n`);
  } else if (msg !== null && typeof msg === 'object' && !(Array.isArray(msg))) {
    stream.write(`${JSON.stringify(msg)}\n`);
  } else throw new Error('scoot requires a message string or object.');
};
