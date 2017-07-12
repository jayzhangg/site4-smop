var express = require('express');
const bodyParser = require('body-parser');
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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
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
/* GET home page. */
router.get('/', function (req, res) {
	// check if token expired
	var options = {
		'method': 'GET'
		, 'hostname': 'localhost'
		, 'port': '3001'
		, 'path': '/api/checkToken'
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
		}
	}
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				res.redirect('options');
			}
			else {
				res.render('index');
			}
		});
	});
	reqInner.end();
});
router.get('/new_user', function (req, res) {
	res.render('new_user');
});
router.get('/options', (req, res) => {
	// check if token expired
	var options = {
		'method': 'GET'
		, 'hostname': 'localhost'
		, 'port': '3001'
		, 'path': '/api/checkToken'
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
		}
	}
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				res.render('options');
			}
			else {
				res.redirect('/');
			}
		});
	});
	reqInner.end();
});
router.get('/owner_home', (req, res) => {
	// get info
	var options = {
		"method": "GET"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/get_info"
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
			, "coder_owner": "owner"
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
				res.render('owner_home', {
					info: body.info
				});
			}
			else {
				console.log(body.message);
				res.redirect('/')
			}
		});
	});
	reqInner.end();
});
router.get('/coder_home', (req, res) => {
	// get info
	var options = {
		"method": "GET"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/get_info"
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
			, "coder_owner": "coder"
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
				res.render('coder_home', {
					info: body.info
				});
			}
			else {
				console.log(body.message);
				res.redirect('/')
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
		'method': 'GET'
		, 'hostname': 'localhost'
		, 'port': '3001'
		, 'path': '/api/checkToken'
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
		}
	}
	var reqInner = http.request(options, function (result) {
		//checks if the key expired
		var chunks = [];
		result.on("data", function (chunk) {
			console.log(chunk.toString());
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				reqInner.end();
				// actual codeCheck
				var options2 = {
					"method": "POST"
					, "hostname": "localhost"
					, "port": "3001"
					, "path": "/api/post_codeCheck"
					, 'headers': {
						"x-access-token": token
						, "content-type": "application/x-www-form-urlencoded"
					}
				};
				var reqInner2 = http.request(options2, function (result) {
					var chunks = [];
					result.on("data", function (chunk) {
						chunks.push(chunk);
					});
					result.on("end", function () {
						var body = JSON.parse(Buffer.concat(chunks).toString());
						if (body.pySuccess) {
							res.end('python parse returned no error');
						}
						else {
							res.end('python parse returned an error, body: ' + JSON.stringify(body));
						}
					});
				});
				reqInner2.write(qs.stringify({
					code: req.body.data
				}));
				reqInner2.end();
			}
			else {
				res.redirect('/');
			}
		});
	});
	reqInner.end();
});
router.get('/get_codertaskfeed', (req, res) => {
	var options = {
		"method": "GET"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/get_feed"
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
			, "coder_owner": "coder"
		}
	}
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success == true) {
				res.json({
					message: body.result
				});
			}
			else {
				console.log(body.message);
				res.redirect('/')
			}
		});
	});
	reqInner.end();
});
router.get('/get_ownertaskfeed', (req, res) => {
	var options = {
		"method": "GET"
		, "hostname": "localhost"
		, "port": "3001"
		, "path": "/api/get_feed"
		, "headers": {
			"x-access-token": token
			, "x-access-name": name
			, "cache-control": "no-cache"
			, "coder_owner": "owner"
		}
	}
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success == true) {
				res.json({
					message: body.result
				});
			}
			else {
				console.log(body.message);
				res.redirect('/')
			}
		});
	});
	reqInner.end();
});
//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
	res.status(404).send("welp, that's a 404.");
});
module.exports = router;