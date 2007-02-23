/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class GML
 * 
 */
OpenLayers.Writer.GML = OpenLayers.Class.create();
OpenLayers.Writer.GML.prototype = {
    
    /** @type {XMLNode} */
    gml: '',
    
    /** 
     * @constructor
     */
    initialize: function() {},

    /** 
     * builds a GML file with a given geometry
     * 
     * @param {OpenLayers.Geometry} geometry
     */
    buildXmlNode: function(geometry) {
    // TBD test if geoserver can be given a Multi-geometry for a simple-geometry data store
    // ie if multipolygon can be sent for a polygon feature type
        
        // match MultiPolygon or Polygon
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon"
            || geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                this.gml = document.createElementNS("http://www.opengis.net/gml", 'gml:MultiPolygon');
                
                // TBD retrieve the srs from layer
                this.gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                
                var polygonMember = document.createElementNS("http://www.opengis.net/gml", 'gml:polygonMember');
                
                var polygon = document.createElementNS("http://www.opengis.net/gml", 'gml:Polygon');
                var outerRing = document.createElementNS("http://www.opengis.net/gml", 'gml:outerBoundaryIs');
                var linearRing = document.createElementNS("http://www.opengis.net/gml", 'gml:LinearRing');
                
                // TBD manage polygons with holes
                linearRing.appendChild(this.buildCoordinatesNode(geometry.components[0]));
                outerRing.appendChild(linearRing);
                polygon.appendChild(outerRing);
                polygonMember.appendChild(polygon);
                
                this.gml.appendChild(polygonMember);
            }
        // match MultiLineString or LineString
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString"
                 || geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                     this.gml = document.createElementNS("http://www.opengis.net/gml", 'gml:MultiLineString');
                     
                     // TBD retrieve the srs from layer
                     this.gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                     
                     var lineStringMember = document.createElementNS("http://www.opengis.net/gml", 'gml:lineStringMember');
                     
                     var lineString = document.createElementNS("http://www.opengis.net/gml", 'gml:LineString');
                     
                     lineString.appendChild(this.buildCoordinatesNode(geometry));
                     lineStringMember.appendChild(lineString);
                     
                     this.gml.appendChild(lineStringMember);
                 }
        // match MultiPoint or Point
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint"
                 || geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                     this.gml = document.createElementNS("http://www.opengis.net/gml", 'gml:MultiPoint');
                     
                     // TBD retrieve the srs from layer
                     this.gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                     
                     var polygonMember = document.createElementNS("http://www.opengis.net/gml", 'gml:polygonMember');
                     
                     var polygon = document.createElementNS("http://www.opengis.net/gml", 'gml:Polygon');
                     
                     polygon.appendChild(this.buildCoordinatesNode(geometry));
                     polygonMember.appendChild(polygon);
                     
                     this.gml.appendChild(polygonMember);
                 }
    },
    
    /**
     * builds the coordinates XmlNode
     * <gml:coordinates decimal="." cs="," ts=" ">...</gml:coordinates>
     *
     * @param {OpenLayers.Geometry} geometry
     * @return {XmlNode} created xmlNode
     */
    buildCoordinatesNode: function(geometry) {
        var coordinatesNode = document.createElementNS("http://www.opengis.net/gml", "gml:coordinates");
        coordinatesNode.setAttribute("decimal", ".");
        coordinatesNode.setAttribute("cs", ",");
        coordinatesNode.setAttribute("ts", " ");
        
        if (geometry.components) {
            var points = geometry.components[0].path;
        } else {
            var points = geometry.path;
        }

        var path = "";
        for (var i = 0; i < points.length; i++) {
            path += points[i].lon + "," + points[i].lat + " ";
        }
        
        var txtNode = document.createTextNode(path);
        coordinatesNode.appendChild(txtNode);
        
        return coordinatesNode;
    },
    
    CLASS_NAME: "OpenLayers.Writer.GML"
}