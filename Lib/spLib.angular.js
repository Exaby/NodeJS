function mimeLookup(input) {
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://cdn.jsdelivr.net/gh/jshttp/mime-db@master/src/nginx-types.json",
    false
  );
  request.send(null);
  var json = JSON.parse(request.responseText);
  var ext = input.split(".").pop();
  for (var key in json) {
    if (json[key].extensions.includes(ext)) {
      return key;
    }
  } // if no match is found, return false
  return "unknown";
}
