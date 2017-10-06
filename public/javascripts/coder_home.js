/*



WHY ARE YOU DIVING SO DEEP INTO MY CODE??



*/
// submitting through frontend js, should be fine
function editorSubmit() {
	$("#editorReturn").html('saving...');
	if ($('#editor').attr('data-id')) {
		$.post('/post_EditorSave', {
			'data': editors[0].getValue()
			, 'id': $('#editor').attr('data-id')
			, 'ssn': ssn()
		}).done((res) => {
			if (res.error) throw err;
			$("#editorReturn").html('checking...');
			// post data to index then api
			$.post('/post_CodeCheck', {
				'data': editors[0].getValue()
				, 'id': $('#editor').attr('data-id')
				, 'ssn': ssn()
			}).done(function (result) {
				if (typeof result === 'string' || result instanceof String) {
					$('#editorReturn').html(result);
				}
			});
		});
	}
	else $('#editorReturn').html('nothing to save');
}
// render the task feed
$(document).ready(function () {
	$.ajax({
		beforeSend: function (xhr) {
			xhr.setRequestHeader('ssn', ssn());
		}
		, type: "GET"
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
		'ssn': ssn()
		, 'data': id
		, 'coder_owner': 'coder'
	}).done(function (res) {
		if (res.mtype == 'json') {
			var m = res.message[0];
			var d = new Date(m['updated_at']);
			d = d.toDateString();
			var s = '/* Task ' + m['name'] + ' was posted by ' + m['owner'] + ' on ' + d + '. ' + m['name'] + ' has defined the task as such:\n' + m['task']['message_long'] + '\nGood Luck.' + ' */\n' + m['task']['pet_code'];
		}
		else var s = res.message;
		editors[0].setValue(s);
	});
}