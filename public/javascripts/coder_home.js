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
		}).done((res) => {
			if (res.error) throw err;
			$("#editorReturn").html('checking...');
			// post data to index then api
			$.post('/post_CodeCheck', {
				'data': editors[0].getValue()
				, 'id': $('#editor').attr('data-id')
			}).done(function (result) {
				if (typeof result === 'string' || result instanceof String) {
					$('#editorReturn').html(result);
				}
			});
		});
	}
	else $('#editorReturn').html('nothing to save');
}

function checkStatus(id, key, innerTask, callback) {
	$.get('get_taskStatus', {
		'data': id
	}).done((res) => {
		switch (res.message) {
		case 'fail':
			callback(['remove', 'feedmessage'], key, innerTask);
			break;
		case 'done':
			callback(['ok', 'ownercolor'], key, innerTask);
			break;
		case 'in progress':
			callback(['time', 'codercolor'], key, innerTask);
			break;
		case 'not started':
			callback(['minus', 'notStarted'], key, innerTask);
			break;
		}
	});
}

// render the task feed
$(document).ready(function () {
	$.ajax({
		type: "GET"
		, url: "get_codertaskfeed"
		, complete: function (data) {
			var m = data.responseJSON.message;
			if (typeof m != 'string') {
				for (var key in m) {
					var innerTask = m[key]['name'] + '($' + m[key]['bounty'] + '): ' + m[key]['task']['message_short'];
					checkStatus(m[key]['_id'], key, innerTask, (status, key, innerTask) => {
						if (m.hasOwnProperty(key)) {
							$('#feed').append("<span class='glyphicon glyphicon-" + status[0] + " " + status[1] + " statusSymbol' aria-hidden='true'></span><code class='feedtask'><a onclick='editTask(\"" + m[key]["_id"] + "\")'>" + innerTask + "</a></code>" + "<br><p class='taskDivider'>---</p>")
						}
					});
				}
			}
			else {
				$('#feed').append("<div class='feedmessage'>" + m + "</div>")
			}
		}
	});
});

// function startTask(id) {
// 	$('#editor').attr('data-id', id);
// 	$.get("get_singletask", {, 'data': id, 'coder_owner': 'coder'
// 	}).done(function (res) {
// 		if (res.mtype == 'json') {
// 			var m = res.message[0];
// 			var d = new Date(m['updated_at']);
// 			d = d.toDateString();
// 			var s = '/* Task ' + m['name'] + ' was posted by ' + m['owner'] + ' on ' + d + '. ' + m['name'] + ' has defined the task as such:\n' + m['task']['message_long'] + '\nGood Luck.' + ' */\n' + m['task']['pet_code'];
// 		}
// 		else var s = res.message;
// 		editors[0].setValue(s);
// 	});
// }
