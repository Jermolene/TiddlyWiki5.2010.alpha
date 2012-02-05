$tw.Tiddler = function(fieldList) {
	this.fields = {};
	for(var t=0; t<fieldList.length; t++) {
		var n = fieldList[t].n;
		var v = fieldList[t].v;
		if(n in $tw.Tiddler.incomingFieldRules) {
			var r = $tw.Tiddler.incomingFieldRules[n];
			switch(r.type) {
				case "array":
					if(this.fields[r.fieldName] === undefined)
						this.fields[r.fieldName] = [];
					this.fields[r.fieldName].push(v);
					break;
			}
		} else if (this.fields[n] === undefined) {
			this.fields[n] = v;
		}
	}
	this.title = this.fields.title;
	this.cache = {};
};

$tw.Tiddler.incomingFieldRules = {
	tag: {type: "array", fieldName: "tags"}
};

$tw.Tiddler.outgoingFieldRules = {
	tags: {type: "array", fieldName: "tag"}
};

$tw.Tiddler.prototype.toFieldList = function(excludeNames) {
	var result = [];
	for(var n in this.fields) {
		var v = this.fields[n];
		if(!$.inArray(n,excludeNames) && typeof v !== "function") {
			if(n in $tw.Tiddler.outgoingFieldRules) {
				var r = $tw.Tiddler.outgoingFieldRules;
				switch(r.type) {
					case "array":
						for(var t=0; t<v.length; t++)
							result.push({n: r.fieldName, v: v[t]});
						break;
				}
			} else {
				result.push({n: n, v: v});
			}
		}
	}
	return result;
};

// Get a particular field from a tiddler, only fetching lazy ones if "full" is true
$tw.Tiddler.prototype.getField = function(field,full) {
	var v = this.fields[field];
	if(typeof v === "function") {
		if(full) {
			v = v();
			this.fields[field] = v;
			return v;
		} else {
			return undefined;
		}
	} else {
		return v;
	}
};

$tw.Tiddler.prototype.getText = function() {
	return this.getField("text",true);
}

// Get the fields from a tiddler, only including the lazy ones if "full" is true
$tw.Tiddler.prototype.getFields = function(full) {
	var result = {};
	for(var n in this.fields) {
		var v = this.fields[n];
		if(typeof v === "function") {
			if(full) {
				v = v();
				this.fields[n] = v;
				result[n] = v;
			}
		} else {
			result[n] = v;
		}
	}
	return result;
};

// Returns -1 if the specified field is less than that of another tiddler, 0 if they are the same, +1 if the specified one is higher
$tw.Tiddler.prototype.compareTo = function(that,field,caseSensitive) {
	var fieldA = this.fields[field], fieldB = that.fields[field];
	if(!caseSensitive) {
		fieldA = (typeof fieldA === "string") ? fieldA.toLowerCase() : fieldA;
		fieldB = (typeof fieldB === "string") ? fieldB.toLowerCase() : fieldB;
	}
	if(fieldA < fieldB)
		return -1;
	if(fieldA > fieldB)
		return 1;
	return 0;
	
};

$tw.Tiddler.renderers = {
	"text/plain": function() {
		return $("<div/>").text(this.getText()).contents();
	},
	"text/html": function() {
		return $("<div/>").html(this.getText()).contents();
	},
	"text/css": function() {
		return $("<pre/>").text(this.getText());
	},
	"text/json": function() {
		return $("<pre/>").text(this.getText());
	},
	"text/javascript": function() {
		return $("<pre/>").text(this.getText());
	}
}

$tw.Tiddler.prototype.toHtml = function() {
	var renderer = $tw.Tiddler.renderers[this.fields.type] || $tw.Tiddler.renderers["text/plain"];
	return renderer.call(this);
};

$tw.Tiddler.prototype.toJson = function() {
	if(!this.cache.json) {
		try {
			this.cache.json = JSON.parse(this.getText());
		} catch(e) {
			$tw.log("Cannot parse JSON from",this.title);
		}
	}
	return this.cache.json;
};