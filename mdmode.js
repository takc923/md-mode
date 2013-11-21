onload(function () {
    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].onkeypress = mdmode;
    }
});

function mdmode(evt) {
    if (this.selectionStart != this.selectionEnd) {
        console.error("selection mode is not implemented yet...");
        return true;
    }

    var cursor = this.selectionStart;
    var lineInfo = getLineInfo(this.value, cursor);
    var textEvent = document.createEvent("TextEvent");
    if (evt.keyCode == 9) { // TAB or C-i
        if (lineInfo.length === 0) return true;

        this.setSelectionRange(lineInfo.hol, lineInfo.hol);

        textEvent.initTextEvent("textInput", true, true, null, "    ");
        this.dispatchEvent(textEvent);

        this.setSelectionRange(cursor + 4, cursor + 4);
    } else if (evt.keyCode == 13) { // Enter
        if (lineInfo.length === 0) return true;
        var match = lineInfo.text.match(/^(\s*[*+-] ).*$/);
        if (match == null) return true;

        textEvent.initTextEvent("textInput", true, true, null, "\n" + match[1]);
        this.dispatchEvent(textEvent);
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

function onload(callback) {
    var id = setInterval(function() {
        if (document.readyState == "complete" // load
           || document.readyState == "interactive") { // DOMContentLoaded
            callback();
            clearInterval(id);
        }
    }, 500);
}
