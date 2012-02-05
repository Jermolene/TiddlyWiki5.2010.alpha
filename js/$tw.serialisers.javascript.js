$tw.serialisers.javascript = {
	nodeName: "SCRIPT"
};

(function() {
	
	$tw.serialisers.javascript.loadTiddler = function(elem) {
		if($(elem).attr("type") !== "text/javascript")
			return false;
		var startMarker = "/*tiddlywiki-plugin*";
		var text = $(elem).text();
		if(text.indexOf(startMarker) == -1)
		 	return false;
		var endFields = text.indexOf("*/");
		endFields = endFields == -1 ? text.length : endFields;
		var fields = $tw.utils.parseFields(text.substring(startMarker.length,endFields-1));
		fields.unshift(
			{n: "type", v: "text/javascript"},
			{n: "format", v: "javascript"}
			);
		var src = $(elem).attr("src");
		if(src) {
			fields.unshift({n: "text", v: function() {
				$.get(src, function(data){
					fields.unshift({n: "text", v: data});
					$tw.store.storeTiddler(fields);
				});
				return "Loading external JavaScript text from: " + src;
			}});
		} else {
			fields.unshift({n: "text", v: text.substring(endFields+2)});
		}
		return new $tw.Tiddler(fields);
	};

})();
