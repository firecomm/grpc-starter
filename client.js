const grpc = require('grpc');
const routeguide = require('./routeguide');


const stub = new routeguide.RouteGuide(
    'localhost:3000', grpc.credentials.createInsecure());

console.log(stub);
// output: 
    // ServiceClient {
    //   '$interceptors': [],
    //   '$interceptor_providers': [],
    //   '$callInvocationTransformer': undefined,
    //   '$channel': Channel {} }

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


