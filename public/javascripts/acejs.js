var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.getSession().setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.setFadeFoldWidgets(true);
editor.setHighlightActiveLine(true);
editor.$PersistentHScroll = Infinity;

function editorSubmit() {
	$('#editorReturn').html('checking...');
	var eval = editor.getValue();
	console.log('eval: ' + eval);
	$.post('/get_info', eval, function (result) {
		$('#editorReturn').html(result);
	});
	console.log(eval);
}