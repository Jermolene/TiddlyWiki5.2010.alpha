$tw.macros.displayTiddler = function(source,options) {
	if(typeof source === "string") {
		this.paramString = source;
		this.elem = $("<div/>").addClass("tw_macro")
					.attr("data-tw-macro","displayTiddler")
					.attr("data-tw-params",source);
	} else {
		this.elem = source;
		this.paramString = this.elem.attr("data-tw-params");
	}
	this.elem.data("tw_macro",this);
	this.params = $tw.utils.parseParams(this.paramString,{});
	this.tiddlerTitle = this.params.get("title");
	this.templateTitle = this.params.get("template");
	this.cloneFrom = this.params.get("cloneFrom");
	this.elem.toggleClass("tw_tiddlerFrame",this.templateTitle !== undefined);
	this.render();
	return this.elem;
};

$tw.macros.displayTiddler.prototype.refresh = function(options) {
	this.render();
};

$tw.macros.displayTiddler.prototype.render = function() {
	var template = this.templateTitle ? $tw.store.getTiddler(this.templateTitle) : null;
	var showDetail = this.elem.hasClass("tw_showDetail");
	var tiddler = $tw.store.getTiddler(this.tiddlerTitle);
	this.elem.toggleClass("tw_missingTiddler",!tiddler)
	if(!tiddler) {
		var fields = [];
		if(this.cloneFrom) {
			fields = $tw.store.getTiddler(this.cloneFrom).toFieldList(["text","title"]);
		}
		fields.unshift(
			{n: "title", v: this.tiddlerTitle},
			{n: "text", v: "No text yet"}
		);
		tiddler = new $tw.Tiddler(fields);
	}
	if(template) {
		this.elem.html(template.toHtml());
	} else {
		this.elem.html(tiddler.toHtml());
	}
	$tw.macro.initMacros(this.elem.children(),{tiddler: tiddler});
	if(!showDetail)
		$(".tw_tiddlerDetail",this.elem).hide();
};

$tw.macros.displayTiddler.prototype.closeTiddler = function(options) {
	var elem = this.elem;
	if(elem.hasClass("tw_tiddlerFrame")) {
		elem.addClass("tw_ignoreMacros");
		elem.hide("blind",{direction: "vertical"},500,function() {elem.remove();});
	}
	return true;
};

$tw.macros.displayTiddler.prototype.editTiddler = function(options) {
	var tiddler = $tw.store.getTiddler(this.tiddlerTitle);
	this.templateTitle = $tw.display.chooseTemplateTitle(tiddler,{editMode: true});
	this.render();
	return true;
};

$tw.macros.displayTiddler.prototype.saveTiddler = function(options) {
	var tiddler;
	if(this.elem.hasClass("tw_dirtyTiddler")) {
		var fields = [
			{n: "type", v: "text/x-tiddlywiki"}
		];
		// TODO
		// fields.unshift()
		$tw.macro.broadcastCommand("saveTiddlerFields",this.elem.children(),{fields: fields});
		var tiddler = new $tw.Tiddler(fields);
		$tw.store.storeTiddler(tiddler);
		if(tiddler.title !== this.tiddlerTitle) {
			this.tiddlerTitle = tiddler.title;
		}
		this.elem.removeClass("tw_dirtyTiddler");
	} else {
		tiddler = $tw.store.getTiddler(this.tiddlerTitle);
	}
	this.templateTitle = $tw.display.chooseTemplateTitle(tiddler,{editMode: false});
	this.render();
	return true;
};

$tw.macros.displayTiddler.prototype.cancelTiddler = function(options) {
	var tiddler = $tw.store.getTiddler(this.tiddlerTitle);
	this.templateTitle = $tw.display.chooseTemplateTitle(tiddler,{editMode: false});
	this.elem.removeClass("tw_dirtyTiddler");
	this.render();
	return true;
};

$tw.macros.displayTiddler.prototype.detailsTiddler = function(options) {
	var showDetail = !this.elem.hasClass("tw_showDetail");
	this.elem.toggleClass("tw_showDetail",showDetail);
	$(".tw_tiddlerDetail",this.elem)[showDetail ? "slideDown" : "slideUp"]();
	return true;
};
