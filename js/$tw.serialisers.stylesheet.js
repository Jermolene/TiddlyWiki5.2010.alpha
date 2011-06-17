$tw.serialisers.stylesheet = {
	nodeName: "STYLE"
};

(function() {
	
	$tw.serialisers.stylesheet.loadTiddler = function(elem) {
		if($(elem).attr("type") !== "text/css")
			return false;
		var startMarker = "/*tiddlywiki-styles*";
		var text = $(elem).html();
		if(text.indexOf(startMarker) == -1)
		 	return false;
		var endFields = text.indexOf("*/");
		endFields = endFields == -1 ? text.length : endFields;
		var fields = $tw.utils.parseFields(text.substring(startMarker.length,endFields-1));
		fields.unshift(
			{n: "text", v: text.substring(endFields+2)},
			{n: "type", v: "text/css"},
			{n: "format", v: "stylesheet"},
			{n: "_storage", v: $(elem)}
			);
		return new $tw.Tiddler(fields);
	};

})();
