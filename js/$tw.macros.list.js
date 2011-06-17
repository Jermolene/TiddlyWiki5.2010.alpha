$tw.macros.list = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<div/>").addClass("tw_macro")
					.attr("data-tw-macro","list")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	var wrapper = $("<ul/>").addClass("tw_tiddlerList").appendTo(this.elem);
	$tw("*").sort("title").each(function(i) {
		var link = $tw.link.create(this.title,options.tiddler);
		link.text(this.title);
		var listItem = $("<li/>").addClass("tw_tiddlerListItem").append(link).appendTo(wrapper);
	});
	return this.elem;
};
