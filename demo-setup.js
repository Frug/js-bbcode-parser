(function() {

	var domIDs = {
			mainInput: 'mainInput',
			parseButton: 'parseButton',
			mainOutput: 'mainOutput'
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
	
	function doParse() {
		domElements['mainOutput'].innerHTML = BBCodeParser.process(domElements['mainInput'].value);
	}

	for(var key in domIDs) {
		domElements[key] = document.getElementById(domIDs[key]);
	}
	
	addEvent(domElements['parseButton'], 'click', doParse);

})();


