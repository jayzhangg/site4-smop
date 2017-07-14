/*



WHY ARE YOU DIVING SO DEEP INTO MY CODE??



*/
// Input the data from the database to the ace.js editor and hide readable text
(function () {
	$("#editor").html(info);
})();
// submitting through frontend js, should be fine
function editorSubmit() {
	$("#editorReturn").html('checking...');
	var eval = editor.getValue();
	// post data to index then api
	$.post('/post_CodeCheck', {
		'data': eval
	}).done(function (result) {
		if (typeof result === 'string' || result instanceof String) {
			$('#editorReturn').html(result);
		}
	});
}
// render the task feed
$(document).ready(function () {
	$.ajax({
		url: "get_codertaskfeed"
		, complete: function (data) {
			var s = '';
			var m = data.responseJSON.message;
			console.log('message type:' + typeof m);
			if (typeof m != 'string') {
				for (var key in m) {
					if (m.hasOwnProperty(key)) {
						s += "<div class='feedtask'>" + JSON.stringify(m[key]) + "</div>";
					}
				}
			}
			else {
				s += "<div class='feedmessage'>" + m + "</div>";
			}
			$('#feed').html(s);
		}
	});
});