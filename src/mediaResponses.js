const fs = require('fs');
const path = require('path');

function getContentType(myPath) {
  const fileType = myPath.substr(myPath.length - 4);
  let contentType = '';
  switch (fileType) {
    case '.mp4':
      contentType = 'video/mp4';
      break;
    case '.mp3':
      contentType = 'audio/mpeg';
      break;
    default:
      contentType = 'video/mp4';
      break;
  }

  return contentType;
}
function getPositions(request, stats) {
  let { range } = request.headers;
  if (!range) { range = 'bytes=0-'; }
  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);
  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
  if (start > end) {
    start = end - 1;
  }
  const chunksize = (end - start) + 1;

  return {
    chunksize,
    start,
    end,
    total,
  };
}
function getStream(file, position, response) {
  const stream = fs.createReadStream(file, { start: position.start, end: position.end });

  stream.on('open', () => { stream.pipe(response); });
  stream.on('error', (streamErr) => { response.end(streamErr); });

  return stream;
}
function doStat(request, response, file) {
  const contentType = getContentType(request.url);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') response.writeHead(404);
      return response.end(err);
    }
    const position = getPositions(request, stats);

    response.writeHead(206, {
      'Content-Range': `bytes ${position.start}-${position.end}/${position.total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': position.chunksize,
      'Content-Type': contentType,
    });

    return getStream(file, position, response);
  });
}

const getMedia = (request, response) => {
  const file = path.resolve(__dirname, `../client${request.url}`);
  doStat(request, response, file);
};

module.exports.getMedia = getMedia;
