<?xml version="1.0"?>
<xsl:stylesheet xmlns:wps="http://www.opengis.net/wps" xmlns:ogc="http://www.opengis.net/ogc" xmlns:ows="http://www.opengis.net/ows" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/><xsl:param name="httpMethod">get</xsl:param><xsl:param name="version"/><xsl:template match="/wps:Capabilities/wps:ProcessOfferings"><DescribeProcess version="{$version}" service="WPS"><xsl:apply-templates select="wps:Process"/></DescribeProcess></xsl:template><xsl:template match="wps:Process"><xsl:choose><xsl:when test="$httpMethod='post'"><ProcessName><xsl:value-of select="wps:Name"/></ProcessName></xsl:when><xsl:otherwise><mb:QueryString><xsl:variable name="query">
      request=DescribeProcess
 &amp;service=WPS
 &amp;version=<xsl:value-of select="$version"/>
&amp;ProcessName=<xsl:value-of select="wps:Name"/></xsl:variable><xsl:value-of select="translate(normalize-space($query),' ', '' )" disable-output-escaping="no"/></mb:QueryString></xsl:otherwise></xsl:choose></xsl:template><xsl:template match="text()|@*"/></xsl:stylesheet>