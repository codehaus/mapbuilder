<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs" xmlns:topp="http://www.openplans.org/topp" version="1.0">

<!--
Description: Convert a GML FeatureInfoResponse or FeatureCollection into a OL popup text.
Author:      Andreas Hocevar
$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- params for this widget -->
  <xsl:param name="fid"/>

  <!-- Main html - It matches only non-empty results -->
  <xsl:template match="/">
  	<div style='text-align: cursor: default; center; position:relative; overflow:auto; height:100%; width:100%'>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- featureInfo -->
  <xsl:template match="wfs:FeatureCollection/gml:featureMember">
  	<xsl:if test="*[@fid=$fid]">
  	  <table border="1">
  	  <xsl:for-each select="*/topp:*">
  	    <xsl:if test="name() != 'topp:the_geom'">
   	    <tr>
  	      <td valign="top"><xsl:value-of select='name()'/></td><td><xsl:value-of select="."/></td>
  	    </tr>
  	    </xsl:if>
  	  </xsl:for-each>
  	  </table>
  	  </xsl:if>
  </xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
