$tw.display = {};

(function() {

	// Render a tiddler to HTML and process any macros
	$tw.display.renderTiddler = function(tiddler) {
		var html = tiddler.toHtml();
		$tw.macro.initMacros(html,{tiddler: tiddler});
		return html;
	};

	// Open a tiddler through a given template, optionally in edit mode. If the tiddler is already displayed,
	// it is only re-rendered if the template does not match
	$tw.display.navigateTiddler = function(tiddler,options) {
		var defaults = {
		};
		options = $.extend({},defaults,options);
		// Get the template for displaying this tiddler
		options.templateTitle = options.templateTitle ? options.templateTitle : $tw.display.chooseTemplateTitle(tiddler,options);
		options.template = options.template ? options.template : $tw.store.getTiddler(options.templateTitle);
		// See if the tiddler is already open
		var elemTiddler = undefined;
		$(".tw_tiddlerFrame").each(function(i) {
			var macro = $(this).data("tw_macro");
			if(macro && macro.tiddlerTitle === tiddler.title)
				elemTiddler = $(this);
		});
		// Create a new tiddler frame if the tiddler isn't already open
		if(elemTiddler === undefined || elemTiddler.length === 0) {
			elemTiddler = $tw.display.createTiddlerFrame(tiddler,options);
		} else {
			// Update the existing frame if it's already open
			elemTiddler = elemTiddler.eq(0);
			elemTiddler.addClass("tw_macro");
			elemTiddler.attr("data-tw-macro","displayTiddler");
			elemTiddler.attr("data-tw-params","title:" + tiddler.title + " template:" + options.template.title);
			$tw.macro.initMacros(elemTiddler,{tiddler: tiddler});
		}
		// Animate
		if(options.jOrigin) {
			elemTiddler.scrollIntoView({duration: 500});
			$(options.jOrigin).effect("transfer",{to: elemTiddler},500);
		}
	};
	
	// Choose the template to use for displaying a particular tiddler
	$tw.display.chooseTemplateTitle = function(tiddler,options) {
		var chooserTitle = options.editMode ? "$tw.templateChooser.edit" : "$tw.templateChooser.view";
		var chooser = $tw.store.getTiddler(chooserTitle).toJson();
		var template = null;
		for(var t=0; t<chooser.templateChooser.length; t++) {
			var entry = chooser.templateChooser[t];
			if(template === null && $tw(tiddler).filter(entry.selector).length === 1) {
				template = entry.templateTitle;
			}
		}
		return template;
	}
	
	// Choose the point in the DOM to create a new tiddler frame
	$tw.display.createTiddlerFrame = function(tiddler,options) {
		var elemTiddler = null;
		// Look for a tiddlerContainer that will accept this tiddler
		if(elemTiddler === null) {
			var containers = $(".tw_macro.tw_tiddlerContainer");
			containers.each(function(i) {
				var macro = $(this).data("tw_macro");
				if(elemTiddler === null && macro.insertTiddlerFrameInContainer) {
					elemTiddler = macro.insertTiddlerFrameInContainer(tiddler,options);
				}
			});
		}
		// If no container accepted it, append the tiddler to the document body
		if(elemTiddler === null) {
			elemTiddler = new $tw.macro.displayTiddler("title:" + tiddler.title + " template:" + options.template.title,{tiddler: tiddler});
			$(body).append(elemTiddler);
		}
		return elemTiddler;
	};
	
	$tw.display.refresh = function() {
		$tw.macro.refreshMacros($(document).children());
	};

})();
