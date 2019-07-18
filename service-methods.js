const grpc = require("grpc");
// function serverInterceptor(call, nextCall) {
//   //if conditional
//   nextCall(call)
// }

//secret

function numberPlusFive({ number }) {
  return { numbers: [number ** 5, number ** 3, number ** 65] };
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

function bidiNumbers(call) {
  call.on("data", function(data) {
    // console.log("data from client:", data);
    const { number } = data;

    call.write({ number: Math.ceil(number ** 1.01) });

    call.on("cancelled", () => {
      console.log("cancelled");
      // call.write({});
      call.end();
    });
  });
  call.on("end", function() {
    // console.log("ending");
    call.end();
  });
}

// function methodWrapper(method, interceptors) {

// }

module.exports = {
  numberToNumber,
  streamNumbers,
  bidiNumbers
};
