// Options are:
//	templateTitle - title of tiddler containing template
//  template - template text (if present, overrides templateTitle)
//	title - the title of the tiddler being opened (see below))
//  jOrigin - jQuery element that was the origin of opening the tiddler (used for animations)

$tw.fn.navigate = function(options) {
	var defaults = {
	};
	options = $.extend({},defaults,options);
	this.each(function(i) {
		$tw.display.navigateTiddler(this,options);
	});
};
