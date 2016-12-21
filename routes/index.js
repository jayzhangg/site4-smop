var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
	res.render('index');
});
router.get('/optionPage1', (req, res) => {
	res.render('optionPage1');
});
module.exports = router;