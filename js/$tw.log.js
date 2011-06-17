$tw.log = {};

(function() {

	// Thanks to Paul Irish, http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	$tw.log = function(/* arguments */) {
		var now = new Date();
		var args = Array.prototype.slice.call(arguments);
		args.push("time:",(now - $tw_startupTime)/1000);
		if(window.console) {
			var method = window.console.firebug ? 'apply' : 'call';
			if(window.console.log && window.console.log[method])
				window.console.log[method](window.console,args);
		}
	};
	
	$tw.logHex = function(string) {
		var hex = "";
		for(var c=0; c<string.length; c+=16) {
			hex += string.substr(c,16) + " ";
			for(var b=0; b<16; b++) {
				hex += string.charCodeAt(c+b).toString(16) + " ";
			}
			hex += "\n"
		}
		$tw.log(hex);
	}

})();
