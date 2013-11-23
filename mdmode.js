var textareas = document.getElementsByTagName("textarea");
for (var i = 0; i < textareas.length; i++) {
    textareas[i].onkeypress = mdmode;
}

function mdmode(evt) {
    if (this.selectionStart != this.selectionEnd) {
        console.error("selection mode is not implemented yet...");
        return true;
    }

    var cursor = this.selectionStart;
    var lineInfo = getLineInfo(this.value, cursor);
    if (lineInfo.length === 0) return true;

    var textEvent = document.createEvent("TextEvent");
    if (evt.keyCode == 9) { // TAB or C-i

        this.setSelectionRange(lineInfo.hol, lineInfo.hol);

        textEvent.initTextEvent("textInput", true, true, null, "    ");
        this.dispatchEvent(textEvent);

        this.setSelectionRange(cursor + 4, cursor + 4);
    } else if (evt.keyCode == 21) { // C-u
        var match = lineInfo.text.match(/^(    \s*[*+-] ).*$/);
        //TODO: refactor
        if (match == null) {
            var match = lineInfo.text.match(/^([*+-] ).*$/);
            this.setSelectionRange(lineInfo.hol, lineInfo.hol + 3);
            textEvent.initTextEvent("textInput", true, true, null, this.value[lineInfo.hol + 2]);
            this.dispatchEvent(textEvent);
            var newCursorAt = (cursor - 1 < lineInfo.hol) ? lineInfo.hol : cursor - 2;
            this.setSelectionRange(newCursorAt, newCursorAt);
            return false;
        }

        this.setSelectionRange(lineInfo.hol, lineInfo.hol + 5);
        textEvent.initTextEvent("textInput", true, true, null, this.value[lineInfo.hol + 4]);
        this.dispatchEvent(textEvent);
        var newCursorAt = (cursor - 4 < lineInfo.hol) ? lineInfo.hol : cursor -4;
        this.setSelectionRange(newCursorAt, newCursorAt);
    } else if (evt.keyCode == 13) { // Enter
        var match = lineInfo.text.match(/^(\s*[*+-]).*$/);
        if (match == null) return true;
        if (lineInfo.hol + match[1].length > cursor) {
            this.setSelectionRange(lineInfo.hol, lineInfo.hol);
            textEvent.initTextEvent("textInput", true, true, null, "\n");
            this.dispatchEvent(textEvent);
            this.setSelectionRange(cursor + 1, cursor + 1);
        } else {
            var insertText = match[1];
            if (lineInfo.hol + match[1].length != cursor) insertText += " ";
            textEvent.initTextEvent("textInput", true, true, null, "\n" + insertText);
            this.dispatchEvent(textEvent);
        }

        return false;
    }
}

function getLineInfo(text, cursor) {
    var re = /^.*$/gm;
    // todo: refactor
    for (var match = re.exec(text); re.lastIndex != 0; match = re.exec(text)) {
        var hol = re.lastIndex - match[0].length;
        var eol = re.lastIndex;
        if (hol <= cursor && cursor <= eol){
            return {
                hol: hol,
                eol: eol,
                text: match[0]
            };
        }
        re.lastIndex++;
    }
    return {};
}
