const grpc = require("grpc");
const fs = require("fs");
const path = require("path");
// function serverInterceptor(call, nextCall) {
//   //if conditional
//   nextCall(call)
// }

//secret

function numberPlusFive({ number }) {
  return { number: number + 5 };
}

function streamVideo(call) {
  console.log("call", call);
  const stream = fs.createReadStream(path.join(__dirname, "./lumish.mp4"));
  stream.on("data", chunk => {
    console.log(chunk);
    call.write(chunk);
  });
  stream.on("end", () => {
    call.end();
  });
}

// console.log(streamVideo());

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

function streamNumbers(call) {
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

// function methodWrapper(method, interceptors) {

// }

module.exports = {
  numberToNumber,
  streamNumbers,
  streamVideo
};
