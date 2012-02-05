$tw.macros.link = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<a/>").addClass("tw_macro").attr("href","#")
					.attr("data-tw-macro","link")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	this.linkTarget = this.params.get("to");
	this.render()
	$tw.macro.initMacros(this.elem.children(),{tiddler: options.tiddler});
	return this.elem;
};

$tw.macros.link.prototype.refresh = function(options) {
	this.render();
	$tw.macro.refreshMacros(this.elem.children(),{tiddler: options.tiddler});
};

$tw.macros.link.prototype.render = function() {
	this.elem.toggleClass("tw_missingLink",!$tw.store.tiddlerExists(this.linkTarget));
};

// Event handler for clicking on a link
$(".tw_macro[data-tw-macro='link']").live("click",function(e) {
	var containingTiddler = $(this).closest(".tw_tiddlerFrame");
	var macro = $(this).data("tw_macro");
	var target = $tw(macro.linkTarget);
	if(target.length === 0) {
		target = $tw(new $tw.Tiddler([
			{n: "title", v: macro.linkTarget}
			]));
	}
	target.navigate({jOrigin: this});
	return false;
});
