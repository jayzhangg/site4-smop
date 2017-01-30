var express = require('express');
var app = express();
var http = require('http');
var qs = require("querystring")
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
router.post('/login', (req, res) => {
	var options = {
		"method": "POST"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/authenticate"
		, "headers": {
			"content-type": "application/x-www-form-urlencoded"
			, "cache-control": "no-cache"
			, "postman-token": "d6e25f06-55a2-0e52-dba9-f3c94373705b"
		}
	};
	var req = http.request(options, function (result) {
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
	req.write(qs.stringify({
		name: 'alexshukhman'
		, password: 'smop1'
	}));
	req.end();
});
module.exports = router;