
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , db = require('./db')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


//ex http://localhost:3000/510c2bd798df0ab8870010c9/state/United%20States
app.get('/:interest_id/:type/:location_parent', function(req, res) {
	var options = {type: req.params.type,interest: req.params.interest_id};
	if (req.params.location_parent) {
		options.location_parent = req.params.location_parent;
	}
	db.interest_locations.find(options, 'location count', function (err, data) {
		res.json(data);
	});
});
app.get('/:interest_id/countries', function(req, res) {
	db.interest_locations.find({interest: req.params.interest_id, type: 'country'}, 'location count', function (err, data) {
		res.json(data);
	});
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
