const stream = require('stream');

class ObjectArrayToStringStream extends stream.Transform {
  constructor({ prefix, postfix, ...options }) {
    super(options);
    this._chunkPart = prefix;
    this._postfix = postfix;
  }

  _transform(chunk, encoding, callback) {
    callback(null, this._chunkPart + chunk.toString());
    this._chunkPart = ',';
  }

  _flush(callback) {
    callback(null, this._postfix);
  }
}

module.exports = ObjectArrayToStringStream;
