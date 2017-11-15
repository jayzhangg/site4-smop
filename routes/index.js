var express = require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
var router = express.Router();
var http = require('http');
var qs = require("querystring");
var crypto = require('crypto');
//var hostname = '18.220.173.197';
var hostname = "localhost";
//var port = '';
var port = '3001'
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
const MongoClient = require('mongodb').MongoClient;
router.get('/index', (req, res) => {
	var ssn = req.cookies.ssn;
	res.header('ssn', ssn);
	res.render('index');
});
//login
router.post('/login', (req, res) => {
	var ssn = {};
	if (req.body.user != ('' || null) && req.body.pass != ('' || null)) {
		ssn.name = req.body.user;
		var options = {
			"method": "POST"
			, "hostname": hostname
			, "port": port
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
				console.log(ssn);
				var body = JSON.parse(Buffer.concat(chunks).toString());
				if (body.success) {
					ssn.token = body.token;
					console.log('ssn:', ssn);
					res.cookie('ssn', ssn, {
						maxAge: 3600000 // 1hr
							
						, httpOnly: true
					});
					res.header('ssn', ssn);
					res.redirect('/options');
				}
				else {
					console.log(body);
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
router.post('/login_test', (req, res) => {
	if (req.body.user != ('' || null) && req.body.pass != ('' || null)) {
		var options = {
			"method": "POST"
			, "hostname": hostname
			, "port": port
			, "path": "/api/authenticate_test"
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
					res.redirect('/loginpage');
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
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/index');
	else {
		var options = {
			'method': 'GET'
			, 'hostname': hostname
			, 'port': port
			, 'path': '/api/checkToken'
			, "headers": {
				"x-access-token": ssn.token
				, "x-access-name": ssn.name
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
	}
});
router.get('/loginpage', function (req, res) {
	res.render('login');
});
router.get('/fauxlogin', (req, res) => {
	res.render('faux_login');
});
router.get('/new_user', function (req, res) {
	res.render('new_user');
});
router.get('/options', (req, res) => {
	// check if token expired
	var ssn = req.cookies.ssn;
	if (!ssn) {
		res.redirect('/');
	}
	else {
		var options = {
			'method': 'GET'
			, 'hostname': hostname
			, 'port': port
			, 'path': '/api/checkToken'
			, "headers": {
				"x-access-token": ssn.token
				, "x-access-name": ssn.name
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
	}
});
router.get('/owner_home', (req, res) => {
	// get info
	var ssn = req.cookies.ssn;
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_info"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
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
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_info"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
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
router.get('/verify_email', (req, res) => {
	var options = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/verifyUser"
		, "headers": {
			"content-type": "application/x-www-form-urlencoded"
			, "cache-control": "no-cache"
		}
	}
	var reqInner = http.request(options, (result) => {
		var chunks = [];
		result.on('data', (chunk) => {
			chunks.push(chunk);
		});
		result.on("end", () => {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				console.log('worked!');
				res.redirect('/');
			}
			else {
				res.redirect('/');
			}
		});
	});
	reqInner.write(qs.stringify({
		_id: req.query._id
	}));
	reqInner.end();
});
router.post('/create_user', (req, res) => {
	if (req.body.user2 != '' && req.body.pass2 != '' && req.body.passCheck != '') {
		var options = {
			"method": "POST"
			, "hostname": hostname
			, "port": port
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
			, email: req.body.email
			, admin: true
		}));
		reqInner.end();
	}
	else {
		console.log('if not true');
		res.redirect('/');
	}
});
router.post('/create_user_test', (req, res) => {
	if (true) {
		var options = {
			"method": "POST"
			, "hostname": hostname
			, "port": port
			, "path": "/newuser_test"
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
					res.json({
						success: true
					});
				}
				else {
					res.json({
						success: false
					});
				}
			});
		});
		var salt = genRandomString(16); // salt length of 16
		var data = sha512(req.body.pass, salt);
		reqInner.write(qs.stringify({
			name: req.body.user
			, password: data.passwordHash
			, salt: data.salt
		}));
		reqInner.end();
	}
	else {
		console.log('if not true');
		res.redirect('/');
	}
});
// post editor save
router.post('/post_EditorSave', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/api/post_ResponseSave"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "content-type": "application/x-www-form-urlencoded"
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
				console.log('done');
				res.json({
					success: true
				});
			}
			else {
				console.log('done');
				res.json({
					success: false
					, error: body
				});
			}
		});
	});
	reqInner.write(qs.stringify({
		data: req.body.data
		, id: req.body.id
	}));
	reqInner.end();
});
// post codeCheck
router.post('/post_CodeCheck', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		'method': 'GET'
		, 'hostname': hostname
		, 'port': port
		, 'path': '/api/checkToken'
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "cache-control": "no-cache"
		}
	}
	var reqInner = http.request(options, function (result) {
		//checks if the key expired
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				reqInner.end();
				// actual codeCheck
				var options2 = {
					"method": "POST"
					, "hostname": hostname
					, "port": port
					, "path": "/api/post_codeCheck"
					, 'headers': {
						"x-access-token": ssn.token
						, "x-access-name": ssn.name
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
						if (body.pySuccess == 'true') {
							res.end('python parse returned no error');
						}
						else {
							res.end('python parse returned an error, error: ' + body.data);
						}
					});
				});
				reqInner2.write(qs.stringify({
					code: req.body.data
					, id: req.body.id
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
// get task feeds
router.get('/get_codertaskfeed', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_feed"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "cache-control": "no-cache"
			, "coder_owner": "coder"
			, "lang": 'js'
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
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_feed"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
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
// Owner Create Task
router.post('/create_task', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/api/post_newtask"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "content-type": "application/x-www-form-urlencoded"
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
				res.json({
					success: true
				});
			}
			else {
				res.json({
					success: false
					, error: body
				});
			}
		});
	});
	reqInner.write(qs.stringify({
		name: req.body.name
		, lang: req.body.lang
		, task_message_short: req.body.task_message_short
		, task_message_long: req.body.task_message_long
		, task_pet_code: req.body.task_pet_code
		, task_unit_tests: req.body.task_unit_tests
		, bounty: req.body.bounty
	}));
	reqInner.end();
});
// Get Single Task
router.get('/get_singletask', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_singletask"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "cache-control": "no-cache"
			, "id": req.query.data
			, "coder_owner": req.query.coder_owner
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
					, mtype: body.mtype
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
// Get Task Status
router.get('/get_taskStatus', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_taskStatus"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "cache-control": "no-cache"
			, "id": req.query.data
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
				console.log('Error getting statuses')
				console.log(body.message);
				res.json({
					message: 'fail'
				});
			}
		});
	});
	reqInner.end();
});
// Post Update Task
router.post('/update_task', (req, res) => {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/api/post_updatetask"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "content-type": "application/x-www-form-urlencoded"
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
				res.json({
					success: true
				});
			}
			else {
				res.json({
					success: false
					, error: body
				});
			}
		});
	});
	reqInner.write(qs.stringify({
		id: req.body.id
		, name: req.body.name
		, lang: req.body.lang
		, task_message_short: req.body.task_message_short
		, task_message_long: req.body.task_message_long
		, task_pet_code: req.body.task_pet_code
		, task_unit_tests: req.body.task_unit_tests
		, bounty: req.body.bounty
	}));
	reqInner.end();
});
// The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
	res.status(404).send("welp, that's a 404.");
});
module.exports = router;