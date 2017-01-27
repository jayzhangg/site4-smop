var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
	/* GET home page. */
router.get('/', function (req, res) {
	res.render('index');
});
router.get('/options', (req, res) => {
	res.render('options');
});
router.get('/coder_home', (req, res) => {
	res.render('coder_home');
});
router.post('/login', (req, res) => {
	// -- the shiny new login post -- do you want bugs? because this is how you get bugs
	var db
	var usrPost = req.body;
	// ** w00t sql injection without sql like a boss <- aka, somebody please fix my life ** -- also note this is the dev mlab db, its got like a meg of storage because im cheap as ****
	var connectString = 'mongodb://' + usrPost['user'] + ':' + usrPost['pass'] + '@ds145128.mlab.com:45128/smop'
		// ** for testing connection string **
		//console.log(connectString);
		// realtalk, are we really connecting each time with this damn connect function? thats a lot to handle (geddit?)
	MongoClient.connect(connectString, (err, database) => {
		if (err) return console.log(err)
		db = database
		var d = new Date();
		// ** if you're curious what the date should look like in the database **
		//console.log(d.toTimeString() + ' ' + d.toDateString())
		usrPost["dateTime"] = d.toTimeString() + " " + d.toDateString();
		db.collection('loginreqs').save(usrPost, (err, result) => {
			// ** oh hiya giant bug i don't know how to deal with! ** -- if error->just crap out and die
			if (err) {
				return console.log(err)
				res.redirect('/')
			}
			else {
				console.log('saved to database')
				res.redirect('/options')
			}
		})
	});
});
module.exports = router;