var editor_rules = require("editor_rules")
var line = '<div class="Basic-Text-Frame">';
var lineList = $.extend({}, line.split(" "));
if (lineList[0].includes("<")) {
	console.log(lineList[0]);
	lineList[0]['type'] = "opened";
	console.log(lineList[0]);
}
else {
	console.log('oops');
}
