var http = require("http");
var fs = require("fs");
var mime = require("mime-types");
// Config
var port = 3000;
var host = "localhost";

// read directory
var fileList = [];
var fileIndex = [];
function getFiles() {
  var dir = fs.readdirSync("./files");
  fileList = [];
  fileIndex = [];
  for (var i = 0; i < dir.length; i++) {
    fileList.push(dir[i]);
  }
  // incude names a file types
  for (var i = 0; i < fileList.length; i++) {
    var file = fileList[i];
    var size = fs.statSync("./files/" + file).size;
    var type = mime.lookup(file);
    fileIndex.push({ name: file, size: size, type: type });
  }
}
http
  .createServer(function (req, res) {
    if (req.url === "/files/api/index.json") {
      getFiles();
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(fileIndex));
    } else if (req.url.slice(0, 10) === "/files/get") {
      var file = req.url.slice(11);
      // file exists
      if (fileList.indexOf(file) > -1) {
        res.writeHead(200, {
          "Content-Type": mime.lookup(file),
          "Access-Control-Allow-Origin": "*",
        });
        res.end(fs.readFileSync("./files/" + file));
      } else {
        res.writeHead(404, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        });
        res.end("File not found");
      }
    } else if (req.url === "/") {
      res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      });
      res.write(fs.readFileSync("./index.html"));
      res.end();
    } else {
      res.writeHead(404, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      });
      res.end("404 not found");
    }
  })
  .listen(port);
console.log("Server running at http://" + host + ":" + port + "/");
