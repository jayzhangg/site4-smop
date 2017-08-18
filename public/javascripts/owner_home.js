function submitForm() {
	var id = $('#formHeader').attr('data-id');
	if (id != undefined) {
		$.post('update_task', {
			'id': id
			, 'name': $('#name').val()
			, 'lang': $('#lang').val()
			, 'task_message_short': $('#task_message_short').val()
			, 'task_message_long': $('#task_message_long').val()
			, 'bounty': $('#bounty').val()
			, 'task_pet_code': editors[0].getValue()
			, 'task_unit_tests': editors[1].getValue()
		}).done(() => {
			location.reload();
		});
	}
	else {
		console.log('undefined');
		$.post('create_task', {
			'name': $('#name').val()
			, 'lang': $('#lang').val()
			, 'task_message_short': $('#task_message_short').val()
			, 'task_message_long': $('#task_message_long').val()
			, 'bounty': $('#bounty').val()
			, 'task_pet_code': editors[0].getValue()
			, 'task_unit_tests': editors[1].getValue()
		}).done(() => {
			location.reload();
		});
	}
}

function editTask(id) {
	$('#formHeader').attr('data-id', id);
	$.get("get_singletask", {
		'data': id
		, 'coder_owner': 'owner'
	}).done(function (res) {
		var m = res.message[0];
		if (res.mtype == 'json') { //mtype
			$('#name').val(m['name']);
			$('#lang').val(m['lang']);
			$('#task_message_short').val(m['task']['message_short']);
			$('#task_message_long').val(m['task']['message_long']);
			$('#bounty').val(m['bounty']);
			editors[0].setValue(m['task']['pet_code']);
			editors[1].setValue(m['task']['unit_tests']);
		}
	});
}
// check task status
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