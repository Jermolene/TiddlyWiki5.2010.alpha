$tw.macros.view = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<span/>").addClass("tw_macro")
					.attr("data-tw-macro","view")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	this.fieldName = this.params.get("field","text");
	this.format = this.params.get("format","text");
	this.className = this.params.get("class");
	switch(this.format) {
		case "text":
			this.elem.text(options.tiddler.getField(this.fieldName,true));
			break;
		case "html":
			this.elem.html(options.tiddler.toHtml(this.fieldName));
			if($tw.macros.view.checkAndPushCallstack(options.tiddler.title)) {
				this.elem.text("Can't recursively view the body of a tiddler");
			} else {
				$tw.macro.initMacros(this.elem.children(),{tiddler: options.tiddler});	
				$tw.macros.view.popCallstack();
			}
			break;
	}
	if(this.className)
		this.elem.addClass(this.className);
	return this.elem;
};

$tw.macros.view.callstack = [];

$tw.macros.view.checkAndPushCallstack = function(title) {
	if($.inArray(title,$tw.macros.view.callstack) !== -1) {
		return true;
	} else {
		$tw.macros.view.callstack.push(title);
		return false;
	}
};

$tw.macros.view.popCallstack = function() {
	$tw.macros.view.callstack.pop();
};
