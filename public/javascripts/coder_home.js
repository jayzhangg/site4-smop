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
		data: eval
	}, function (result) {
		console.log(result)
		$('#editorReturn').html(result.info);
	});
}