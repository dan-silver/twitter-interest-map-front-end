var  db = require('../db')

exports.index = function(req, res) {
	 db.interest.find(function (err, interests) {
    res.render('index', { title: 'Testing out Geomaps', interests: interests});
  });
};