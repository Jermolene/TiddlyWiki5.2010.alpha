$tw.utils = {};

(function() {
	
	$tw.utils.arrayRemove = function(array,from,to) {
		// Thanks to John Resig (MIT Licensed) - http://ejohn.org/blog/javascript-array-remove/
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);
	};

	// Search for the first named value in an array of {n:, v:}
	$tw.utils.searchFields = function(fields,field) {
		var result;
		for(var t=0; t<fields.length; t++) {
			if(fields[t].n === field)
				return fields[t].v;
		}
		return undefined;
	}

	// Parse a string consisting of newline delimited "name:value" strings into an array of {n:, v:}
	$tw.utils.parseFields = function(text) {
		var fields = [];
		var lines = text.split("\n");
		for(var t=0; t<lines.length; t++) {
			var c = lines[t].indexOf(":");
			if(c != -1)
				fields.push({
					n: $.trim(lines[t].substring(0,c)),
					v: $.trim(lines[t].substring(c+1))
				});
		}
		return fields;
	};
	
	// Parse a space-separated string of name:value parameters
	// The parameters are returned in a structure that can be referenced like this:
	//		(return).byName["name"][0] - First occurance of parameter with a given name
	//		(return).byPos[0].n - Name of parameter in first position
	//		(return).byPos[0].v - Value of parameter in first position
	$tw.utils.parseParams = function(paramString,options) {
		var defaults = {
			defaultName: null,
			defaultValue: null,
			noNames: false,
			cascadeDefaults: false
		};
		options = $.extend({},defaults,options);
		var parseToken = function(match,p) {
			var n;
			if(match[p]) // Double quoted
				n = match[p];
			else if(match[p+1]) // Single quoted
				n = match[p+1];
			else if(match[p+2]) // Double-square-bracket quoted
				n = match[p+2];
			else if(match[p+3]) // Double-brace quoted
				n = match[p+3];
			else if(match[p+4]) // Unquoted
				n = match[p+4];
			else if(match[p+5]) // empty quote
				n = "";
			return n;
		};
		var byPos = [];
		var dblQuote = "(?:\"((?:(?:\\\\\")|[^\"])+)\")";
		var sngQuote = "(?:'((?:(?:\\\\\')|[^'])+)')";
		var dblSquare = "(?:\\[\\[((?:\\s|\\S)*?)\\]\\])";
		var dblBrace = "(?:\\{\\{((?:\\s|\\S)*?)\\}\\})";
		var unQuoted = options.noNames ? "([^\"'\\s]\\S*)" : "([^\"':\\s][^\\s:]*)";
		var emptyQuote = "((?:\"\")|(?:''))";
		var skipSpace = "(?:\\s*)";
		var token = "(?:" + dblQuote + "|" + sngQuote + "|" + dblSquare + "|" + dblBrace + "|" + unQuoted + "|" + emptyQuote + ")";
		var re = options.noNames ? new RegExp(token,"mg") : new RegExp(skipSpace + token + skipSpace + "(?:(\\:)" + skipSpace + token + ")?","mg");
		do {
			var match = re.exec(paramString);
			if(match) {
				var n = parseToken(match,1);
				if(options.noNames) {
					byPos.push({n:"", v:n});
				} else {
					var v = parseToken(match,8);
					if(v === null && options.defaultName) {
						v = n;
						n = options.defaultName;
					} else if(v === null && options.defaultValue) {
						v = options.defaultValue;
					}
					byPos.push({n:n, v:v});
					if(options.cascadeDefaults) {
						options.defaultName = n;
						options.defaultValue = v;
					}
				}
			}
		} while(match);
		return new $tw.utils.Params(byPos);
	};
	
	// Object providing access to parsed parameters
	$tw.utils.Params = function(byPos) {
		this.byPos = byPos;
		this.byName = {};
		for(var t=0; t<byPos.length; t++) {
			var n = byPos[t].n;
			var v = byPos[t].v;
			if(n in this.byName)
				this.byName[n].push(v);
			else
				this.byName[n] = [v];
		}
	};

	// Retrieve the first occurance of a named parameter, or the default if missing
	$tw.utils.Params.prototype.get = function(n,defaultValue) {
		var v = this.byName[n];
		return v && v.length > 0 ? v[0] : defaultValue;
	};


	// Render the fields of an object, with an optional array of names to exclude
	$tw.utils.renderObject = function(object,excludeNames) {
		var table = $("<table/>");
		var tbody = $("<tbody/>").appendTo(table);
		for(var n in object) {
			if(!excludeNames || $.inArray(n,excludeNames) == -1) {
				var row = $("<tr/>").addClass("tw_dataRow");
				$("<td/>").addClass("tw_dataName").text(n).appendTo(row);
				$("<td/>").addClass("tw_dataValue").text(object[n].toString()).appendTo(row);
				row.appendTo(tbody);
			}
		}
		return table;
	}

	$.fn.isScrolledIntoView = function() {
		if(this.length) {
		    var winTop = $(window).scrollTop();
		    var winBottom = winTop + $(window).height();
		    var elemTop = $(this[0]).offset().top;
		    var elemBottom = elemTop + $(this[0]).height();
		    return (elemBottom >= winTop) && (elemTop <= winBottom)
		      && (elemBottom <= winBottom) &&  (elemTop >= winTop);
		} else {
			return false;
		}
	}
	
	$.fn.scrollIntoView = function(options) {
		if(this.length && !this.isScrolledIntoView()) {
        	$('html,body').animate({scrollTop: $(this[0]).offset().top}, options);
		}
		return this;
	}
	
})();
