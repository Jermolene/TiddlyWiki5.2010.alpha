$tw.startup = {
	navToolbar: null,
	mainToolbar: null
};

(function() {
	$(".tw_tiddler").hide();
	$tw.storage.loadContent();
	$tw.store.debug();
	$tw.store.addNotification({callback: $tw.display.refresh, selector: "*"});
	// Remove static styles
	$($tw("$tw.styles.static").eq(0).getFields()._storage).remove();
	// Render the page template
	$tw("$tw.templates.page.default").render();
	// Render any global SVG definitions
	$tw("#$tw.svg.definition").filter("[type[image/svg+xml]]").each(function (i) {
		$("body").append($tw.svg.render(this,{fixIDs: false}).height(0));
	});
	// Open some tiddlers
	$tw('#$tw.startup.open').each(function (i) {
		$tw(this.getText().split("\n")).navigate();
	});

	//$tw.startup.navToolbar = $tw.toolbar.create("#$tw.toolbar.nav","tw_barLeft").appendTo("body");
	//$tw.startup.navToolbar.find(".tw_bar").hide().show("slide",{direction: "left"});
	$tw.startup.mainToolbar = $tw.toolbar.create("#$tw.toolbar.main","tw_barBottom").appendTo("body");
	$tw.startup.mainToolbar.find(".tw_bar").hide().show("slide",{direction: "down"});

	$tw.log("Startup ending");

})();
