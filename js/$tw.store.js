$tw.store = {};

(function() {
	
	var tiddlers = {}; // Map of tiddlers by title
	// TODO: Other maps, indexed on other properties (including a map of deleted tiddlers)
	
	var notificationCallbacks = []; // Array of {callback: function(), selector: selector}
	var triggeredNotifications = []; // Subarray of notifications that have already been tripped
	var untriggeredNotifications = []; // Subarray of notifications that have not yet been tripped
	
	var notificationTimer = null;
	
	var locked = false; // Store is locked while notification callbacks are processed
	
	// Add a new notification handler {callback: function, selector: selector}
	$tw.store.addNotification = function(notification) {
		notificationCallbacks.push(notification);
	}
	
	// Queues up any notifications triggered by a particular tiddler
	$tw.store.registerModification = function(tiddler) {
		// Set up the timeout to actually send the notifications
		if(!notificationTimer) {
			triggeredNotifications = [];
			untriggeredNotifications = notificationCallbacks.slice(); // Make a shallow copy of the notifications
			notificationTimer = window.setTimeout($tw.store.sendNotifications,0);
		}
		for(var t=untriggeredNotifications.length-1; t>=0; t--) {
			var n = untriggeredNotifications[t];
			if($tw(tiddler).filter(n.selector).length === 1) {
				triggeredNotifications.push(n);
				untriggeredNotifications = $tw.utils.arrayRemove(untriggeredNotifications,t,t+1)
			}
		}
	};
	
	$tw.store.sendNotifications = function() {
console.log("Sending notifications");
		notificationTimer = null;
		// TODO: Rather than locking the entire store, we should handle updates during notification processing
		locked = true;
		for(var t=triggeredNotifications.length-1; t>=0; t--) {
			var n = triggeredNotifications[t];
			n.callback();
		}
		locked = false;
	};
	
	// Put a tiddler revision to the store. It will be added as a new revision if the tiddler already exists. If a
	// revision number is specified then the tiddler is added at that revision.
	// Returns the $tw.Tiddler object if successful, or null if it failed
	$tw.store.storeTiddler = function(fields) {
		var tiddler;
		if(fields instanceof $tw.Tiddler) {
			tiddler = fields;
		} else {
			tiddler = new $tw.Tiddler(fields);
		}
		// Get the title and revision
		var title = tiddler.fields.title;
		if(title === undefined || title === "" || typeof title !== "string")
			return null;
		var revision = Number(tiddler.fields.revision);
		// Check if the tiddler exists
		if(title in tiddlers) {
			tiddlers[title]= tiddler;
		} else {
			tiddlers[title] = tiddler;
		}	
		$tw.store.registerModification(tiddler);
		return tiddler;
	};
	
	$tw.store.getAllTiddlers = function() {
		var result = [];
		for(var t in tiddlers) {
			result.push(tiddlers[t]);
		}
		return result;
	};
	
	$tw.store.getTiddlersByTag = function(tag) {
		var result = [];
		for(var t in tiddlers) {
			if(tiddlers[t].fields.tags && $.inArray(tag,tiddlers[t].fields.tags) != -1)
				result.push(tiddlers[t]);
		}
		return result;
	};
	
	$tw.store.getTiddlersByField = function(field,value) {
		var result = [];
		for(var t in tiddlers) {
			var f = tiddlers[t].fields;
			if(field in f && f[field] === value)
				result.push(tiddlers[t]);
		}
		return result;
	};
	
	$tw.store.getTiddler = function(title,revision,user,source) {
		if(title in tiddlers)
			return tiddlers[title];
		else
			return null;
	};
	
	$tw.store.tiddlerExists = function(title,revision,user,source) {
		return title in tiddlers;
	};
	
	$tw.store.debug = function() {
		$tw.log("Tiddlers in store:",tiddlers);
	};
	
})();
