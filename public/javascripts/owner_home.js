// Input the data from the database to the ace.js editor and hide readable text
(function () {
	$("#editor").html(info);
})();
// submitting through frontend js, should be fine
function editorSubmit() {
	$("#editorReturn").html('checking...');
	var eval = editor.getValue();
	console.log(eval);
	// post data to index then api
	$.post('/post_CodeCheck', {
		'data': eval
	}).done(function (result) {
		console.log("result = " + result);
		if (typeof result === 'string' || result instanceof String) {
			$('#editorReturn').html(result);
		}
	});
}
// render the task feed
$(document).ready(function () {
	$.ajax({
		url: "get_ownertaskfeed"
		, complete: function (data) {
			$('#feed').html(data.responseJSON.message);
		}
	});
});