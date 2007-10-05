<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: transforms a WFS FeatureType node to a GetFeatureType request
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: csw_GetRecords.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
		xmlns:ogc="http://www.opengis.net/ogc"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:ows="http://www.opengis.net/ows" 
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="no"/>
  <xsl:preserve-space elements="gml:coordinates"/>

  <xsl:param name="cs" select="','"/>
  <xsl:param name="ts" select="' '"/>
  <xsl:param name="bBoxMinX"/>
  <xsl:param name="bBoxMinY"/>
  <xsl:param name="bBoxMaxX"/>
  <xsl:param name="bBoxMaxY"/>
  <xsl:param name="srs"/>
  <xsl:param name="version"/>
  
  <xsl:param name="httpMethod">get</xsl:param>
  <xsl:param name="filter"/>
  <xsl:param name="maxFeatures">500</xsl:param>
  <xsl:param name="geometry"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="ows:Operation">
    <GetRecords maxRecords="{$maxFeatures}" outputFormat="application/xml; charset=UTF-8" 
            outputSchema="ogcCORE" version="2.0.0" xmlns="http://www.opengis.net/cat/csw">
    
    <xsl:choose>
      <xsl:when test="$httpMethod='post'">
        <Query typeNames="ExtrinsicObject">
          <ElementName>/ExtrinsicObject</ElementName>
          <xsl:if test="$filter">
            <Constraint version="1.0.0">
              <xsl:value-of select="$filter"/>
            </Constraint>
          </xsl:if>
        </Query>
      </xsl:when>
      <xsl:otherwise>
        <mb:QueryString>
          <xsl:variable name="bbox">
            <xsl:value-of select="$bBoxMinX"/>,<xsl:value-of select="$bBoxMinY"/>,
            <xsl:value-of select="$bBoxMaxX"/>,<xsl:value-of select="$bBoxMaxY"/>
          </xsl:variable>
          <xsl:variable name="query">
        request=GetFeature
    &amp;service=WFS
    &amp;version=<xsl:value-of select="$version"/>
&amp;maxfeatures=<xsl:value-of select="$maxFeatures"/>
   &amp;typename=<xsl:value-of select="$resourceName"/>
          <xsl:if test="$bBoxMinX">
   &amp;bbox=<xsl:value-of select="$bbox"/>
          </xsl:if>
          </xsl:variable>
          <xsl:value-of select="translate(normalize-space($query),' ','')" disable-output-escaping="no"/><xsl:if test="$filter">&amp;filter=<xsl:value-of select="$filter"/></xsl:if>
        </mb:QueryString>
      </xsl:otherwise>
    </xsl:choose>
    </GetRecords>      
  </xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
