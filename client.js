const grpc = require("grpc");
const routeguide = require("./routeguide");

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

const ourNumber = {
  number: 5
};

// stub.numberToNumber(ourNumber, function(err, number) {
//   if (err) console.log(err);
//   // console.log(number, 'in client js');
// });

// stub.readFile();
const test = stub.readFile();
// console.log(test)

let allBuffers= [];
test.on('data', (result) => {
  ({path} = result);
  test.write({path: 'OK'}, () => {
    console.log('OK wwas sent')
  })
  // console.log( result )
  allBuffers.push(path);
  console.log(allBuffers.join())

});

// let listener = new ListenerBuilder();
// console.log(listener)


