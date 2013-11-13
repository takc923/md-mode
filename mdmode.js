document.onreadystatechange = function () {
    console.log(document.readyState);
    if (document.readyState != "complete") return;
    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].addEventListener("keypress", mdmode);
    }
}

function mdmode(evt) {
    if (this.selectionStart != this.selectionEnd) {
        console.error("selection mode is not implemented yet...");
        return;
    }

    if (evt.keyCode == 9) {
        var cursor = this.selectionStart;
        var hol = getHeadOfLine(this.value, cursor);

        if (hol == -1) return;

        this.setSelectionRange(hol, hol);

        var textEvent = document.createEvent("TextEvent");
        textEvent.initTextEvent("textInput", true, true, null, "    ");
        this.dispatchEvent(textEvent);

        this.setSelectionRange(cursor + 4, cursor + 4);
    }
}

function getHeadOfLine(text, cursor) {
    var re = /^[ \t]*[*+-].*$/gm;
    for (var match = re.exec(text); re.lastIndex != 0; match = re.exec(text)) {
        var hol = re.lastIndex - match[0].length;
        var eol = re.lastIndex;
        if (hol <= cursor && cursor <= eol) return hol;
    }
    return -1;
}
