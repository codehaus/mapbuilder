<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate an array of DHTML layers.
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:cml="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="context">config['<xsl:value-of select="$modelId"/>']</xsl:param>

  <xsl:param name="bbox">
    <xsl:value-of select="/cml:OWSContext/cml:General/cml:BoundingBox/@minx"/>,<xsl:value-of select="/cml:OWSContext/cml:General/cml:BoundingBox/@miny"/>,
    <xsl:value-of select="/cml:OWSContext/cml:General/cml:BoundingBox/@maxx"/>,<xsl:value-of select="/cml:OWSContext/cml:General/cml:BoundingBox/@maxy"/>
  </xsl:param>
  <xsl:param name="width">
    <xsl:value-of select="/cml:OWSContext/cml:General/cml:Window/@width"/>
  </xsl:param>
  <xsl:param name="height">
    <xsl:value-of select="/cml:OWSContext/cml:General/cml:Window/@height"/>
  </xsl:param>
  <xsl:param name="srs" select="/cml:OWSContext/cml:General/cml:BoundingBox/@SRS"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/cml:OWSContext">
      <DIV ID="{$mapContainerId}" STYLE="width:{$width}; height:{$height}; margin:0; padding:0pt; position:relative; overflow:hidden">
        <xsl:apply-templates select="cml:ResourceList/*"/>
      </DIV>
  </xsl:template>
  

</xsl:stylesheet>
