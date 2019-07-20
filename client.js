const grpc = require("grpc");
const routeguide = require("./routeguide");
const fs = require('fs')

const stub = new routeguide.RouteGuide(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

// console.log(Object.keys(stub.__proto__.numberToNumber));
const interceptorProvider = function(options, nextCall) {
  // console.log("options:", options);
  var requester = {
    start: function(metadata, listener, next) {
      console.log("metadata start", metadata);
      var newListener = {
        onReceiveMetadata: function(metadata, next) {
          console.log("metadata on Receive meta", metadata);
          next(metadata);
        },
        onReceiveMessage: function(message, next) {
          // console.log("metadata on Receive message", metadata);
          next(message);
        },
        onReceiveStatus: function(status, next) {
          // console.log("metadata on receive status", metadata);
          next(status);
        }
      };
      next(metadata, newListener);
    },
    sendMessage: function(message, next) {
      // console.log("sendmessage", message);
      next(message);
    },
    halfClose: function(next) {
      // console.log("halfclose");
      next();
    },
    cancel: function(message, next) {
      // console.log("cancel", message);
      next();
    }
  };
  return new grpc.InterceptingCall(nextCall(options), requester);
};

// console.log(grpc);
// const provider = grpc.InterceptorProvider(stub.numberToNumber.path);
// console.log(provider)

// console.log('path', stub.numberToNumber.path)

// stub.numberToNumber.interceptors.push(interceptor);

const ourNumber = {
  number: 3
};

// stub.numberToNumber(
//   ourNumber,
//   { interceptors: [interceptorProvider] },
//   function(err, number) {
//     if (err) console.log(err);
//     console.log(number);
//   }
// );

// SERVER STREAMING
const meta = new grpc.Metadata();
meta.set("hello", "world");

const numberStream = stub.streamNumbers(ourNumber, meta, {
  interceptors: [interceptorProvider]
});

// console.log("stub", stub.__proto__);

numberStream.on("data", data => {
  console.log("data: ", data);
});

numberStream.on("end", () => {
  console.log("end:");
});

numberStream.on("error", e => {
  console.log("error: ", e);
});

numberStream.on("status", status => {
  console.log("status:", status);
});

/////////////////////////////////////////////////////////
////////////////    DIMAS CODE BELOW  //////////////////
////////////////////////////////////////////////////////
// stub.readFile();
const test = stub.readFile();
// console.log(test)

let allBuffers = [];

test.on('data', (result) => {
  ({path} = result);
  console.log('in here')

  test.write({path: 'OK'}, () => {
    console.log('OK wwas sent')
  })

  // console.log( result )
  allBuffers.push(path);
  // console.log(allBuffers.join())

});

test.on('end', () => {
  let tester = allBuffers.join();
  console.log(tester, 'wt')

  // tester is base64, so we create new buffer and tell it that it is encoded in base64, and we get binary data back
  let goodBuffers = new Buffer.from(tester, 'base64');
  // now we re-build any file from binary data 
  fs.writeFileSync('./copyFile.zip', goodBuffers);
  console.log('******** File created from base64 encoded string ********');
})