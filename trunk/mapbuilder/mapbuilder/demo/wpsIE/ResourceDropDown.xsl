<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate an array of DHTML layers.
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id: owsMapPane.xsl,v 1.9 2005/03/30 20:27:03 camerons Exp $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:ows="http://www.opengis.net/ows"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xlink="http://www.w3.org/1999/xlink" exclude-result-prefixes="wmc xlink">

  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="selectName">resourceSelect</xsl:param>

  <!-- template rule matching source root element -->
  <xsl:template match="/wmc:OWSContext">
      <select name="{$selectName}" onchange="javascript:config.objects.{$widgetId}.selectResource(this.options[this.selectedIndex].value);" >
        <option value="">Select a map resource</option>
        <xsl:apply-templates select="wmc:ResourceList/*"/>
      </select>
  </xsl:template>
  
  <!-- these handled outside of the stylesheet -->
  <xsl:template match="wmc:Coverage">
    <option>
      <xsl:attribute name="value">wcs_<xsl:value-of select="wmc:Name"/></xsl:attribute>
      WCS: <xsl:value-of select="wmc:Title"/>
    </option>
  </xsl:template>
  
  <xsl:template match="wmc:FeatureType">
    <xsl:choose>
      <xsl:when test="wmc:Server/@service='OGC:GML'">
        <option>
          <xsl:attribute name="value">gml_<xsl:value-of select="wmc:Name"/></xsl:attribute>
          GML: <xsl:value-of select="wmc:Title"/>
        </option>
      </xsl:when>
      <xsl:otherwise>
        <option>
          <xsl:attribute name="value">wfs_<xsl:value-of select="wmc:Name"/></xsl:attribute>
          WFS: <xsl:value-of select="wmc:Title"/>
        </option>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="wmc:Layer">
    <option>
      <xsl:attribute name="value">wms_<xsl:value-of select="wmc:Name"/></xsl:attribute>
      WMS: <xsl:value-of select="wmc:Title"/>
    </option>
  </xsl:template>

</xsl:stylesheet>
