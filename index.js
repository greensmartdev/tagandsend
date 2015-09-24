var express = require('express');
var app = express();
//app.use(express.bodyParser());

var bodyParser = require('body-parser');

app.use(bodyParser.json());                        

    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//var canvas = require('canvas');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));



//app.post('webhook/url', function (request, response) {
//  console.log(request.body); // body contains the JSON data
  
  // do some stuff with the data
  
//  response.send(204);
//});


});


