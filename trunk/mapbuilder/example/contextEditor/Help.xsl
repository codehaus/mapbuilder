<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" >

<!--
Description: Prototype stylesheet to automatically generate a form from an XML doc.
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

XmlForm.xsl,v 1.1 2004/06/28 03:46:49 madair1 Exp
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- The name of the form for coordinate output -->

  <!-- Main html -->
	<xsl:template match="/">
    <div>
    <h2>How to use this page</h2>
      <ol>
        <li>Start by selecting a map to use as your base map from the "Reference maps"</li>
        <li>Search for WMS layers either from the seacrh form or by browsing a list of WMS servers in the "Search for data" menu</li>
        <li>Add in layers of interest to your map</li>
        <li>Add/remove/reorder layers using the "Layer control" tool in the "Edit Map Metadata" menu</li>
        <li>Finally, when the map is ready to be saved, click on the"save" icon on the left side of the map.
            This will save the map as a Web Map Context document which can be used in other applications.</li>
      </ol>
      </div>
  </xsl:template>

	<xsl:template match="text()|@*"/>

</xsl:stylesheet>
