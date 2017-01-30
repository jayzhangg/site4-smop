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
	res.redirect('/options');
});
module.exports = router;