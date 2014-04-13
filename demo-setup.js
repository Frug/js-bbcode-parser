(function() {

	var domIDs = {
			mainInput: 'mainInput',
			parseButton: 'parseButton',
			mainOutput: 'mainOutput',
			bbcodeBold: 'bbcodeBold',
			bbcodeItalic: 'bbcodeItalic',
			bbcodeURL: 'bbcodeURL',
			allowedBBCodes: 'allowedBBCodes',
			bbcodeIMG: 'bbcodeIMG',
			bbcodeCode: 'bbcodeCode',
			theButtons: 'theButtons'
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
		myField.focus();
		if (document.selection) {
			document.selection.createRange().text = myValueBefore + document.selection.createRange().text + myValueAfter;
		} else if (myField.selectionStart || myField.selectionStart == '0') {
			startPos = myField.selectionStart;
			endPos = myField.selectionEnd;
			myField.value = myField.value.substring(0, startPos) + myValueBefore + myField.value.substring(startPos, endPos)+ myValueAfter + myField.value.substring(endPos, myField.value.length);
			myField.setSelectionRange(startPos,endPos + myValueBefore.length + myValueAfter.length);
		} else {
			myField.value += myValueBefore + myValueAfter;
		}
	}
	
	function createButtons() {
		var theElement, i;
		for (i = BBCodeParser.allowedTags.length - 1; i >= 0 ; i--) {
			theElement = document.createElement('button');
			theElement.innerHTML = BBCodeParser.allowedTags[i];
			domElements['theButtons'].appendChild(theElement);
			addEvent(theElement, 'click', function() { insertAtCursor(domElements['mainInput'],'[' + this.innerHTML + ']','[/' + this.innerHTML + ']'); });
		}
	}
	
	function doParse() {
		domElements['mainOutput'].innerHTML = BBCodeParser.process(domElements['mainInput'].value);
	}

	for(var key in domIDs) {
		domElements[key] = document.getElementById(domIDs[key]);
	}
	
	createButtons();
	
	addEvent(domElements['parseButton'], 'click', doParse);

})();


