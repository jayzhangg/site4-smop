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
		, 'id': $('#editor').attr('data-id')
	}).done(function (result) {
		if (typeof result === 'string' || result instanceof String) {
			$('#editorReturn').html(result);
		}
	});
}
// render the task feed
$(document).ready(function () {
	$.ajax({
		type: "GET"
		, url: "get_codertaskfeed"
		, complete: function (data) {
			var s = '';
			var m = data.responseJSON.message;
			if (typeof m != 'string') {
				for (var key in m) {
					var innerTask = m[key]['name'] + '($' + m[key]['bounty'] + '): ' + m[key]['task']['message_short'];
					if (m.hasOwnProperty(key)) {
						s += "<code class='feedtask'><a onclick='startTask(\"" + m[key]["_id"] + "\")'>" + innerTask + "</a></code>" + "<br>";
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

function startTask(id) {
	$('#editor').attr('data-id', id);
	$.get("get_singletask", {
		'data': id
	}).done(function (res) {
		var m = res.message[0];
		var s = '/* Task ' + m['name'] + ' was posted by ' + m['owner'] + ' on ' + m['date'] + '. ' + m['name'] + ' has defined the task as such:\n' + m['task']['message_long'] + '\nGood Luck.' + ' */\n' + m['task']['pet_code'];
		editor.setValue(s);
	});
}