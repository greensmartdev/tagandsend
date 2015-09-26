// Parse Cloud Code Webhooks example for Express JS on Heroku

var express = require('express');
var app = express();
//app.use(express.bodyParser());

var bodyParser = require('body-parser');

// Require Node Modules
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    //ParseCloud = require('parse-cloud-express'),
    //Parse = ParseCloud.Parse;
    Parse = require('parse').Parse;

// Make sure to set your Webhook key via heroku config set
var webhookKey = process.env.WEBHOOK_KEY;
console.log("process env url is " + process.env.URL);
console.log("Webhook key is " + webhookKey);
// Express middleware to enforce security using the Webhook Key
function validateWebhookRequest(req, res, next) {
  if (req.get('X-Parse-Webhook-Key') !== webhookKey) return errorResponse(res, 'nnnnng!');
  next();
}


// Parse middleware to inflate a beforeSave object to a Parse.Object
function inflateParseObject(req, res, next) {
  var object = req.body.object;
  var className = object.className;
  console.log("className is "+className);
  var parseObject = new Parse.Object(className);
  parseObject._finishFetch(object);
  req.body.object = parseObject;
  next();
}

function successResponse(res, data) {
  data = data || true;
  res.status(200).send({ "success" : data });
}

function errorResponse(res, message) {
  message = message || true;
  res.status(200).send({ "error" : message });
}

var jsonParser = bodyParser.json();

app.use(validateWebhookRequest);
app.use(jsonParser);
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


/*
 * Define routes here
 */


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.post('/success', inflateParseObject, function(req, res) {
  var requestData = req.body;
  //requestData.object.set('extra', 'fizzbuzz');
  successResponse(res, requestData.object);
});

app.post('/error', function(req, res) {
  errorResponse(res, "No thanks.");
});

app.post('/hello', function(req, res) {
  successResponse(res, "Hello!");
});

app.post('/addNumbers', function(req, res) {
  var params = req.body.params;
  successResponse(res, params.a + params.b);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end('{"error":"Request Failed."}');
});

/*
 * Launch the HTTPS server
 */
var port = process.env.PORT || 443;
var server = http.createServer(app);
server.listen(port, function() {
  console.log('Cloud Code Webhooks server running on port ' + port + '.');
});

