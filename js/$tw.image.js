$tw.image = {};

(function() {

	$tw.Tiddler.renderers["image/png"] = function() {
		return $tw.image.render(this);
	};
	$tw.Tiddler.renderers["image/jpeg"] = $tw.Tiddler.renderers["image/png"];
	$tw.Tiddler.renderers["image/jpg"] = $tw.Tiddler.renderers["image/png"];

	$tw.image.render = function(tiddler,options) {
		var defaults = {
		};
		options = $.extend({},defaults,options);
		var fields = tiddler.getFields();
		var img = $("<img/>");
		if(fields.format === "mhtml" && $.browser.msie) {
			img.attr("src","mhtml:!" + fields.title);
		} else if(fields.format === "script" && fields._src) {
			img.attr("src",fields._src);
		} else {
			img.attr("src","data:" + fields.type + ";base64," + tiddler.getText());
		}
		return img;
	};

})();
