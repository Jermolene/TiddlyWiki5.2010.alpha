$tw.fn.render = function(options) {
	var defaults = {
		displayPoint: "body"
	};
	options = $.extend({},defaults,options);
	this.each(function(i) {
		$tw.display.renderTiddler(this).appendTo($(options.displayPoint));
	});
};
