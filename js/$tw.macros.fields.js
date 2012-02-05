$tw.macros.fields = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<div/>").addClass("tw_macro")
					.attr("data-tw-macro","fields")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	$tw.utils.renderObject(options.tiddler.getFields(),["text","title"]).appendTo(this.elem);
	return this.elem;
};

$tw.macros.fields.prototype.refresh = function(options) {
	this.elem.empty();
	$tw.utils.renderObject(options.tiddler.getFields(),["text","title"]).appendTo(this.elem);
};
