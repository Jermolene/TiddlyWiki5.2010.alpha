$tw.macros.story = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<div/>").addClass("tw_macro")
					.attr("data-tw-macro","story")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	this.accepts = this.params.get("accepts","*");
	this.elem.addClass("tw_tiddlerContainer");
	var header = this.elem.find(".tw_tiddlerContainerHeader");
	$tw.macro.initMacros(header.children(),{tiddler: options.tiddler});
	var content = this.elem.find(".tw_tiddlerContainerContent");
	$tw.macro.initMacros(content.children(),{tiddler: options.tiddler});
	content.sortable({
		handle: ".tw_title",
		cancel: ".tw_button, :input",
		connectWith: ".tw_tiddlerContainerContent"
	});
	return this.elem;
};

$tw.macros.story.prototype.insertTiddlerFrameInContainer = function(tiddler,options) {
	var elemTiddler = null;
	if($tw(tiddler).filter(this.accepts).length === 1) {
		elemTiddler = new $tw.macros.displayTiddler("title:" + tiddler.title + " template:" + options.template.title,{tiddler: tiddler});
		elemTiddler.prependTo(this.elem.find(".tw_tiddlerContainerContent").eq(0));
	}
	return elemTiddler;
};

$tw.macros.story.prototype.closeTiddler = function(options) {
	var content = this.elem.find(".tw_tiddlerContainerContent").children();
	content.addClass("tw_ignoreMacros");
	content.hide("blind",{direction: "vertical"},500,function() {content.remove();});
	return true;
};

$tw.macros.story.prototype.editTiddler = function(options) {
	var content = this.elem.find(".tw_tiddlerContainerContent").children();
	$tw.macro.broadcastCommand("editTiddler",content,options);
	return true;
};

$tw.macros.story.prototype.saveTiddler = function(options) {
	var content = this.elem.find(".tw_tiddlerContainerContent").children();
	$tw.macro.broadcastCommand("saveTiddler",content,options);
	return true;
};

$tw.macros.story.prototype.cancelTiddler = function(options) {
	var content = this.elem.find(".tw_tiddlerContainerContent").children();
	$tw.macro.broadcastCommand("cancelTiddler",content,options);
	return true;
};

$tw.macros.story.prototype.detailsTiddler = function(options) {
	var content = thiselem.find(".tw_tiddlerContainerContent").children();
	$tw.macro.broadcastCommand("detailsTiddler",content,options);
	return true;
};
