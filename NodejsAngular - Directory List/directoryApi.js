var http = require("http");
var path = require("path");
var fs = require("fs");
var mime = require("mime-types");
var spLib = require("spLib");

// Config
var port = 3000;
var host = "localhost";
const home = __dirname;
console.log(home);
// Function library
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  // No windows formatting for me :)
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  // max file size is *TB because whos gonna have a 1PB file?
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
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
    var size = formatBytes(fs.statSync("./files/" + file).size);
    var type = mime.lookup(file);
    if (type.split("/")[0] == "video") {
      var thumb = path.basename(file, path.extname(file)) + ".jpg";
      fileIndex.push({
        name: file,
        size: size,
        type: type,
        thumb: thumb,
      });
    } else {
      var thumb = "empty";
      fileIndex.push({ name: file, size: size, type: type, thumb: thumb });
    }
  }
}
// read directory and make thumbnails for videos
function getThumbs() {
  getFiles();
  for (var i = 0; i < fileList.length; i++) {
    var file = fileList[i];
    var type = mime.lookup(file);
    if (type.includes("video")) {
      var thumb = file.replace(/\.[^/.]+$/, "") + ".png";
      if (!fs.existsSync("./thumbnails/" + thumb)) {
        spLib.getThumbnailFromVideo(path.join(home, "files", file), home);
      }
    }
  }
}
getThumbs();

// Server
http
  .createServer(function (req, res) {
    if (req.url === "/files/api/index.json") {
      getFiles();
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(fileIndex));
    } else if (req.url.slice(0, 17) === "/files/api/thumb/") {
      var url = req.url.slice(17);
      if (fs.existsSync("./thumbnails/" + url) && url != "") {
        res.writeHead(200, {
          "Content-Type": "image/jpg",
        });
        res.end(fs.readFileSync("./thumbnails/" + url));
      } else {
        res.writeHead(404, {
          "Content-Type": "text/plain",
        });
        res.end("404 Not Found");
      }
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
    } else if (req.url.includes("/preview")) {
      res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      });
      res.write(fs.readFileSync("./preview.html"));
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