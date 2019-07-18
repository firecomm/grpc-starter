const routeguide = require('./routeguide');
const grpc = require('grpc');

// created methods at service-methods
const {numberToNumber, readFile} = require('./service-methods'); // if you remove brackets you will get error

function getServer() {
  var server = new grpc.Server();
  
  server.addService(routeguide.RouteGuide.service, {
    numberToNumber: numberToNumber,
    readFile, readFile
  });
    // routeguide.RouteGuide === 
        // { RouteGuide:
        //   { [Function: ServiceClient]
        //     super_: [Function: Client],
        //     service: { NumberToNumber: [Object] } },
  return server;
};

var routeServer = getServer();
routeServer.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure());
routeServer.start();