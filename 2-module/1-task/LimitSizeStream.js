const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({ limit, ...options }) {
    super(options);
    this._limit = limit;
    this._size = 0;
  }

  _transform(chunk, encoding, callback) {
    this._size += chunk.length;

    if (this._size > this._limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
