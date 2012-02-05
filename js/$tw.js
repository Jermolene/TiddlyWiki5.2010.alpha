// Many thanks to John Resig and the rest of the jQuery team. The TiddlyWiki5 core steals many of their finely executed ideas

(function() {

window.$tw = function(selector) {
	return new $tw.fn.init(selector);
};

$tw.fn = $tw.prototype = {
	init: function(selector) {
		var t,i;
		this.length = 0;
		if($.isArray(selector)) { // Selector is an array of tiddlers or tiddler selectors
			for(t=0; t<selector.length; t++) {
				var v = selector[t];
				if(typeof v === "string") {
					var tiddlers = $tw(v);
					for(i=0; i<tiddlers.length; i++) {
						this[this.length++] = tiddlers[i];
					}
				} else if(v instanceof $tw.Tiddler) {
					this[this.length++] = v;
				}
			}
		} else if(selector instanceof $tw.Tiddler) { // Selector is instance of a tiddler
			this[0] = selector;
			this.length = 1;
		} else if(typeof selector === "string") {
			switch(selector.charAt(0)) {
				case "*": // all available tiddlers
					this.init($tw.store.getAllTiddlers());
					break;
				case "#": // #tagname
					this.init($tw.store.getTiddlersByTag(selector.substr(1)));
					break;
				case "@": // @username
					break;
				case "[": // [field[value]]
					var endOfFieldPos = selector.indexOf("[",1);
					var endOfValuePos = selector.lastIndexOf("]]");
					if(endOfFieldPos != -1 && endOfValuePos != -1 && endOfValuePos > endOfFieldPos) {
						this.init($tw.store.getTiddlersByField(
							selector.substring(1,endOfFieldPos),
							selector.substring(endOfFieldPos+1,endOfValuePos)
						));
					}
					break;
				default: // tiddlername
					tiddler = $tw.store.getTiddler(selector);
					this.init(tiddler);
					break;
			}
		}
		return this;
	},
	eq: function(index) {
		return this[index];
	},
	each: function(callback) {
		for(var t=0; t<this.length; t++) {
			callback.call(this[t],t);
		}
		return this;
	},
	filter: function(selector) {
		var filtered = [];
		if(typeof selector == "string") {
			switch(selector.charAt(0)) {
				case "?": // Pseudo-filters
					// Clear the chain if the environment variable is false
					if(!this.environment(selector.substr(1))) {
						this.init(filtered);
					}
					break;
				case "*": // all available tiddlers
					break;
				case "#": // #tagname	
					for(t = 0; t<this.length; t++) {
						if(this[t].fields.tags && $.inArray(selector.substr(1),this[t].fields.tags) !== -1) {
							filtered.push(this[t]);
						}
					}
					this.init(filtered);
					break;
				case "@": // @username
					break;
				case "[": // [field[value]]
					var endOfFieldPos = selector.indexOf("[",1);
					var endOfValuePos = selector.lastIndexOf("]]");
					if(endOfFieldPos != -1 && endOfValuePos != -1 && endOfValuePos > endOfFieldPos) {
						for(t = 0; t<this.length; t++) {
							if(this[t].fields[selector.substring(1,endOfFieldPos)] === selector.substring(endOfFieldPos+1,endOfValuePos)) {
								filtered.push(this[t])
							}
						}
					}
					this.init(filtered);
					break;
				default: // tiddlername	
					for(t = 0; t<this.length; t++) {
						if(this[t].title === selector) {
							filtered.push(this[t]);
						}
					}
					this.init(filtered);
					break;
			}
		}
		return this;
	},
	toArray: function() {
		var a = [],t;
		for(t=0; t<this.length; t++)
			a.push(this[t]);
		return a;
	},
	sort: function(field,options) {
		var defaults = {
			caseSensitive: false
		};
		options = $.extend({},defaults,options);
		var sorted = this.toArray();
		sorted.sort(function(a,b) {
			return a.compareTo(b,field,options.caseSensitive);
		});
		this.init(sorted);
		return this;
	},
	environment: function(variable) {
		var result;
		switch(variable) {
			case "loaded_from_file":
				result = document.location.toString().substr(0,4) === "file";
				break;
			case "loaded_from_web":
				result = document.location.toString().substr(0,4) === "http";
				break;
		}
		return result;
	}
};

$tw.fn.init.prototype = $tw.fn;

})();
