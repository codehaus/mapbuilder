<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" >
<!--
Description: Output the metadata of a layer 
Author:      Roald de Wit rdewit@lisasoft.com
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
LayerMetadata.xsl,v 1.5 2004/06/25 17:59:38 rdewit Exp

-->
  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="widgetNode"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="abstract"/>
  <xsl:param name="moreInfo"/>
  
  <!-- Node with layer information -->
  <xsl:param name="layerNode"/>
  
  <xsl:template match="/">
  <div>
    <xsl:apply-templates select="$layerNode"/>
  </div>
  </xsl:template>

  <xsl:template match="wmc:Layer|wmc:FeatureType">
    <table class="metadata">
    <xsl:if test="wmc:Server/@service">
    <tr><td>Service:</td><td><xsl:value-of select="wmc:Server/@service"/></td></tr>
    </xsl:if>
    <xsl:if test="wmc:Name/text()">
    <tr><td>Name:</td><td><xsl:value-of select="wmc:Name"/></td></tr>
    </xsl:if>
    <xsl:if test="wmc:Title/text()">
    <tr><td>Title:</td><td><xsl:value-of select="wmc:Title"/></td></tr>
    </xsl:if>
    <xsl:if test="wmc:Abstract/text()">
    <tr><td>Abstract:</td><td><xsl:value-of select="wmc:Abstract"/></td></tr>
    </xsl:if>
    <xsl:if test=".//wmc:OnlineResource/@xlink:href">
    <tr><td>Resource:</td><td><xsl:value-of select=".//wmc:OnlineResource/@xlink:href"/></td></tr>
    </xsl:if>
    <xsl:if test="@id">
    <tr><td>Id:</td><td><xsl:value-of select="@id"/></td></tr>
    </xsl:if>
    </table>
  </xsl:template>
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>

