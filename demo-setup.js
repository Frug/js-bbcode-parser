(function() {

	var domIDs = {
			mainInput: 'mainInput',
			parseButton: 'parseButton',
			mainOutput: 'mainOutput',
			bbcodeBold: 'bbcodeBold',
			bbcodeItalic: 'bbcodeItalic',
			bbcodeURL: 'bbcodeURL'
		},
		domElements = {};
	
	function addEvent(elem, type, eventHandle) {
		if (!elem)
			return;
		if ( elem.addEventListener ) {
			elem.addEventListener( type, eventHandle, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( "on" + type, eventHandle );
		} else {
			elem["on"+type]=eventHandle;
		}
	}
	
	function insertAtCursor(myField, myValueBefore, myValueAfter) {
		var startPos, endPos;
		if (document.selection) {
			myField.focus();
			document.selection.createRange().text = myValueBefore + document.selection.createRange().text + myValueAfter;
		} else if (myField.selectionStart || myField.selectionStart == '0') {
			startPos = myField.selectionStart;
			endPos = myField.selectionEnd;
			myField.value = myField.value.substring(0, startPos)+ myValueBefore+ myField.value.substring(startPos, endPos)+ myValueAfter+ myField.value.substring(endPos, myField.value.length);
		}
	}
	
	function doParse() {
		domElements['mainOutput'].innerHTML = BBCodeParser.process(domElements['mainInput'].value);
	}

	for(var key in domIDs) {
		domElements[key] = document.getElementById(domIDs[key]);
	}
	
	addEvent(domElements['parseButton'], 'click', doParse);
	
	addEvent(domElements['bbcodeBold'], 'click', function() { insertAtCursor(domElements['mainInput'],'[b]','[/b]'); });
	addEvent(domElements['bbcodeItalic'], 'click', function() { insertAtCursor(domElements['mainInput'],'[i]','[/i]'); });
	addEvent(domElements['bbcodeURL'], 'click', function() { insertAtCursor(domElements['mainInput'],'[URL]','[/URL]'); });
	addEvent(domElements['bbcodeIMG'], 'click', function() { insertAtCursor(domElements['mainInput'],'[IMG]','[/IMG]'); });
	addEvent(domElements['bbcodeCode'], 'click', function() { insertAtCursor(domElements['mainInput'],'[CODE]','[/CODE]'); });
	
	

})();


