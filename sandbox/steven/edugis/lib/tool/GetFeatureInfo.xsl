<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate a GetFeatureInfo url
Author:      Nedjo
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: GetFeatureInfo.xsl 2137 2006-06-22 16:25:05Z steven $
$Name$
-->
<xsl:stylesheet version="1.0" xmlns:ows="http://www.opengis.net/ows" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink">
  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>

  <!-- parameters to be passed into the XSL -->
  <!-- The name of the WMS GetFeatureInfo layer -->
  <xsl:param name="queryLayer">highways</xsl:param>
  <xsl:param name="layer">highways</xsl:param>

  <xsl:param name="xCoord">1</xsl:param>
  <xsl:param name="yCoord">1</xsl:param>
  <xsl:param name="infoFormat">text/html</xsl:param>
  <xsl:param name="featureCount">1</xsl:param>
  <xsl:param name="bbox"></xsl:param>
  <xsl:param name="width"></xsl:param>
  <xsl:param name="height"></xsl:param>

  <xsl:param name="srs"></xsl:param>

  <!-- Root template -->
  <xsl:template match="/">
    <url>
      <xsl:apply-templates select="wmc:ViewContext/wmc:LayerList"/>
      <xsl:apply-templates select="wmc:OWSContext/wmc:ResourceList"/>
    </url>
  </xsl:template>

  <!-- Layer template -->
  <xsl:template match="wmc:Layer">
    <xsl:if test="contains($layer,wmc:Name)">
      <!-- Layer variables -->
      <xsl:variable name="version">
        <xsl:value-of select="wmc:Server/@version"/>    
      </xsl:variable>
      <xsl:variable name="baseUrl">
        <xsl:value-of select="wmc:Server/wmc:OnlineResource/@xlink:href"/>    
      </xsl:variable>

      <xsl:variable name="firstJoin">
        <xsl:choose>
          <xsl:when test="substring($baseUrl,string-length($baseUrl))='?'"></xsl:when>
          <xsl:when test="contains($baseUrl, '?')">&amp;</xsl:when> 
          <xsl:otherwise>?</xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <!-- Print the URL -->

      <xsl:value-of select="$baseUrl"/><xsl:value-of select="$firstJoin"/>VERSION=<xsl:value-of select="$version"/>&amp;REQUEST=GetFeatureInfo&amp;LAYERS=<xsl:value-of select="$layer"/>&amp;SRS=<xsl:value-of select="$srs"/>&amp;BBOX=<xsl:value-of select="$bbox"/>&amp;WIDTH=<xsl:value-of select="$width"/>&amp;HEIGHT=<xsl:value-of select="$height"/>&amp;INFO_FORMAT=<xsl:value-of select="$infoFormat"/>&amp;FEATURE_COUNT=<xsl:value-of select="$featureCount"/>&amp;QUERY_LAYERS=<xsl:value-of select="$queryLayer"/>&amp;X=<xsl:value-of select="$xCoord"/>&amp;Y=<xsl:value-of select="$yCoord"/>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
