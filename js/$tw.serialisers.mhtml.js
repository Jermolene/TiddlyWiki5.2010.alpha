$tw.serialisers.mhtml = {
	nodeType: 8 /* Node.COMMENT_NODE */
};

(function() {
	
	var startMarker = "Content-Type: multipart/related; boundary=\"_tw_mhtml_tiddler\"";
	var boundaryMarker = "--_tw_mhtml_tiddler";
	var boundaryMarker_SGML = "_tw_mhtml_tiddler"; // SGMLesque browsers like Opera drop the "--" out of comment nodes (see opening paras of http://www.howtocreate.co.uk/SGMLComments.html)

	$tw.serialisers.mhtml.loadTiddler = function(elem) {
		var comment = elem.data; // TODO: allow for >64K by reading chunks with elem.substringData(offset,length)
		var startPos = comment.indexOf(startMarker);
		if(startPos == -1)
		 	return false;
		comment = comment.substring(startPos + startMarker.length);
		var files = comment.split(boundaryMarker);
		if(files.length == 1)
			files = comment.split(boundaryMarker_SGML);
		var result = [];
		for(var f=0; f<files.length; f++) {
			var fileFields = $tw.serialisers.mhtml.readFile(files[f]);
			if(fileFields !== false)
				result.push(fileFields);
		}
		return result;
	};
	
	$tw.serialisers.mhtml.readFile = function(commentFragment) {
		var parts = commentFragment.split("\n\n");
		if(parts.length < 2)
		 	return false;
		var fields = $tw.utils.parseFields(parts[0]);
		fields.unshift(
			{n: "format", v: "mhtml"},
			{n: "title", v: $tw.utils.searchFields(fields,"Content-Location")},
			{n: "type", v: $tw.utils.searchFields(fields,"Content-Type")},
			{n: "text", v: $.trim(parts[1])}
			);
		var result = new $tw.Tiddler(fields);
		return result;
	};

})();
