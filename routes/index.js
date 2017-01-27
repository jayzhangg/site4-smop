var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
var db
MongoClient.connect('mongodb://<alexshukhman>:<smop1>@ds145128.mlab.com:45128/smop', (err, database) => {
	if (err) return console.log(err)
	db = database
});
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
	db.collection('loginreqs').save(req.body, (err, result) => {
		app.post('/quotes', (req, res) => {
			db.collection('quotes').save(req.body, (err, result) => {
				if (err) return console.log(err)
				console.log('saved to database')
				res.redirect('/')
			})
		})
	});
	if (err) return console.log(err);
	console.log('saved to database');
	res.redirect('/options');
});
module.exports = router;