$tw.link = {};

(function() {

	$tw.link.create = function(targetTitle,containingTiddler) {
		return new $tw.macros.link("to:" + targetTitle,{tiddler: containingTiddler});
	};
	
})();
