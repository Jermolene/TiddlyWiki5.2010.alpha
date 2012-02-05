$tw.wikitext = {
	formatter: new Formatter(config.formatters)
};

(function() {

	$tw.Tiddler.renderers["text/x-tiddlywiki"] = function() {
		return $tw.wikitext.toHtmlString(this.getText());
	};
	
	$tw.wikitext.toHtmlString = function(wikitext) {
		var html = $("<div/>");
		var wikifier = new Wikifier(wikitext,$tw.wikitext.formatter);
		wikifier.subWikify(html.get(0));
		return html.contents();
	};
	
})();
