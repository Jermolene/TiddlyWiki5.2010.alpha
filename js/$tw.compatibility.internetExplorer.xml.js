(function() {

	// Add a DOMParser object if it doesn't already exist
	if(window.DOMParser === undefined && window.ActiveXObject) {
		window.DOMParser = function() {};
		window.DOMParser.prototype.parseFromString = function(xml) {
			var doc = new ActiveXObject('MSXML.DomDocument');
	        doc.async = false;
	        doc.loadXML(xml);
			return doc;
		};
	}

	// Define node constants if needed
	if (!document.ELEMENT_NODE) {
		document.ELEMENT_NODE = 1;
		document.ATTRIBUTE_NODE = 2;
		document.TEXT_NODE = 3;
		document.CDATA_SECTION_NODE = 4;
		document.ENTITY_REFERENCE_NODE = 5;
		document.ENTITY_NODE = 6;
		document.PROCESSING_INSTRUCTION_NODE = 7;
		document.COMMENT_NODE = 8;
		document.DOCUMENT_NODE = 9;
		document.DOCUMENT_TYPE_NODE = 10;
		document.DOCUMENT_FRAGMENT_NODE = 11;
		document.NOTATION_NODE = 12;
	}

	// Add an importNode() method if it doesn't already exist
	// Thanks to Anthony T. Holdener III, http://www.alistapart.com/articles/crossbrowserscripting
	if(document.importNode === undefined) {
		var myImportNode = function(node, allChildren) {
			/* find the node type to import */
			switch (node.nodeType) {
				case document.ELEMENT_NODE:
					/* create a new element */
					var newNode = document.createElement(node.nodeName);
					/* does the node have any attributes to add? */
					if (node.attributes && node.attributes.length > 0)
						/* add all of the attributes */
						for (var i = 0, il = node.attributes.length; i < il;)
							newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i++].nodeName));
					/* are we going after children too, and does the node have any? */
					if (allChildren && node.childNodes && node.childNodes.length > 0)
						/* recursively get all of the child nodes */
						for (var i = 0, il = node.childNodes.length; i < il;)
							newNode.appendChild(myImportNode(node.childNodes[i++], allChildren));
					return newNode;
					break;
				case document.TEXT_NODE:
				case document.CDATA_SECTION_NODE:
				case document.COMMENT_NODE:
					return document.createTextNode(node.nodeValue);
					break;
			}
		};
		document.importNode = myImportNode;
	}
	
})();
