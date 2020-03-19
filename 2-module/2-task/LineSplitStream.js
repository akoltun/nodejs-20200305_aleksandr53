const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._chunkPart = '';
  }

  _transform(chunk, encoding, callback) {
    const chunks = (this._chunkPart + chunk.toString()).split(os.EOL);
    this._chunkPart = chunks.pop();
    chunks.forEach(line => this.push(line));
    callback();
  }

  _flush(callback) {
    callback(null, this._chunkPart);
  }
}

module.exports = LineSplitStream;
