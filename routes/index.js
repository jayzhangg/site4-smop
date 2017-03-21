var express = require('express');
var app = express();
var http = require('http');
var qs = require("querystring");
var crypto = require('crypto');
var token = '';
var name = '';
var apicall = {
	host: 'localhost:3001/'
	, port: 3001
};
var genRandomString = function (length) {
	return crypto.randomBytes(Math.ceil(length / 2)).toString('hex') /** convert to hexadecimal format */ .slice(0, length); /** return required number of characters */
};
var sha512 = function (password, salt) {
	var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt: salt
		, passwordHash: value
	};
}
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
router.get('/new_user', function (req, res) {
	res.render('new_user');
});
router.get('/options', (req, res) => {
	res.render('options');
});
router.get('/coder_home', (req, res) => {
	var options = {
		"method": "GET"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/get_info"
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
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
				console.log('request success');
				res.render('coder_home', {
					info: body.info
				});
			}
			else {
				console.log('request for info not completed');
				res.redirect('/options')
			}
		});
	});
	reqInner.end();
});
router.post('/create_user', (req, res) => {
	if (req.body.user2 != '' && req.body.pass2 != '' && req.body.passCheck != '') {
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
					console.log('worked!')
					res.redirect('/');
				}
				else {
					res.redirect('/');
				}
			});
		});
		var salt = genRandomString(16); // salt length of 16
		var data = sha512(req.body.pass, salt);
		reqInner.write(qs.stringify({
			name: req.body.user
			, password: data.passwordHash
			, salt: data.salt
			, admin: false
		}));
		reqInner.end();
	}
	else {
		console.log('if not true');
		res.redirect('/');
	}
});
//post codeCheck
router.post('/post_CodeCheck', (req, res) => {
	var options = {
		"method": "POST"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/post_CodeCheck"
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
				res.write(JSON.stringify({
					info: body.data + '//worked!'
				}));
			}
			else {
				console.log('ajs indexjs check fail');
			}
		});
	});
	reqInner.write(qs.stringify({
		code: req.body.data
	}));
	reqInner.end();
});
//login
router.post('/login', (req, res) => {
	if (req.body.user != ('' || null) && req.body.pass != ('' || null)) {
		name = req.body.user;
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
		reqInner.write(qs.stringify({
			name: req.body.user
			, password: req.body.pass
		}));
		reqInner.end();
	}
	else res.redirect('/');
});
//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
	res.status(404).send("welp, that's a 404.");
});
module.exports = router;