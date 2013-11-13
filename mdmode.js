document.onreadystatechange = function () {
    if (document.readyState != "complete") return;
    console.log("loaded");
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
        var textArr = this.value.split("\n");
        var lineIndex = getLineIndex(textArr, cursor);
        var re = /^(\s*[*+-])/;
        if (textArr[lineIndex].search(re) == -1) return;
        textArr[lineIndex] = textArr[lineIndex].replace(re, "    $1");
        this.value = textArr.join("\n");
        this.setSelectionRange(cursor + 4, cursor + 4);
    }
}

function getLineIndex(textArr, cursor) {
    var counter = 0;
    for (var i = 0; i < textArr.length; i++) {
        counter += textArr[i].length + 1; // 1 is linefeed
        if (cursor < counter) return i;
    }
    return -1;
}
