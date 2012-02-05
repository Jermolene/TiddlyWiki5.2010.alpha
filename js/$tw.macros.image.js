$tw.macros.image = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<span/>").addClass("tw_macro")
					.attr("data-tw-macro","image")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	this.tiddlerTitle = this.params.get("title");
	this.width = this.params.get("width");
	this.height = this.params.get("height");
	var tiddler = $tw.store.getTiddler(this.tiddlerTitle);
	var image;
	if(tiddler) {
	 	image = tiddler.toHtml();
		if(this.width !== undefined)
			image.css("width",this.width);
		if(this.height !== undefined)
			image.css("height",this.height);
	} else {
		image = $("<span/>").text("Missing image: " + this.tiddlerTitle);
	}
	this.elem.empty();
	image.appendTo(this.elem);
	return this.elem;
};
