<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"
  xmlns:wmc="http://www.opengis.net/context" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:xlink="http://www.w3.org/1999/xlink" >
<!--
Description: Output the context title and abstract
Author:      Mike Adair mike.adairATnrcan.gc.ca
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html
Abstract.xsl,v 1.5 2004/06/25 17:59:38 madair1 Exp

-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="widgetNode"/>
  
  <xsl:template match="/">
    <div>
      <xsl:call-template name="title"/>
      <xsl:apply-templates select="wmc:ViewContext/wmc:General/wmc:Extension"/>
    </div>
  </xsl:template>

  
  <!-- Main html -->
  <xsl:template match="mb:TimestampList">
      <xsl:value-of select="mb:Timestamp[@current='1']"/>
  </xsl:template>

  <xsl:template match="text()|@*"/>
  
  <xsl:template name="title">
    <xsl:choose>
      <xsl:when test="$lang='fr'">Timestamp-fr</xsl:when>
      <xsl:otherwise>Timestamp:</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="moreInfo">
    <xsl:choose>
      <xsl:when test="$lang='fr'">Lisez à propos de cette carte</xsl:when>
      <xsl:otherwise>Read more about this map</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
 
</xsl:stylesheet>

