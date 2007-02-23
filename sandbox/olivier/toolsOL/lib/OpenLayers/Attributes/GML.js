/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Store Attributes in GML format. Attributes are stored as GML so that the
 * GML is not parsed until the GML is rendered. This speeds up initialization.
 * @class
 *
 * @requires OpenLayers/Layer/Vector.js
 */
OpenLayers.Attributes.GML = OpenLayers.Class.create();
OpenLayers.Attributes.GML.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Attributes, {

    /**
     * Build an Attribute List from a FeatureMember.
     * @constructor
     * @param {Node} featureMember
     */
    initialize: function(featureMember) {
        this.featureMember=featureMember;
    },
	
	/**
	 * Destroy this object.
	 */
	destroy: function(){
        this.featureMember=null;
        OpenLayers.Attributes.prototype.destroy.apply(this);
	},

	/**
	 * Get an array of attributes as (name,value) pairs.
	 * Returns an empty array if none exist.
	 * @return {Array} An array of attributes.
	 */
	getAttributes: function(){
		if(!this.attributes){
			// Parse GML
			if(this.featureMember){
				this.getLeafNodes(this.featureMember);
			}else{
				this.attributes=new Array();
			}
		}
		return OpenLayers.Attributes.prototype.getAttributes.apply(this);
	},
	
	/**
	 * Get leaf nodes from XML and assign them as attributes.
	 * Recursively calls itself by walking down the tree.
	 * @private
	 * @param parentNode XML node to extract leaf nodes from.
	 */
	getLeafNodes: function(parentNode){
		var nodes=parentNode.childNodes;
		for(var i=0;i<nodes.length;i++){
			var value=OpenLayers.Util.getXmlNodeValue(nodes[i]);
			var name=nodes[i].nodeName;
			// Ignore Geometry attributes
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
			if((name.search(":pos")!=-1)
			  ||(name.search(":posList")!=-1)
			  ||(name.search(":coordinates")!=-1)){
				return;
			}
			
			// Check for a leaf node
			if((nodes[i].childNodes.length==1 && nodes[i].childNodes[0].nodeName=="#text")
			||(nodes[i].childNodes.length==0 && nodes[i].nodeName!="#text")){
				this.addAttributes([{label: name, value: value}]);
			}
			this.getLeafNodes(nodes[i]);
		}
	},

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.GML"
    });
