const grpc = require("grpc");
const fs = require('fs');
const path = require('path');

// function serverInterceptor(call, nextCall) {
//   //if conditional
//   nextCall(call)
// }

//secret

function numberPlusFive({ number }) {
  return { number: number + 5 };
}

//EXAMPLE CALL OBJECT
// ServerUnaryCall {
//   _events: [Object: null prototype] { error: [Function] },
//   _eventsCount: 1,
//   _maxListeners: undefined,
//   call: Call {},
//   cancelled: false,
//   metadata:
//    Metadata {
//      _internal_repr:
//       { 'user-agent': [ 'grpc-node/1.22.2 grpc-c/7.0.0 (osx; chttp2; gale)' ] },
//      flags: 0 },
//   request: { number: 3 } }

function numberToNumber(call, callback) {
  console.log("inside of numberToNumber");
  console.log("callback", callback);
  console.log("call:", call);
  const meta = new grpc.Metadata();
  meta.set("hello", "world");
  call.sendMetadata(meta);
  // first argument to callback is error
  callback(null, numberPlusFive(call.request), meta);
}

function streamNumbers(call, callback) {
  console.log("streamNumbers callback:", callback);
  console.log(call);
  const meta = new grpc.Metadata();
  meta.set("hello", "world2");
  call.sendMetadata(meta);
  const myInterval = setInterval(() => {
    call.write(numberPlusFive(call.request));
  }, 50);
  setTimeout(() => {
    clearInterval(myInterval);
    call.end();
  }, 500);
}

function readFile(call) {
  let filePath = path.join(__dirname + '/Bear.mp4.zip')
  // console.log(StreamZip)
  // console.log(call)

  let readFile = fs.readFileSync(filePath); // get binary data
  let goodBuffers = new Buffer.from(readFile).toString('base64'); // convert it to base64 and send it off

  console.log(goodBuffers)
  call.write({path: goodBuffers})
  call.end();


  // convert binary data to base64 encoded string

  
  // let test = fs.createReadStream(filePath, {encoding: 'base64'});

  // test.on('data', (data) => {
  //     // console.log(data) 
  //     call.write({path: data}); 
  //     test.resume();
  //   })
    
  // test.on('end', () => {
  //   call.end(); // ending the stream here
  // })
  // test.end; // only ends when all data was read


}




module.exports = {
  numberToNumber,
  streamNumbers,
  readFile
};


