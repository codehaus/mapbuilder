<?xml version="1.0" encoding="ISO-8859-1"?>



<!--

Description: transforms a WFS FeatureType node to a DescribeFeatureType request

Author:      adair

Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .



$Id: wfs_DescribeFeatureType.xsl 2546 2007-01-23 12:07:39Z gjvoosten $

$Name$

-->



<xsl:stylesheet version="1.0" 

    xmlns:wfs="http://www.opengis.net/wfs"

    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

		xmlns:ogc="http://www.opengis.net/ogc"

    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 

		xmlns:gml="http://www.opengis.net/gml"

    xmlns:xlink="http://www.w3.org/1999/xlink">



  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>



  <xsl:param name="httpMethod">get</xsl:param>

  

  <!-- template rule matching source root element -->

  <xsl:template match="/wfs:WFS_Capabilities/wfs:FeatureTypeList">

    <DescribeFeatureType version="1.0.0" service="WFS">

      <xsl:apply-templates select="wfs:FeatureType"/>

    </DescribeFeatureType>

  </xsl:template>



  <!-- template rule matching source root element -->

  <xsl:template match="wfs:FeatureType">

    <xsl:choose>

      <xsl:when test="$httpMethod='post'">

        <TypeName><xsl:value-of select="wfs:Name"/></TypeName>

      </xsl:when>

      <xsl:otherwise>

        <mb:QueryString>

          <xsl:variable name="query">

      request=DescribeFeatureType

 &amp;version=1.0.0

 &amp;service=WFS

&amp;typename=<xsl:value-of select="wfs:Name"/>

          </xsl:variable>

          <xsl:value-of select="translate(normalize-space($query),' ', '' )" disable-output-escaping="no"/>

        </mb:QueryString>

      </xsl:otherwise>

    </xsl:choose>

  </xsl:template>



  <xsl:template match="text()|@*"/>



</xsl:stylesheet>

