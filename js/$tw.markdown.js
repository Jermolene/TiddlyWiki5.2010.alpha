$tw.markdown = {
	converter: null
};

(function() {

	$tw.Tiddler.renderers["text/x-markdown"] = function() {
		return $tw.markdown.toHtmlString(this.getText());
	};

	$tw.markdown.toHtmlString = function(markdown) {
		if(!$tw.markdown.converter)
			$tw.markdown.converter = new Showdown.converter();
		var html = "Problem with Markdown conversion";
		if($tw.markdown.converter) {
			html = $($tw.markdown.converter.makeHtml(markdown));
			html = $tw.markdown.processLinks(html);
		}
		return html;
	};
	
	$tw.markdown.processLinks = function(html) {
		html.find("a").each(function(i) {
			$(this).addClass("tw_macro").attr("data-tw-macro","link").attr("data-tw-params",$(this).attr("href"));
		});
		return html;
	};
	
})();
