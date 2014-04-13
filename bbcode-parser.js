/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

var parserTags = {
	'b': {
		openTag: function(params,content) {
			return '<b>';
		},
		closeTag: function(params,content) {
			return '</b>';
		}
	},
	'code': {
		openTag: function(params,content) {
			return '<code>';
		},
		closeTag: function(params,content) {
			return '</code>';
		},
		noParse: true
	},
	'color': {
		openTag: function(params,content) {
			var colorCode = params.substr(1) || "inherit";
			ajaxChat.BBCodeParser.regExpAllowedColorNames.lastIndex = 0;
			ajaxChat.BBCodeParser.regExpValidHexColor.lastIndex = 0;
			if ( !ajaxChat.BBCodeParser.regExpAllowedColorNames.test( colorCode ) ) {
				if ( !ajaxChat.BBCodeParser.regExpValidHexColor.test( colorCode ) ) {
					colorCode = "inherit";
				} else {
					if (colorCode.substr(0,1) !== "#") {
						colorCode = "#" + colorCode;
					}
				}
			}

			return '<span style="color:' + colorCode + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		}
	},
	'i': {
		openTag: function(params,content) {
			return '<i>';
		},
		closeTag: function(params,content) {
			return '</i>';
		}
	},
	'img': {
		openTag: function(params,content) {

			var myUrl = content;

			ajaxChatConfig.urlPattern.lastIndex = 0;
			if ( !ajaxChatConfig.urlPattern.test( myUrl ) ) {
				myUrl = "";
			}

			return '<img class="bbCodeImage" src="' + myUrl + '" />';
		},
		closeTag: function(params,content) {
			return '';
		},
		displayContent: false
	},
	'list': {
		openTag: function(params,content) {
			return '<ul>';
		},
		closeTag: function(params,content) {
			return '</ul>';
		},
		restrictChildrenTo: ["*", "li"]
	},
	'noparse': {
		openTag: function(params,content) {
			return '';
		},
		closeTag: function(params,content) {
			return '';
		},
		noParse: true
	},
	'quote': {
		openTag: function(params,content) {
			return '<q>';
		},
		closeTag: function(params,content) {
			return '</q>';
		}
	},
	's': {
		openTag: function(params,content) {
			return '<s>';
		},
		closeTag: function(params,content) {
			return '</s>';
		}
	},
	'size': {
		openTag: function(params,content) {
			var mySize = parseInt(params.substr(1),10) || 0;
			if (mySize < 10 || mySize > 20) {
				mySize = 'inherit';
			} else {
				mySize = mySize + 'px';
			}
			return '<span style="font-size:' + mySize + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		}
	},
	'u': {
		openTag: function(params,content) {
			return '<span style="text-decoration:underline">';
		},
		closeTag: function(params,content) {
			return '</span>';
		}
	},
	'url': {
		openTag: function(params,content) {

			var myUrl;

			if (!params) {
				myUrl = content.replace(/<.*?>/g,"");
			} else {
				myUrl = params.substr(1);
			}

			ajaxChatConfig.urlPattern.lastIndex = 0;
			if ( !ajaxChatConfig.urlPattern.test( myUrl ) ) {
				myUrl = "#";
			}

			return '<a href="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '</a>';
		}
	}
};

var parserColors = [ 'gray', 'silver', 'white', 'yellow', 'orange', 'red', 'fuchsia', 'blue', 'green', 'black', '#cd38d9' ];


var BBCodeParser = (function(parserTags, colors) {
	
	var me = {},
		urlPattern = /^(?:https?|file|c):(?:\/{1,3}|\\{1})[-a-zA-Z0-9:;@#%&()~_?\+=\/\\\.]*$/,
		emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/,
		fontFacePattern = /^([a-z][a-z0-9_]+|"[a-z][a-z0-9_\s]+")$/i,
		tagNames = [],
		tagsNoParse = [],
		regExpNoParseTags,
		regExpNonTags,
		regExpAllowedColors,
		regExpValidHexColors,
		ii, tagName, len;
		
	// create tag list and lookup fields
	for (tagName in parserTags) {
		if (tagName === '*') {
			tagNames.push('\\' + tagName);
		} else {
			tagNames.push(tagName);
			if ( parserTags[tagName].noParse ) {
				tagsNoParse.push(tagName);
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
	regExpValidHexColors = /^#?[a-fA-F0-9]{6}$/;
	
	//regExpNonTags = new RegExp('(\\[)((?!/?' + tagNames.join('(?:\\]|\\b|=)|/?') + '(?:\\]|\\b|=)).*?)(\\])', 'gi');
	//regExpNoParseTags = new RegExp('\\[(' + tagsNoParse.join('|') + ')([ =][^\\]]*?)?\\]([\\s\\S]*?)\\[/\\1\\]', 'gi');
	
	//var regexFindInnermost = /\[(code|noparse)\b(?:[ =]([\w"#\-\:\/= ]*?))?\](?:(?=([^\[]+))\3|\[(?!\1\b(?:[ =](?:[\w"#\-\:\/= ]*?))?\]))*?\[\/\1\]/g;
	//var newFindInnermost =   /\[(code|noparse)\b(?:[ =]([\w"#\-\:\/= ]*?))?\]((?:(?=([^\[]+))\4|\[(?!\1\b(?:[ =](?:[\w"#\-\:\/= ]*?))?\]))*?)\[\/\1\]/;
	
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
				tagParams = tagParams || "";
				tagContents = tagContents || "";
				return parserTags[tagName].openTag(tagParams) + tagContents + parserTags[tagName].closeTag(tagParams);
			}))
		);
		
		return text;
	}
	
	me.process = function(text, config) {
		text = escapeBBCodesInsideTags(text, tagsNoParse);
		
		text = processTags(text, tagNames);
		
		console.log(text);
		
		return text;
		
	};
		
	return me;
})(parserTags, parserColors);