(function() {
	
	// Only trigger the update timer if the text of the tiddler is requested
	$tw.store.storeTiddler([
		{n: "title", v: "Clock"},
		{n: "text", v: function () {
			var getDate = function() {return (new Date()).toString()};
			window.setInterval(function() {
				$tw.store.storeTiddler([
					{n: "title", v: "Clock"},
					{n: "text", v: getDate()}
				]);
			}, 1*1000);
			return getDate();
		}}
	]);
	
})();
