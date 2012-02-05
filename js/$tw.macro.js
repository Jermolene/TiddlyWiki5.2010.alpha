$tw.macro = {};
$tw.macros = {};

(function() {

	$tw.macro.initMacros = function(elements,options) {
		$(elements).each(function(i) {
			var e = $(this);
			if(!e.hasClass("tw_ignoreMacros")) {
				if(e.hasClass("tw_macro")) {
					var macroName = e.attr("data-tw-macro");
					var macro = $tw.macros[macroName];
					if(macro)
						var macroElem = new macro(e,options);
					else
						$tw.log("Unrecognised macro: " + macroName);
				} else  {
					var c = e.children();
					if(c)
						$tw.macro.initMacros(c,options);
				}
			}
		});
	};

	$tw.macro.refreshMacros = function(elements,options) {
		$(elements).each(function(i) {
			var e = $(this);
			if(!e.hasClass("tw_ignoreMacros")) {
				var macro = e.data("tw_macro");
				if(e.hasClass("tw_macro") && macro.refresh) {
					macro.refresh.call(macro,options);
				} else {
					var c = e.children();
					if(c)
						$tw.macro.refreshMacros(c,options);
				}
			}
		});
	};
	
	// Search up the DOM hierarchy to find a macro that will accept the given command
	$tw.macro.dispatchCommand = function(command,elem,options) {
		var ret = undefined;
		// Move upwards looking for a macro to call
		do {
			if(elem.hasClass("tw_macro")) {
				var macro = elem.data("tw_macro");
				var commandFn = macro[command];
				if(macro && commandFn) {
					ret = commandFn.call(macro,options);
				}
			}
			elem = elem.parent();
		} while((ret === undefined) && elem.length > 0);
		// If we reach the top of the tree without finding a handler then broadcast the event from the top
		if((ret === undefined) && (elem.length === 0)) {
			$tw.macro.broadcastCommand(command,$("body").children(),options);
			ret = true;
		}
		return ret;
	};
	
	// Broadcast a command to a given set of elements and their children
	$tw.macro.broadcastCommand = function(command,elements,options) {
		$(elements).each(function(i) {
			var elem = $(this),
				ret = undefined;
			if(!elem.hasClass("tw_ignoreMacros")) {
				if(elem.hasClass("tw_macro")) {
					var macro = elem.data("tw_macro");
					var commandFn = macro[command];
					if(macro && commandFn) {
						ret = commandFn.call(macro,options);
					}
				}
				if(ret === undefined) {
					$tw.macro.broadcastCommand(command,elem.children(),options);
				}
			}
		});
		// TODO: Perhaps return value should indicate whether the command was dispatched at least once 
	};
	
})();
