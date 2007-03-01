<?xml version="1.0"?>
<xsl:stylesheet xmlns:wmc="http://www.opengis.net/context" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="no"/><xsl:param name="queryLayer"/><xsl:param name="xCoord"/><xsl:param name="yCoord"/><xsl:param name="infoFormat" select="text/html"/><xsl:param name="featureCount" select="1"/><xsl:param name="bBoxMinX"/><xsl:param name="bBoxMinY"/><xsl:param name="bBoxMaxX"/><xsl:param name="bBoxMaxY"/><xsl:param name="srs"/><xsl:param name="width"/><xsl:param name="height"/><xsl:param name="version"/><xsl:param name="httpMethod">get</xsl:param><xsl:variable name="bbox"><xsl:value-of select="$bBoxMinX"/>,<xsl:value-of select="$bBoxMinY"/>,<xsl:value-of select="$bBoxMaxX"/>,<xsl:value-of select="$bBoxMaxY"/></xsl:variable><xsl:template match="wmc:Layer"><xsl:variable name="baseUrl"><xsl:value-of select="wmc:Server/wmc:OnlineResource/@xlink:href"/></xsl:variable><xsl:variable name="imgFormat"><xsl:value-of select="wmc:FormatList/wmc:Format[@current='1']"/></xsl:variable><xsl:variable name="firstJoin"><xsl:choose><xsl:when test="substring($baseUrl,string-length($baseUrl))='?'"/><xsl:when test="contains($baseUrl, '?')">&amp;</xsl:when><xsl:otherwise>?</xsl:otherwise></xsl:choose></xsl:variable><xsl:choose><xsl:when test="$httpMethod='post'"><Query typeName="{$queryLayer}"/></xsl:when><xsl:otherwise><mb:QueryString><xsl:variable name="query">
           REQUEST=GetFeatureInfo
      &amp;SERVICE=WMS
      &amp;VERSION=<xsl:value-of select="$version"/>
          &amp;SRS=<xsl:value-of select="$srs"/>
       &amp;LAYERS=<xsl:value-of select="$queryLayer"/>
         &amp;BBOX=<xsl:value-of select="$bbox"/>
        &amp;WIDTH=<xsl:value-of select="$width"/>
       &amp;HEIGHT=<xsl:value-of select="$height"/>
  &amp;INFO_FORMAT=<xsl:value-of select="$infoFormat"/>
&amp;FEATURE_COUNT=<xsl:value-of select="$featureCount"/>
 &amp;QUERY_LAYERS=<xsl:value-of select="$queryLayer"/>
            &amp;X=<xsl:value-of select="$xCoord"/>
            &amp;Y=<xsl:value-of select="$yCoord"/>
       &amp;FORMAT=<xsl:value-of select="$imgFormat"/></xsl:variable><xsl:value-of select="translate(normalize-space($query),' ','')" disable-output-escaping="no"/></mb:QueryString></xsl:otherwise></xsl:choose></xsl:template></xsl:stylesheet>
