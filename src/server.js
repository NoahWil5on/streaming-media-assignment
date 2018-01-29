const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);

  const fileType = getFileType(request.url);

  switch (request.url) {
    case '/':
        htmlHandler.getIndex(request, response);
        break;
    case '/page2':
        htmlHandler.getPage2(request, response);
        break;
    case '/page3':
        htmlHandler.getPage3(request, response);
        break;
    default:
        if(fileType == ".mp3" || fileType == ".mp4"){
            mediaHandler.getMedia(request, response);
        }else{
            htmlHandler.getIndex(request, response);
        }
      break;
  }
};

function getFileType(path){
    return path.substr(path.length - 4);
}

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
