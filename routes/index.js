var express = require('express');
var app = express();
app.use(express.static('public'))
var router = express.Router();
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
module.exports = router;