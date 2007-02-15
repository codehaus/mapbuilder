/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
/**
 * @class WKT builds a feature from a parsed WKT.
 * 
 * @requires OpenLayers/Parser.js
 */
OpenLayers.Parser.GML = OpenLayers.Class.create();
OpenLayers.Parser.GML.prototype = OpenLayers.Class.inherit( OpenLayers.Parser, {
      
    /* TODO use an option parameter to set the type of geometry
     * see WFS.js (featureClass)
     * Cameron: I disagree. The geometryType is determined from the GML.
     */
    
    /** @type array */
    featureCollection: [],
    
    /** 
     * @constructor
     */
    initialize: function() {},

    /** 
     * loads an GML file and build the featureCollection
     * 
     * @param {XMLNode} xmlNode A GML file as an XML node.
     */
    load: function(xmlNode) {
        var newArguments = arguments;
        
        // pgiraud : should not have to be initialized
        this.featureCollection = [];
        var featureNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml","gml", "featureMember");

        // Determine dimension of the FeatureCollection. Ie, dim=2 means (x,y) coords
        // dim=3 means (x,y,z) coords
        // GML3 can have 2 or 3 dimensions. GML2 only 2.
        var dim;
        var coordNodes=OpenLayers.Ajax.getElementsByTagNameNS(featureNodes[0], "http://www.opengis.net/gml","gml", "posList");
        if(coordNodes.length==0)coordNodes=OpenLayers.Ajax.getElementsByTagNameNS(featureNodes[0], "http://www.opengis.net/gml","gml", "pos");
        if(coordNodes.length>0){
            dim=coordNodes[0].getAttribute("srsDimension");
        }
        this.dim=(dim=="3"||dim==3)?3:2;
        
        // Process all the featureMembers
        for (var i=0; i < featureNodes.length; i++) {
            var feature = this.processXMLNode(featureNodes[i]);

            if (feature) {
                this.featureCollection.push(feature);
                
                // Set Attributes for this class
                attributes=new OpenLayers.Attributes.GML(featureNodes[i]);
                feature.setAttributes(attributes);
            }
        }
    },
    
    /**
     * Destroy this class.
     */
    destroy: function() {
        this.featureCollection = [];
        OpenLayers.Parser.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Extract Geometry from a FeatureMember and return in a
     * Feature class. If no Geometry is found, and empty Feature
     * class is returned.
     * @param {XMLNode} xmlNode A GML FeatureMemeber as an XMLNode.
     * @return A Feature with Geometry added to it.
     * @type OpenLayers.Feature
     * TBD: We have made the assumption that there is only one shape/geometry.
     * We have not addressed, MultiLine, MultiPoint etc geometries.
     * We have not addressed inner/outer rings.
     */
    processXMLNode: function(xmlNode) {

        var geom;
        var p; // [points,bounds]
        var feature = new OpenLayers.Feature();
        feature.toState(OpenLayers.State.UNKNOWN);
        
        // match MultiPolygon
        if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml", "gml", "MultiPolygon").length != 0) {
            var multipolygon = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml", "gml", "MultiPolygon")[0];
            geom = new OpenLayers.Geometry.MultiPolygon();
            var polygons = OpenLayers.Ajax.getElementsByTagNameNS(multipolygon,
                "http://www.opengis.net/gml", "gml", "Polygon");
            for (var i = 0; i < polygons.length; i++) {
                polygon = this.parsePolygonNode(polygons[i],geom);
                geom.addComponents(polygon);
                geom.extendBounds(polygon.getBounds());
            }
        }
        // match MultiLineString
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            "http://www.opengis.net/gml", "gml", "MultiLineString").length != 0) {
            var multilinestring = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            "http://www.opengis.net/gml", "gml", "MultiLineString")[0];
            
            geom = new OpenLayers.Geometry.MultiLineString();
            var lineStrings = OpenLayers.Ajax.getElementsByTagNameNS(multilinestring, "http://www.opengis.net/gml", "gml", "LineString");
            
            for (var i = 0; i < lineStrings.length; i++) {
                p=this.parseCoords(lineStrings[i]);
                if(p.points){
                    var lineString = new OpenLayers.Geometry.LineString(p.points);
                    geom.addComponents(lineString);
                    // TBD Bounds only set for one of multiple geometries
                    geom.extendBounds(p.bounds);
                }
            }
        }
        // match MultiPoint
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            "http://www.opengis.net/gml", "gml", "MultiPoint").length != 0) {
            var multiPoint = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                "http://www.opengis.net/gml", "gml", "MultiPoint")[0];
                
            geom = new OpenLayers.Geometry.MultiPoint();
            
            var points = OpenLayers.Ajax.getElementsByTagNameNS(multiPoint, "http://www.opengis.net/gml", "gml", "Point");
            
            for (var i = 0; i < points.length; i++) {
                p = this.parseCoords(points[i]);
                geom.addComponents(p.points[0]);
                // TBD Bounds only set for one of multiple geometries
                geom.extendBounds(p.bounds);
            }
        }
        // match Polygon
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            "http://www.opengis.net/gml", "gml", "Polygon").length != 0) {
            var polygon = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                "http://www.opengis.net/gml", "gml", "Polygon")[0];
            
            geom = this.parsePolygonNode(polygon);
        }
        // match LineString
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            "http://www.opengis.net/gml", "gml", "LineString").length != 0) {
            var lineString = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                "http://www.opengis.net/gml", "gml", "LineString")[0];
            p = this.parseCoords(lineString);
            if (p.points) {
                geom = new OpenLayers.Geometry.LineString(p.points);
                // TBD Bounds only set for one of multiple geometries
                geom.extendBounds(p.bounds);
            }
        }
        // match Point
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            "http://www.opengis.net/gml", "gml", "Point").length != 0) {
            var point = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                "http://www.opengis.net/gml", "gml", "Point")[0];
            
            p = this.parseCoords(point);
            if (p.points) {
                geom = p.points[0];
                // TBD Bounds only set for one of multiple geometries
                geom.extendBounds(p.bounds);
            }
        }
        
        feature.setGeometry(geom);
        return feature;
    },
    
    /**
     *
     * @param {XMLNode} xmlNode 
     *
     * @return {OpenLayers.Geometry.Polygon} polygon geometry
     */
    parsePolygonNode: function(polygonNode) {
        var linearRings = OpenLayers.Ajax.getElementsByTagNameNS(polygonNode,
            "http://www.opengis.net/gml", "gml", "LinearRing");
        
        var rings = [];
        var p;
        var polyBounds;
        for (var i = 0; i < linearRings.length; i++) {
            p = this.parseCoords(linearRings[i]);
            ring1=new OpenLayers.Geometry.LinearRing(p.points);
            ring1.extendBounds(p.bounds);
            if(polyBounds){
                polyBounds.extendBounds(p.bounds);
            }else{
                polyBounds=p.bounds;
            }
            rings.push(ring1);
        }
        
        var poly=new OpenLayers.Geometry.Polygon(rings);
        poly.extendBounds(polyBounds);
        return poly;
    },
    
    /**
     * Extract Geographic coordinates from an XML node.
     * @private
     * @param {XMLNode} xmlNode 
     * 
     * @return an array of OpenLayers.Geometry.Point points.
     * @type Array
     */
    parseCoords : function(xmlNode) {
//        var geom = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml", "gml", geomType);
        var x,y,left,bottom,right,top,bounds;
        var p=new Array(); // return value = [points,bounds]
        
        if (xmlNode) {
            p.points=new Array();
            
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
            // Note: GML2 coordinates are of the form:x y,x y,x y
            // GML2 can also be of the form <coord><x>1</x><y>2</y></coord>
            //       GML3 posList is of the form:x y x y. OR x y z x y z.
            
            // GML3 Line or Polygon
            var coordNodes=OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml","gml", "posList");
            
            // GML3 Point
            if(coordNodes.length==0)coordNodes=OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml","gml", "pos");

            // GML2
            if(coordNodes.length==0)coordNodes=OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml","gml", "coordinates");

            // TBD: Need to handle an array of coordNodes not just coordNodes[0]
            
            var coordString=OpenLayers.Util.getXmlNodeValue(coordNodes[0]);
            
            // Extract an array of Numbers from CoordString
            var nums = (coordString)?coordString.split(/[, \n\t]+/):new Array();
            
            // Remove elements caused by leading and trailing white space
            while ( nums[0]== "" ) nums.shift();
            while ( nums[nums.length-1] == "" ) nums.pop();
            
            for(i=0; i<nums.length;i=i+this.dim) {
                x=parseFloat(nums[i]);
                y=parseFloat(nums[i+1]);
                p.points.push(new OpenLayers.Geometry.Point(x,y));
                
                if(!p.bounds){
                    p.bounds=new OpenLayers.Bounds(x,y,x,y);
                }else{
                    p.bounds.extendBounds(x,y);
                }
            }
        }
        return p;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Parser.GML"
});
