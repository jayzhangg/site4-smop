var editorarray = document.querySelectorAll(".editor");
var editors = [];
Array.prototype.forEach.call(editorarray, function (el) {
	var editor = ace.edit(el);
	editor.setTheme("ace/theme/dawn");
	editor.getSession().setMode("ace/mode/javascript");
	editor.setShowPrintMargin(false);
	editor.setFadeFoldWidgets(true);
	editor.setHighlightActiveLine(true);
	editor.$PersistentHScroll = Infinity;
	editor.getSession().setUseSoftTabs(true);
	editor.getSession().setUseWrapMode(true);
	editor.$blockScrolling = Infinity;
	if (el.id === 'PARTHEditor') {
		editor.getSession().setUseWorker(false);
	}
	editors.push(editor);
});
for (var editor = 0; editor < editors.length; editor++) {
	editors[editor].setValue(info);
}