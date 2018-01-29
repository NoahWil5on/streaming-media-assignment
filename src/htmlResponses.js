const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

function writePage(page, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page);
  response.end();
}

const getIndex = (request, response) => { writePage(index, response); };
const getPage2 = (request, response) => { writePage(page2, response); };
const getPage3 = (request, response) => { writePage(page3, response); };

module.exports.getIndex = getIndex;
module.exports.getPage2 = getPage2;
module.exports.getPage3 = getPage3;
