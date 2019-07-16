const request = require("request");
const path = require("path");
const fs = require("fs");

request("https://norvig.com/big.txt", (err, response, body) => {
  if (err) console.log(err);
  fs.writeFileSync(path.join(__dirname, "big.txt"), body);
});
