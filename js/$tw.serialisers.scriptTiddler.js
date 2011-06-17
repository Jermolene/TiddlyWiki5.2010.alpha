// TODO: Escape closing </sc**pt> tags within content

$tw.serialisers.script = {
	nodeName: "SCRIPT"
};

(function() {
	
	$tw.serialisers.script.loadTiddler = function(elem) {
		if($(elem).attr("type") !== "text/x-tiddler")
			return false;
		var text = $.trim($(elem).html());
		var endFields = text.indexOf("\n\n");
		endFields = endFields == -1 ? text.length : endFields;
		var fields = $tw.utils.parseFields(text.substring(0,endFields));
		fields.unshift(
			{n: "format", v: "script"}
			);
		var src = $(elem).attr("external");
		if(src) {
			fields.unshift(
				{n: "_src", v: src},
				{n: "text", v: function() {
					$.get(src, function(data){
$tw.log("Retrieved",src);
						fields.unshift({n: "text", v: data});
						$tw.store.storeTiddler(fields);
					});
					return "Loading external text from: " + src;
				}});
		} else {
			fields.unshift({n: "text", v: text.substring(endFields+2)});
		}
		return new $tw.Tiddler(fields);
	};

})();
