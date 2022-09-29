
// Each template will be held in a function, some or most of these will not feasibly work as a function
function httpGet(url) {
   $http.get(url).then(function (response) {
     // use the data from the response to do whatever you want
      response.data;
   });
}
