
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , db = require('./db')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
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

var countryPercentages = {}
db.relativePopulation.find(function(err, relativePopulation) {
  relativePopulation.forEach(function(country) {
    countryPercentages[country.location] = country.percentage
  })
})

//ex http://localhost:3000/510c2bd798df0ab8870010c9/state/US
app.get('/:interest_id/:type/:location_parent', function(req, res) {
  db.interest_locations.find({interest: req.params.interest_id, type: req.params.type, location_parent: req.params.location_parent}, 'location count', function (err, data) {
		var returnData = {
			cols:[{id:req.params.type,label:req.params.type,type:"string"},
					  {id:"count",label:"User Count",type:"number"}
					 ],
			 rows:[]
		};
		for (var key in data) {
			var obj = data[key];
			returnData.rows.push({c:[{v:obj.location},{v:obj.count}]});
		}
		res.json(returnData);
	});
});
app.get('/explore', routes.explore);
app.get('/:interest_name/map', routes.map);
app.get('/country/:interest_id', function(req, res) {
	db.interest_locations.find({interest: req.params.interest_id, type: 'country'}, 'location location_short count', function (err, data) {
    var total=0
    data.forEach(function(country) {
      total += country.count
   //   console.log(total)
    })
		var returnData = {
			cols:[{id:"country",label:"Country",type:"string"},
					  {id:"count",label:"Interest Level",type:"number"}
					 ],
			 rows:[]
		};
//      console.log(countryPercentages['US'])
		for (var key in data) {
			var obj = data[key]
			returnData.rows.push({c:[{v:obj.location},{v:(obj.count/total)/countryPercentages[obj.location_short]}]});
		}
		res.json(returnData);
	});
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
