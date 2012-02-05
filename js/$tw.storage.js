$tw.storage = {};
$tw.serialisers = {};

(function() {
	
	$tw.storage.loadContent = function() {
		var recipe = {
			url: document.location.href,
			steps: []
		};
		$tw.storage.loadContentFromChildren(null,recipe.steps);
		$tw.store.storeTiddler([
			{n: "title", v: "$tw.recipes.default"},
			{n: "type", v: "text/json"},
			{n: "text", v: JSON.stringify(recipe,null,4)}
		]);
	};
		
	$tw.storage.loadContentFromChildren = function(childNodes,recipeSteps) {
		// Iterate using the DOM directly; jQuery methods seem to bypass comment nodes
		childNodes = childNodes ? childNodes : document.childNodes;
		for(var t=0; t<childNodes.length; t++) {
			var node = childNodes[t];
			var nodeName = node.nodeName.toUpperCase();
			var nodeType = node.nodeType;
			var loaded = false;
			for(var loaderName in $tw.serialisers) {
				var loader = $tw.serialisers[loaderName]
				var result = false;
				if(!loaded) {
					if((loader.nodeType ? loader.nodeType === nodeType : true) &&
					   (loader.nodeName ? loader.nodeName === nodeName : true) &&
					   (loader.className ?  $(node).hasClass(loader.className) : true)) {
						result = loader.loadTiddler(node);
					}
				}
				if(result !== false) {
					loaded = true;
					if(!$.isArray(result))
					 	result = [result];
					for(var i=0; i<result.length; i++) {
						var tiddler = result[i];
						recipeSteps.push({
							block: "tiddler",
							title: tiddler.title,
							format: tiddler.format,
							type: tiddler.type
						});
						$tw.store.storeTiddler(tiddler);
					}
				}
			}
			if((loaded == false) && (childNodes[t].childNodes.length > 0))
				$tw.storage.loadContentFromChildren(childNodes[t].childNodes,recipeSteps);
		}
	};

})();
