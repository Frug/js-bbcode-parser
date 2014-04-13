/* 
 * Javascript BBCode Parser
 * @author Philip Nicolcev
 * @license MIT License
 */

var BBCodeParser = (function(parserTags, colors) {
	'use strict';
	
	var me = {},
		urlPattern = /^(?:https?|file|c):(?:\/{1,3}|\\{1})[-a-zA-Z0-9:;@#%&()~_?\+=\/\\\.]*$/,
		emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/,
		fontFacePattern = /^([a-z][a-z0-9_]+|"[a-z][a-z0-9_\s]+")$/i,
		tagNames = [],
		tagNamesNoParse = [],
		regExpAllowedColors,
		regExpValidHexColors = /^#?[a-fA-F0-9]{6}$/,
		ii, tagName, len;
		
	// create tag list and lookup fields
	for (tagName in parserTags) {
		if (tagName === '*') {
			tagNames.push('\\' + tagName);
		} else {
			tagNames.push(tagName);
			if ( parserTags[tagName].noParse ) {
				tagNamesNoParse.push(tagName);
			}
		}

		parserTags[tagName].validChildLookup = {};
		parserTags[tagName].validParentLookup = {};
		parserTags[tagName].restrictParentsTo = parserTags[tagName].restrictParentsTo || [];
		parserTags[tagName].restrictChildrenTo = parserTags[tagName].restrictChildrenTo || [];

		len = parserTags[tagName].restrictChildrenTo.length;
		for (ii = 0; ii < len; ii++) {
			parserTags[tagName].validChildLookup[ parserTags[tagName].restrictChildrenTo[ii] ] = true;
		}
		len = parserTags[tagName].restrictParentsTo.length;
		for (ii = 0; ii < len; ii++) {
			parserTags[tagName].validParentLookup[ parserTags[tagName].restrictParentsTo[ii] ] = true;
		}
	}
	
	regExpAllowedColors = new RegExp('^(?:' + parserColors.join('|') + ')$');
	
	function createInnermostTagRegExp(tagsArray) {
		var openingTag = '\\[(' + tagsArray.join('|') + ')\\b(?:[ =]([\\w"#\\-\\:\\/= ]*?))?\\]',
			notContainingOpeningTag = '((?:(?=([^\\[]+))\\4|\\[(?!\\1\\b(?:[ =](?:[\\w"#\\-\\:\\/= ]*?))?\\]))*?)',
			closingTag = '\\[\\/\\1\\]';
			
		return new RegExp( openingTag + notContainingOpeningTag + closingTag, 'i');
	}
	
	function escapeBBCodesInsideTags(text, tags) {
		if (tags.length === 0 || text.length < 7)
			return text;

		var innerMostRegExp = createInnermostTagRegExp(tags);
		
		while (
			text !== (text = text.replace(innerMostRegExp, function(matchStr, tagName, tagParams, tagContents) {
				tagParams = tagParams || "";
				tagContents = tagContents || "";
				tagContents = tagContents.replace(/\[/g, "&#91;").replace(/\]/g, "&#93;");
				return "[\u0000" + tagName + tagParams + "]" + tagContents + "[/\u0000" + tagName + "]";
			}))
		);

		return text.replace(/\u0000/g,'');
	}
	
	function processTags(text, tags) {
		if (tags.length === 0 || text.length < 7)
			return text;
		
		var innerMostRegExp = createInnermostTagRegExp(tags);
		
		while (
			text !== (text = text.replace(innerMostRegExp, function(matchStr, tagName, tagParams, tagContents) {
				tagName = tagName.toLowerCase();
				tagParams = tagParams || "";
				tagContents = tagContents || "";
				return parserTags[tagName].openTag(tagParams, tagContents) + (parserTags[tagName].content ? parserTags[tagName].content(tagParams, tagContents) : tagContents) + parserTags[tagName].closeTag(tagParams, tagContents);
			}))
		);
		
		return text;
	}
	
	me.process = function(text, config) {
		text = escapeBBCodesInsideTags(text, tagNamesNoParse);
		
		text = processTags(text, tagNames);
		
		return text;
		
	};
	
	me.allowedTags = tagNames;
	me.urlPattern = urlPattern;
	me.emailPattern = emailPattern;
	me.regExpAllowedColors = regExpAllowedColors;
	me.regExpValidHexColors = regExpValidHexColors;
		
	return me;
})(parserTags, parserColors);
