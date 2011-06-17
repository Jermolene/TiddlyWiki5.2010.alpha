$tw.macros.command = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<span/>").addClass("tw_macro")
					.attr("data-tw-macro","command")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{defaultName: "name"});
	this.commandName = this.params.get("name");
	this.command = $tw.macros.command.commands[this.commandName];
	this.elem.attr("title",this.command ? this.command.text : undefined);
	this.elem.addClass("tw_button").data("tw_commandName",this.commandName);
	$tw.macro.initMacros(this.elem.children(),{tiddler: tiddler});
	return this.elem;
};
	
$tw.macros.command.commands = {
	closeTiddler: {text: "Close this tiddler"},
	editTiddler: {text: "Edit this tiddler"},
	saveTiddler: {text: "Save this tiddler"},
	cancelTiddler: {text: "Cancel this tiddler"},
	detailsTiddler: {text: "Show/hide details of this tiddler"}
};

$(".tw_macro[data-tw-macro='command']").live("click",function(e) {
	var commandName = $(this).data("tw_commandName");
	var command = $tw.macros.command.commands[commandName];
	var ret = $tw.macro.dispatchCommand(commandName,$(this),{ev: e});
	if(ret === undefined)
		$tw.log("Undefined command:",commandName);
	return false;
});
