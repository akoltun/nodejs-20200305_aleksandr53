const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const limit = 1024 * 1024;

const ERROR_MESSAGES = {
  201: 'Created',
  400: 'Request error',
  409: 'File already exists',
  413: 'File size limit exceeded',
  500: 'Server error',
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const endResponse = (status) => {
    res.statusCode = status;
    res.end(ERROR_MESSAGES[status]);
  };

  switch (req.method) {
    case 'POST':
      if (path.dirname(pathname) !== '.') {
        endResponse(400);
      } else {
        const limitSizeStream = new LimitSizeStream({limit});
        const fileStream = fs.createWriteStream(filepath, {flags: 'ax'});
        req.pipe(limitSizeStream).pipe(fileStream);

        limitSizeStream.on('error', (error) => {
          if (error.code === 'LIMIT_EXCEEDED') {
            fs.unlink(filepath, (error) => {
              if (error) endResponse(500);
              else endResponse(413);
            });
          } else {
            endResponse(500);
          }
        });

        fileStream.on('error', (error) => {
          if (error.code === 'EEXIST') {
            endResponse(409);
          } else {
            endResponse(500);
          }
        });

        // We have to use close instead of finish because on Node 12.12-
        // finish happens even in case of error, befor error event.
        // Starting from Node 12.13 there is only error event (no finish)
        // if error happened, therefore it is possible to use finish event
        fileStream.on('close', () => {
          if (fileStream.writableFinished) endResponse(201);
        });

        req.on('aborted', () => {
          fs.unlink(filepath, () => {
            req.destroy();
          });
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
