var editor = ace.edit("editor");
editor.setTheme("./smop");
editor.getSession().setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.setFadeFoldWidgets(true);
editor.setHighlightActiveLine(true);
editor.$PersistentHScroll = Infinity;