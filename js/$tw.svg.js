$tw.svg = {};

(function() {

	$tw.Tiddler.renderers["image/svg+xml"] = function() {
		return $tw.svg.render(this);
	};

	// Load a specified tiddler as an SVG image and return a reference to it
	$tw.svg.render = function(tiddler,options) {
		var defaults = {
			fixIDs: true
		};
		options = $.extend({},defaults,options);
		var svgDoc = new DOMParser().parseFromString(tiddler.getText(), "application/xml").documentElement;
		if(options.fixIDs)
			$tw.svg.fixIDs(svgDoc.childNodes,$tw.svg.generateIdPrefix());
		var img = $(document.importNode(svgDoc, true));
		return img;
	};

	// Fix up all references to IDs in an SVG fragment with a prefix
	$tw.svg.fixIDs = function(childNodes,idPrefix) {
		var urlPattern = /^\s*url\(\#([^\)]*)\)\s*$/ig;
		var fixes = [
			{attr: "id", namespace: "", pattern: /^(.*)$/ig},
			{attr: "fill", namespace: "", pattern: urlPattern},
			{attr: "stroke", namespace: "", pattern: urlPattern},
			{attr: "href", namespace: "http://www.w3.org/1999/xlink", pattern: /^#(.*)$/ig}
		];
		for(var t=0; t<childNodes.length; t++) {
			var node = childNodes[t];
			for(var a=0; a<fixes.length; a++) {
				var fix = fixes[a];
				if(node.hasAttributeNS && node.hasAttributeNS(fix.namespace,fix.attr)) {
					var v = node.getAttributeNS(fix.namespace,fix.attr);
					fix.pattern.lastIndex = 0;
					var match = fix.pattern.exec(v);
					if(match) {
						var replacement = (idPrefix + match[1]).replace("$","$$$$"); // Make sure replacement string doesn't contain any single dollar signs
						v = v.replace(match[1],replacement);
						node.setAttributeNS(fix.namespace,fix.attr,v);
					}
				}
			}
			var children = node.childNodes;
			if(children.length > 0)
			 	$tw.svg.fixIDs(children,idPrefix);
		}
	};

	var fixPrefix = 1;
	
	// Generate a new, safe and unused ID prefix
	$tw.svg.generateIdPrefix = function() {
		return "$tw_svgfix_" + (fixPrefix++).toString() + "_";
	};

})();
