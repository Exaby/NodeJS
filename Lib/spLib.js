// Language: javascript - nodejs framework
// Path: .\spLib.js
// index = { toBinary, toDecimal, readDirJson, readJson, httpGet, httpPost }
// every section is defined by a comment with the same name

// Binary Numbers
function toBinary(num) {
    var binary = "";
    while (num > 0) {
      binary = (num % 2) + binary;
      num = Math.floor(num / 2);
    }
    return binary;
  }
  
  function toDecimal(binary) {
    var decimal = 0;
    var power = 0;
    for (var i = binary.length - 1; i >= 0; i--) {
      decimal += binary[i] * Math.pow(2, power);
      power++;
    }
    return decimal;
  }
  
  module.exports = { toBinary: toBinary, toDecimal: toDecimal };
  // reading directorys
  
  function readDirJson(dir) {
    var fs = require("fs");
    var files = fs.readdirSync(dir);
    var json = {};
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var path = dir + "/" + file;
      var stats = fs.statSync(path);
      if (stats.isDirectory()) {
        json[file] = readDirJson(path);
      } else {
        json[file] = fs.readFileSync(path, "utf8");
      }
    }
    return json;
  }
  
  function readJson(path) {
    var fs = require("fs");
    if (fs.existsSync(path) && path.endsWith(".json")) {
      var json = fs.readFileSync(path, "utf8");
      return JSON.parse(json);
    } else {
      return {};
    }
  }
  
  module.exports = { readDirJson: readDirJson, readJson: readJson };
  // http
  
  function httpGet(url, callback) {
    var http = require("http");
    http
      .get(url, function (res) {
        var data = "";
        res.on("data", function (chunk) {
          data += chunk;
        });
        res.on("end", function () {
          callback(data);
        });
      })
      .on("error", function (err) {
        console.log("Error: " + err.message);
      });
  }
  
  function httpPost(url, data, callback) {
    var http = require("http");
    var options = {
      host: url,
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    var req = http.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        callback(chunk);
      });
    });
    req.write(data);
    req.end();
  }
  
  module.exports = { httpGet: httpGet, httpPost: httpPost };
 
