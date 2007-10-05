<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: transforms a WFS FeatureType node to a DescribeFeatureType request
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: wps_DescribeProcess.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:wps="http://www.opengis.net/wps"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:ows="http://www.opengis.net/ows"
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <xsl:param name="httpMethod">get</xsl:param>
  <xsl:param name="version"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/wps:Capabilities/wps:ProcessOfferings">
    <DescribeProcess version="{$version}" service="WPS">
      <xsl:apply-templates select="wps:Process"/>
    </DescribeProcess>
  </xsl:template>

  <!-- template rule matching source root element -->
  <xsl:template match="wps:Process">
    <xsl:choose>
      <xsl:when test="$httpMethod='post'">
        <ProcessName><xsl:value-of select="wps:Name"/></ProcessName>
      </xsl:when>
      <xsl:otherwise>
        <mb:QueryString>
          <xsl:variable name="query">
      request=DescribeProcess
 &amp;service=WPS
 &amp;version=<xsl:value-of select="$version"/>
&amp;ProcessName=<xsl:value-of select="wps:Name"/>
          </xsl:variable>
          <xsl:value-of select="translate(normalize-space($query),' ', '' )" disable-output-escaping="no"/>
        </mb:QueryString>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
