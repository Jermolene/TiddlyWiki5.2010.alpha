$tw.macros.edit = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<span/>").addClass("tw_macro")
					.attr("data-tw-macro","edit")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	this.fieldName = this.params.get("field","text");
	this.className = this.params.get("class");
	var editBox = (this.fieldName === "text") ? $("<textarea/>") : $("<input/>").attr("type","text");
	editBox.addClass("tw_editField")
	editBox.attr("value",options.tiddler.getField(this.fieldName,true));
	editBox.appendTo(this.elem);
	if(this.className)
		this.elem.addClass(this.className);
	return this.elem;
};

$tw.macros.edit.prototype.saveTiddlerFields = function(options) {
	options.fields.unshift({
		n: this.fieldName,
		v: this.elem.find(".tw_editField").val()
	});
};

$(".tw_editField").live("change",function(e) {
	var tiddlerFrame = $(this).closest(".tw_tiddlerFrame");
	tiddlerFrame.addClass("tw_dirtyTiddler");
	return false;
});
