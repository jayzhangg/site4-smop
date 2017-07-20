var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.getSession().setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.setFadeFoldWidgets(true);
editor.setHighlightActiveLine(true);
editor.$PersistentHScroll = Infinity;
editor.getSession().setUseSoftTabs(true);
editor.getSession().setUseWrapMode(true);