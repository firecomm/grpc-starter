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
  let filePath = path.join(__dirname + '/Bear.mp4')
  // console.log(call)
  // let readFile = fs.readFileSync(filePath);
  
  let test = fs.createReadStream(filePath, {
    flags: 'r',
    // encoding: 'utf-8',
    fd: null,
    bufferSize: 1
  });

  test.on('data', (data) => {
      console.log(data) 
      call.write({path: data}); 
      test.resume();
    })
    
  test.on('end', () => {
    call.end(); // ending the stream here
  })
  test.end; // only ends when all data was read

  // console.log(readFile) // sends buffer data
  // console.log(readFile.toString())
  // call.write( readFile.toString() )
  // call.write({path: readFile})
  // call.end();

  // fs.readFile(filePath, (err, result) => {
  //   if(err) console.log(err);
  //   // result = result.toString()
  //   // console.log(result)
  //   console.log(call.getPeer(), ' <---- Get peer')
  //   // console.log(call) // serverduplexstream
  //   call.write({path: result}, () => {
  //     console.log('OK')
  //   })
    
  //   call.end()
  // });  


  // return filePath
}

module.exports = {numberToNumber, readFile} 