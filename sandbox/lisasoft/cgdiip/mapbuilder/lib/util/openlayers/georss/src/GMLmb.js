/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Format.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Ajax.js
 * @requires OpenLayers/Geometry.js
 *
 * Class: OpenLayers.Format.GML
 * Read/Wite GML. Create a new instance with the <OpenLayers.Format.GML>
 *     constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Format>
 */
OpenLayers.Format.GMLmb = OpenLayers.Class(OpenLayers.Format, {
    
    /*
     * APIProperty: featureNS
     * Namespace used for feature attributes. Default matches the NS
     * used by MapServer output.
     */
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
    /*
     * APIProperty: featureName
     * element name for features. Default is 'featureMember'.
     */
    featureName: "featureMember", 
    
    /*
     * APIProperty: layerName
     * Name of data layer. Default is 'features'.
     */
     
    layerName: "features",
    
    /**
     * APIProperty: geometry
     * Name of geometry element.
     */
    geometryName: "geometry",
    
    /** 
     * APIProperty: collectionName
     * Name of featureCollection element
     */
    collectionName: "FeatureCollection",
    
    /**
     * APIProperty: gmlns
     * GML Namespace
     */
    gmlns: "http://www.opengis.net/gml",
    

    /**
     * APIProperty: extractAttributes
     * {Boolean} Extract attributes from GML. Most of the time, this is a
     * significant time usage, due to the need to recursively descend the XML
     * to search for attributes.
     */
    extractAttributes: true,
    
    
    /**
     * Constructor: OpenLayers.Format.GML
     * Create a new parser for GML
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *                    this instance.
     */
    initialize: function(options) {
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: read
     * Read data from a string, and return a list of features. 
     * 
     * Parameters:
     * data - {String} or {XMLNode} data to read/parse.
     */
     read: function(data) {
        if (typeof data == "string") { 
            data = OpenLayers.parseXMLString(data);
        }    
        var featureNodes = OpenLayers.Ajax.getElementsByTagNameNS(data, this.gmlns, "gml", this.featureName);
        if (featureNodes.length == 0) { return []; }

        // Determine dimension of the FeatureCollection. Ie, dim=2 means (x,y) coords
        // dim=3 means (x,y,z) coords
        // GML3 can have 2 or 3 dimensions. GML2 only 2.
        var dim;
        var coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(featureNodes[0], this.gmlns, "gml", "posList");
        if (coordNodes.length == 0) {
            coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(featureNodes[0], this.gmlns, "gml", "pos");
        }
        if (coordNodes.length > 0) {
            dim = coordNodes[0].getAttribute("srsDimension");
        }    
        this.dim = (dim == "3" || dim == 3) ? 3 : 2;
        
        var features = [];
        
        // Process all the featureMembers
        for (var i = 0; i < featureNodes.length; i++) {
            var feature = this.parseFeature(featureNodes[i]);

            if (feature) {
                features.push(feature);
            }
        }
        return features;
     },

     /**
      * Method: parseFeature
      * This function is the core of the GML parsing code in OpenLayers.
      * It creates the geometries that are then attached to the returned
      * feature, and calls parseAttributes() to get attribute data out.
     
      * Parameters:
      * xmlNode - {<DOMElement>} 
      */
     parseFeature: function(xmlNode) {
     	   	
        var geom;
        var p; // [points,bounds]

        var feature = new OpenLayers.Feature.Vector();

        // match MultiPolygon
        if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "MultiPolygon").length != 0) {
            var multipolygon = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "MultiPolygon")[0];
            //feature.fid = multipolygon.parentNode.parentNode.getAttribute('fid');
            
            feature.fid = this.getFidRSS(multipolygon);

            geom = new OpenLayers.Geometry.MultiPolygon();
            var polygons = OpenLayers.Ajax.getElementsByTagNameNS(multipolygon,
                this.gmlns, "gml", "Polygon");
            for (var i = 0; i < polygons.length; i++) {
                polygon = this.parsePolygonNode(polygons[i],geom);
                geom.addComponents(polygon);
            }
        }
        // match MultiLineString
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "MultiLineString").length != 0) {
            var multilinestring = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "MultiLineString")[0];
            //feature.fid = multilinestring.parentNode.parentNode.getAttribute('fid');
            
            feature.fid = this.getFidRSS(multilinestring);
            
            geom = new OpenLayers.Geometry.MultiLineString();
            var lineStrings = OpenLayers.Ajax.getElementsByTagNameNS(multilinestring, this.gmlns, "gml", "LineString");
            
            for (var i = 0; i < lineStrings.length; i++) {
                p = this.parseCoords(lineStrings[i]);
                if(p.points){
                    var lineString = new OpenLayers.Geometry.LineString(p.points);
                    geom.addComponents(lineString);
                    // TBD Bounds only set for one of multiple geometries
                }
            }
        }
        // match MultiPoint
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "MultiPoint").length != 0) {
            var multiPoint = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "MultiPoint")[0];
            //feature.fid = multiPoint.parentNode.parentNode.getAttribute('fid');
              
            feature.fid = this.getFidRSS(multiPoint);
                
            geom = new OpenLayers.Geometry.MultiPoint();
            
            var points = OpenLayers.Ajax.getElementsByTagNameNS(multiPoint, this.gmlns, "gml", "Point");
            
            for (var i = 0; i < points.length; i++) {
                p = this.parseCoords(points[i]);
                geom.addComponents(p.points[0]);
                // TBD Bounds only set for one of multiple geometries
            }
        }
        // match Polygon
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "Polygon").length != 0) {
            var polygon = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "Polygon")[0];
            //feature.fid = polygon.parentNode.parentNode.getAttribute('fid');
            
            feature.fid = this.getFidRSS(polygon);
            
            geom = this.parsePolygonNode(polygon);
        }
        // match LineString
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "LineString").length != 0) {
            var lineString = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "LineString")[0];
            //feature.fid = lineString.parentNode.parentNode.getAttribute('fid');

			feature.fid = this.getFidRSS(lineString);

            p = this.parseCoords(lineString);
            if (p.points) {
                geom = new OpenLayers.Geometry.LineString(p.points);
                // TBD Bounds only set for one of multiple geometries
            }
        }
        // match Point
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "Point").length != 0) {
            var point = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "Point")[0];
            //feature.fid = point.parentNode.parentNode.getAttribute('fid');
            
            feature.fid = this.getFidRSS(point);
            
            p = this.parseCoords(point);
            if (p.points) {
                geom = p.points[0];
                // TBD Bounds only set for one of multiple geometries
            }
        }
		// match Envelope
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "Envelope").length != 0) {
			
            var envelope = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "Envelope")[0];
				
            //feature.fid = envelope.parentNode.parentNode.getAttribute('fid');
            
            feature.fid = this.getFidRSS(envelope);
            
            geom = this.parseEnvelope(envelope);
            
        }
        
        feature.geometry = geom; 
        if (this.extractAttributes) {
            feature.attributes = this.parseAttributes(xmlNode);
        }    
        
        return feature;
    },
    
    getFidRSS: function(xmlNode) {
    	//fid = xmlNode.parentNode.parentNode.getAttribute('fid');
    	    	
    	var nodes = xmlNode.parentNode.parentNode.childNodes;
    	
    	for(var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == "id") {
            	var value = OpenLayers.Util.getXmlNodeValue(nodes[i]);
            	//value = hex_md5(value);
            	break;
            }
        }

    	fid = value;
    	
    	return fid;
    },           
    
    /**
     * Method: parseAttributes
     * recursive function parse the attributes of a GML node.
     * Searches for any child nodes which aren't geometries,
     * and gets their value.
     *
     * Parameters:
     * xmlNode - {<DOMElement>} 
     */
    parseAttributes: function(xmlNode) {
        var nodes = xmlNode.childNodes;
        var attributes = {};
        for(var i = 0; i < nodes.length; i++) {
            var name = nodes[i].nodeName;
            var value = OpenLayers.Util.getXmlNodeValue(nodes[i]);
            // Ignore Geometry attributes
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
            if((name.search(":pos")!=-1)
              ||(name.search(":posList")!=-1)
              ||(name.search(":coordinates")!=-1)){
               continue;    
            }
            
            // Check for a leaf node
            if((nodes[i].childNodes.length == 1 && nodes[i].childNodes[0].nodeName == "#text")
                || (nodes[i].childNodes.length == 0 && nodes[i].nodeName!="#text")) {
                attributes[name] = value;
            }
            OpenLayers.Util.extend(attributes, this.parseAttributes(nodes[i]))
        }   
        return attributes;
    },
	
	parseEnvelope: function(xmlNode) {
       
        var envelope;
		
		
        if (xmlNode) {
		
	  		// for evelope
			lower = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "lowerCorner");
			upper = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "upperCorner");
        
            var lowerPoint = this.getPoint(lower);
			var upperPoint = this.getPoint(upper);
			
			var ringArray = [];
			
			ringArray.push(new OpenLayers.Geometry.Point(lowerPoint.points[0].x, lowerPoint.points[0].y));
			ringArray.push(new OpenLayers.Geometry.Point(upperPoint.points[0].x, lowerPoint.points[0].y));
			ringArray.push(new OpenLayers.Geometry.Point(upperPoint.points[0].x, upperPoint.points[0].y));
			ringArray.push(new OpenLayers.Geometry.Point(lowerPoint.points[0].x, upperPoint.points[0].y));
			ringArray.push(new OpenLayers.Geometry.Point(lowerPoint.points[0].x, lowerPoint.points[0].y));
			
			var ring = new OpenLayers.Geometry.LinearRing(ringArray);
        	envelope = new OpenLayers.Geometry.Polygon([ring]);
		
						
			
	    }
		
		return envelope;
    },
	
	getPoint: function(coordNodes) {
		var p = []; // return value = [points,bounds]
		
		p.points=[];
		
		var coordString = OpenLayers.Util.getXmlNodeValue(coordNodes[0]);
            
	    // Extract an array of Numbers from CoordString
	    var nums = (coordString) ? coordString.split(/[, \n\t]+/) : [];
	    
	    // Remove elements caused by leading and trailing white space
	    while (nums[0] == "") 
	        nums.shift();
			    
	    while (nums[nums.length-1] == "") 
	        nums.pop();
		
		for(i = 0; i < nums.length; i = i + this.dim) {
            x = parseFloat(nums[i]);
            y = parseFloat(nums[i+1]);
            p.points.push(new OpenLayers.Geometry.Point(x, y));
        }
		
		return p;
			
	},
	
    
    /**
     * Method: parsePolygonNode
     * 
     * Parameters:
     * xmlNode - {XMLNode} 
     *
     * Returns:
     * {<OpenLayers.Geometry.Polygon>} polygon geometry
     */
    parsePolygonNode: function(polygonNode) {
        var linearRings = OpenLayers.Ajax.getElementsByTagNameNS(polygonNode,
            this.gmlns, "gml", "LinearRing");
        
        var rings = [];
        var p;
        var polyBounds;
        for (var i = 0; i < linearRings.length; i++) {
            p = this.parseCoords(linearRings[i]);
            ring1 = new OpenLayers.Geometry.LinearRing(p.points);
            rings.push(ring1);
        }
        
        var poly = new OpenLayers.Geometry.Polygon(rings);
        return poly;
    },
    
    /**
     * Method: parseCoords
     * Extract Geographic coordinates from an XML node.
     *
     * Parameters:
     * xmlNode - {<XMLNode>} 
     *
     * Returns:
     * An array of <OpenLayers.Geometry.Point> points.
     */
    parseCoords: function(xmlNode) {
        var x, y, left, bottom, right, top, bounds;
        var p = []; // return value = [points,bounds]
        
        if (xmlNode) {
            p.points = [];
            
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
            // Note: GML2 coordinates are of the form:x y,x y,x y
            // GML2 can also be of the form <coord><x>1</x><y>2</y></coord>
            //       GML3 posList is of the form:x y x y. OR x y z x y z.
            
            // GML3 Line or Polygon
            var coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "posList");
            
            // GML3 Point
            if (coordNodes.length == 0) { 
                coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "pos");
            }    

            // GML2
            if (coordNodes.length == 0) {
                coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "coordinates");
            }    

            // TBD: Need to handle an array of coordNodes not just coordNodes[0]
            
            var coordString = OpenLayers.Util.getXmlNodeValue(coordNodes[0]);
            
            // Extract an array of Numbers from CoordString
            var nums = (coordString) ? coordString.split(/[, \n\t]+/) : [];
            
            // Remove elements caused by leading and trailing white space
            while (nums[0] == "") 
                nums.shift();
            
            while (nums[nums.length-1] == "") 
                nums.pop();
            
            for(var i = 0; i < nums.length; i = i + this.dim) {
                x = parseFloat(nums[i]);
                y = parseFloat(nums[i+1]);
                p.points.push(new OpenLayers.Geometry.Point(x, y));
            }
        }
        return p;
    },
    
    /**
     * APIMethod: write
     * Accept Feature Array, and return a string. 
     * 
     * Parameters:
     * features - Array({<OpenLayers.Feature.Vector>}> List of features to
     * serialize into a string.
     */
     write: function(features) {
        var featureCollection = document.createElementNS("http://www.opengis.net/wfs", "wfs:" + this.collectionName);
        for (var i=0; i < features.length; i++) {
            featureCollection.appendChild(this.createFeatureXML(features[i]));
        }
        return featureCollection;
     },
    
    /** 
     * Method: createFeatureXML
     * Accept an OpenLayers.Feature.Vector, and build a geometry for it.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} 
     *
     * Returns:
     * {DOMElement}
     */
    createFeatureXML: function(feature) {
        var geometryNode = this.buildGeometryNode(feature.geometry);
        var geomContainer = document.createElementNS(this.featureNS, "feature:"+this.geometryName);
        geomContainer.appendChild(geometryNode);
        var featureNode = document.createElementNS(this.gmlns, "gml:" + this.featureName);
        var featureContainer = document.createElementNS(this.featureNS, "feature:"+this.layerName);
        featureContainer.appendChild(geomContainer);
        for(var attr in feature.attributes) {
            var attrText = document.createTextNode(feature.attributes[attr]); 
            var nodename = attr;
            if (attr.search(":") != -1) {
                nodename = attr.split(":")[1];
            }    
            var attrContainer = document.createElementNS(this.featureNS, "feature:"+nodename);
            attrContainer.appendChild(attrText);
            featureContainer.appendChild(attrContainer);
        }    
        featureNode.appendChild(featureContainer);
        return featureNode;
    },    
    
    /**
     * Method: buildGeometryNode 
     * builds a GML file with a given geometry
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>} 
     */
    buildGeometryNode: function(geometry) {
    // TBD test if geoserver can be given a Multi-geometry for a simple-geometry data store
    // ie if multipolygon can be sent for a polygon feature type
        var gml = "";
        // match MultiPolygon or Polygon
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon"
            || geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                gml = document.createElementNS(this.gmlns, 'gml:MultiPolygon');
                
                // TBD retrieve the srs from layer
                // srsName is non-standard, so not including it until it's right.
                //gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                
                var polygonMember = document.createElementNS(this.gmlns, 'gml:polygonMember');
                
                var polygon = document.createElementNS(this.gmlns, 'gml:Polygon');
                var outerRing = document.createElementNS(this.gmlns, 'gml:outerBoundaryIs');
                var linearRing = document.createElementNS(this.gmlns, 'gml:LinearRing');
                
                // TBD manage polygons with holes
                linearRing.appendChild(this.buildCoordinatesNode(geometry.components[0]));
                outerRing.appendChild(linearRing);
                polygon.appendChild(outerRing);
                polygonMember.appendChild(polygon);
                
                gml.appendChild(polygonMember);
            }
        // match MultiLineString or LineString
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString"
                 || geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                     gml = document.createElementNS(this.gmlns, 'gml:MultiLineString');
                     
                     // TBD retrieve the srs from layer
                     // srsName is non-standard, so not including it until it's right.
                     //gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                     
                     var lineStringMember = document.createElementNS(this.gmlns, 'gml:lineStringMember');
                     
                     var lineString = document.createElementNS(this.gmlns, 'gml:LineString');
                     
                     lineString.appendChild(this.buildCoordinatesNode(geometry));
                     lineStringMember.appendChild(lineString);
                     
                     gml.appendChild(lineStringMember);
                 }
        // match MultiPoint or Point
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point" || 
                  geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") {
                // TBD retrieve the srs from layer
                // srsName is non-standard, so not including it until it's right.
                //gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                     
                gml = document.createElementNS(this.gmlns, 'gml:MultiPoint');
                var parts = "";
                if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") {
                    parts = geometry.components;
                } else {
                    parts = [geometry];
                }    
                
                for (var i = 0; i < parts.length; i++) { 
                    var pointMember = document.createElementNS(this.gmlns, 'gml:pointMember');
                    var point = document.createElementNS(this.gmlns, 'gml:Point');
                    point.appendChild(this.buildCoordinatesNode(parts[i]));
                    pointMember.appendChild(point);
                    gml.appendChild(pointMember);
               }     
        }
        return gml;         
    },
     
    /**
     * Method: buildCoordinates
     * builds the coordinates XmlNode
     * <gml:coordinates decimal="." cs="," ts=" ">...</gml:coordinates>
     *
     * Parameters: 
     * geometry - {<OpenLayers.Geometry>} 
     *
     * Returns:
     * {XmlNode} created xmlNode
     */
    buildCoordinatesNode: function(geometry) {
        var coordinatesNode = document.createElementNS(this.gmlns, "gml:coordinates");
        coordinatesNode.setAttribute("decimal", ".");
        coordinatesNode.setAttribute("cs", ",");
        coordinatesNode.setAttribute("ts", " ");
        
        var points = null;
        if (geometry.components) {
            points = geometry.components;
        }

        var path = "";
        if (points) {
            for (var i = 0; i < points.length; i++) {
                path += points[i].x + "," + points[i].y + " ";
            }
        } else {
           path += geometry.x + "," + geometry.y + " ";
        }    
        
        var txtNode = document.createTextNode(path);
        coordinatesNode.appendChild(txtNode);
        
        return coordinatesNode;
    },

    CLASS_NAME: "OpenLayers.Format.GMLmb" 
});     
