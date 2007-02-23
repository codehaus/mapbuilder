/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class WKT
 *
 * @requires OpenLayers/Writer.js
 */
OpenLayers.Writer.WFS = OpenLayers.Class.create();
OpenLayers.Writer.WFS.prototype = OpenLayers.Class.inherit( OpenLayers.Writer, {

    /**
     * @constructor
     */
    initialize: function(features) {},

    /**
     * Destroy this class.
     */
    destroy: function() {},

    commit: function(uri, features, onSuccess, onFailure) {

        var transaction = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Transaction');

        for (var i=0; i<features.length; i++) {
            switch (features[i].state) {
                case OpenLayers.State.INSERT:
                    transaction.appendChild(this._insert(features[i]));
                    break;
                case OpenLayers.State.UPDATE:
                    transaction.appendChild(this._update(features[i]));
                    break;
                case OpenLayers.State.DELETE:
                    transaction.appendChild(this._delete(features[i]));
                    break;
            }
        }

        if (transaction.childNodes.length == 0) {
            alert("nothing to commit");
            return;
        }

        transaction = OpenLayers.serializeXMLNode(transaction);

        new OpenLayers.Ajax.Request("/geoserver/wfs/transaction",
                                    {
                                        method: 'post',
                                        contenttype: 'text/xml',
                                          parameters: transaction,
                                          onComplete: onSuccess,
                                          onFailure: onFailure
                                    });
    },

    /**
     * @type String
     */
    _insert: function(feature) {
        var insertNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Insert');

        //TBD typename needs to be stored and retrieved from the layer
        // xmlns may be wrong
        var element = document.createElementNS('http://www.opengis.net/wfs', 
                                               feature.layer.params.typename);
        // xmlns may be wrong
        var geometry = document.createElementNS('http://www.opengis.net/wfs', 
                                                feature.layer.params.geometry_column);

        var gml = new OpenLayers.Writer.GML();
        gml.buildXmlNode(feature.geometry);

        geometry.appendChild(gml.gml);
        element.appendChild(geometry);
        insertNode.appendChild(element);

        return insertNode;
    },

    /**
     * @type String
     */
    _update: function(feature) {
        var updateNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Update');
        updateNode.setAttribute("typeName", feature.attributes.featureMember.childNodes[0].nodeName);

        var propertyNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Property');
        var nameNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Name');

        // TBD get the geometry field name
        var txtNode = document.createTextNode(feature.layer.params.geometry_column);
        nameNode.appendChild(txtNode);
        propertyNode.appendChild(nameNode);

        var valueNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Value');

        var gml = new OpenLayers.Writer.GML();
        gml.buildXmlNode(feature.geometry);
        valueNode.appendChild(gml.gml);

        propertyNode.appendChild(valueNode);
        updateNode.appendChild(propertyNode);

        var filterNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:Filter');
        var filterIdNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:FeatureId');
        filterIdNode.setAttribute("fid", feature.attributes.featureMember.childNodes[0].attributes['fid'].nodeValue);
        filterNode.appendChild(filterIdNode);
        updateNode.appendChild(filterNode);

        return updateNode;
    },

    /**
     * @type String
     */
    _delete: function(feature) {
        var deleteNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Delete');
        deleteNode.setAttribute("typeName", feature.attributes.featureMember.childNodes[0].nodeName);

        var filterNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:Filter');
        var filterIdNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:FeatureId');
        filterIdNode.setAttribute("fid", feature.attributes.featureMember.childNodes[0].attributes['fid'].nodeValue);
        filterNode.appendChild(filterIdNode);
        deleteNode.appendChild(filterNode);

        return deleteNode;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Writer.WFS"
});
