<?xml version="1.0" encoding="UTF-8"?>

<!--
Description: presents the list of events in a GeoRSS
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id$
$Name:  $
-->

<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" >
  
  <!-- xsl:output method="html" omit-xml-declaration="yes" encoding="utf-8" indent="yes"/ -->
  <xsl:output method="xml" indent="yes" omit-xml-declaration="yes"/>
  <xsl:param name="fid"/>
  
  <xsl:template match="/">
    <div class="PopupContainer">
      <div class="PopupHeader">Info</div>
      <div class="PopupContent">
        <xsl:apply-templates/>
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="wfs:FeatureCollection/gml:featureMember/*">
    <xsl:if test="@fid=$fid">
      <table cellspacing="0" border="0">
    	<tr><td><b>title:</b> <xsl:value-of select="mb:title"/></td></tr>
    	<tr><td><b>description:</b> <xsl:copy-of select="mb:description"/></td></tr>
    	<tr><td><b>date:</b> <xsl:value-of select="dc:date"/></td></tr>
      <tr><td><b>pos:</b> <xsl:value-of select="mb:geom/gml:Point/gml:coordinates"/></td></tr>
      <tr><td align="center"><xsl:element name="img">
        <xsl:attribute name="src"><xsl:value-of select="mb:url"/></xsl:attribute>
      </xsl:element></td></tr>
      </table>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
