var express = require('express');
var app = express();
var http = require('http');
var qs = require("querystring");
var token = '';
var apicall = {
	host: 'localhost:3001/'
	, port: 3001
};
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
router.post('/createUser', (req, res) => {
	var options = {
		"method": "POST"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/newuser"
		, "headers": {
			"content-type": "application/x-www-form-urlencoded"
			, "cache-control": "no-cache"
		}
	};
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				token = body.token;
				res.redirect('/options');
			}
			else {
				res.redirect('/');
			}
		});
	});
	reqInner.write(qs.stringify({
		name: req.body.user
		, password: req.body.pass
	}));
	reqInner.end();
});
router.post('/login', (req, res) => {
	var options = {
		"method": "POST"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/authenticate"
		, "headers": {
			"content-type": "application/x-www-form-urlencoded"
			, "cache-control": "no-cache"
		}
	};
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				token = body.token;
				res.redirect('/options');
			}
			else {
				res.redirect('/');
			}
		});
	});
	console.log(req.body.user)
	reqInner.write(qs.stringify({
		name: req.body.user
		, password: req.body.pass
	}));
	reqInner.end();
});
module.exports = router;