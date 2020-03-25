const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const ERROR_MESSAGES = {
  200: 'Deleted',
  400: 'Request error',
  404: 'File not found',
  500: 'Server error'
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const endResponse = status => {
    res.statusCode = status;
    res.end(ERROR_MESSAGES[status]);
  };

  switch (req.method) {
    case 'DELETE':
      if (path.dirname(pathname) !== '.') {
        endResponse(400);
      } else {
        fs.unlink(filepath, error => {
          if (error) {
            if (error.code === 'ENOENT') {
              endResponse(404);
            } else {
              endResponse(500);
            }
          } else {
            endResponse(200);
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
