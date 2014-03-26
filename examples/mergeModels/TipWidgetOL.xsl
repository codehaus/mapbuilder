<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:pmb="http://nsuri.notld/poweredByMapbuilder" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs" xmlns:topp="http://www.openplans.org/topp" version="1.0">

<!--
Description: Convert a GML FeatureInfoResponse or FeatureCollection into a OL popup text.
Author:      Andreas Hocevar
$Id$
-->

  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>

  <!-- Common params for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- params for this widget -->
  <xsl:param name="fid"/>

  <!-- Main html - It matches only non-empty results -->
  <xsl:template match="/">
  	<div class="PopupContainer">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- featureInfo -->
  <xsl:template match="wfs:FeatureCollection/gml:featureMember">
  	<xsl:if test="*[@fid=$fid]">
      <xsl:value-of select="*[@fid=$fid]//pmb:name"/>
 	  </xsl:if>
  </xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
