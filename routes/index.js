var  db = require('../db')
var interests = [];
db.interest.find(function (err, results) {
  interests = results
});
exports.index = function(req, res) {
  res.render('index', { title: 'Testing out Geomaps', interests: interests});
};
exports.explore = function(req, res) {
  res.render('explore', { interests: interests});
};
exports.map = function(req, res) {
	 db.interest.find({name: req.params.interest_name}, function (err, interest) {
    res.render('map', { title: 'Testing out Geomaps', currentInterest: interest[0], interests: interests});
  });
};