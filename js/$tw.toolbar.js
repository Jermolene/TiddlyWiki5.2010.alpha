$tw.toolbar = {};

(function() {

	$tw.toolbar.create = function(selector,className) {
		var toolbarWrapper = $("<div/>").addClass(className);
		var toolbar = $("<div/>").addClass("tw_bar").appendTo(toolbarWrapper);
		$tw(selector).render({
			displayPoint: toolbar
			});
		return toolbarWrapper;
	};	

})();
