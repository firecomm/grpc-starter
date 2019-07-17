/////////////////////////////////////////////////////////////////////////////////////
//////////      seems like the developer would start here                 ///////////
/////////////////////////////////////////////////////////////////////////////////////

const path = require('path');
var PROTO_PATH = path.join(__dirname, './proto.proto');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// The protoDescriptor object has the full package hierarchy
var routeguide = protoDescriptor.routeguide;
// console.log(routeguide);

// console.log(routeguide);
module.exports = routeguide
    // console.log(grpc)
