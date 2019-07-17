const path = require('path');
const fs = require('fs');


function numberPlusFive({number}) {
  console.log('in number plus five', number + 5);
  return {number: number + 5};
}

function numberToNumber(call, callback) {
  // console.log('inside of numberToNumber')
  // console.log('callback', callback)
  // console.log('call:', call)
  callback(null, numberPlusFive(call.request));
};


function readFile(call) {
  let filePath = path.join(__dirname + '/someText.txt')
  // console.log(call)
  let readFile = fs.readFileSync(filePath);

  // console.log(readFile) // sends buffer data
  // console.log(readFile.toString())
  // call.write( readFile.toString() )
  call.write({path: readFile.toString()})
  call.end()

  // return filePath
}

module.exports = {numberToNumber, readFile} 