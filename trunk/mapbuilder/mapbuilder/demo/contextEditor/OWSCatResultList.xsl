<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: presents the list of FeatureTypes from a WFS capabilities doc.
            Links provided to filter and load the selected FeatureType.
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: SelectFeatureType.xsl,v 1.11 2005/08/03 19:07:01 mattdiez Exp $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:owscat="http://www.ec.gc.ca/owscat"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/wfs:FeatureCollection">
    <table>
      <tr>
        <th>
          Search results:
        </th>
      </tr>
      <xsl:apply-templates select="gml:featureMember/owscat:service_resources"/>
    </table>
  </xsl:template>

  <!-- template rule matching source root element -->
  <xsl:template match="owscat:service_resources">
    <xsl:variable name="rowClass">altRow_<xsl:value-of select="position() mod 2"/></xsl:variable>
    <xsl:variable name="abstract" select="owscat:abstract"/>
    <xsl:variable name="name" select="owscat:name"/>
    <tr class="{$rowClass}">
      <td>
        <h4><xsl:value-of select="owscat:title"/></h4>
        <xsl:value-of select="concat(substring($abstract, 0, 200),'...')"/>
        <span class="dataSource">provided by: <xsl:value-of select="owscat:organization"/></span>
      </td>
      <td>
        <a href="javascript:config.objects.addLayer.addLayerFromCat('{$name}')">add to map</a>
      </td>
    </tr>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
