$tw.serialisers.html = {
	nodeName: "DIV",
	className: "tw_tiddler"
};

(function() {
	
	$tw.serialisers.html.loadTiddler = function(elem) {
		var revision = $(elem).children(".tw_revision").text();
		var title = $(elem).children(".tw_title").text();
		var created = $(elem).children(".tw_created").eq(0).attr("title");
		var modified = $(elem).children(".tw_modified").eq(0).attr("title");
		var html = $(elem).children(".tw_body").clone();
		var text = function() {return html.html()};
		var fields = [
			{n: "title", v: title},
			{n: "revision", v: revision},
			{n: "text", v: text},
			{n: "type", v: "text/html"},
			{n: "format", v: "html"}
		];
		$(elem).find(".tw_tags a[rel='tag']").each(function(i) {
			fields.push({n: "tag", v: $(this).text()});
		});
		$(elem).remove();
		return new $tw.Tiddler(fields);
	};

})();
