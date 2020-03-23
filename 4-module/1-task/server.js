const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (path.dirname(pathname) !== '.') {
        res.statusCode = 400;
        res.end('Request error');
      } else {
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
        fileStream.on('error', error => {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not found');
          } else {
            res.statusCode = 500;
            res.end('Server error');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
