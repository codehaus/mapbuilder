<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate an array of DHTML layers.
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:ogcwfs="http://www.opengis.net/wfs"
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <xsl:param name="cs" select="' '"/>
  <xsl:param name="bbox"/>
  <xsl:param name="srs"/>
  
  <xsl:param name="httpMethod">get</xsl:param>
  <xsl:param name="filter"/>
  <xsl:param name="geometry"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="ogcwfs:FeatureType">
    <xsl:param name="resourceName" select="ogcwfs:Name"/>
    <xsl:param name="featureSrs" select="ogcwfs:SRS"/>
    <GetFeature version="1.0.0" service="WFS" maxFeatures="10">
    
    <xsl:choose>
      <xsl:when test="$httpMethod='post'">
      <Query typeName="{$resourceName}">
      </Query>
      </xsl:when>
      <xsl:otherwise>
        <QueryString>
          <xsl:variable name="query">
         request=GetFeature
    &amp;version=1.0.0
    &amp;service=WFS
&amp;maxfeatures=20
   &amp;typename=<xsl:value-of select="$resourceName"/>
          <xsl:if test="$bbox">
   &amp;bbox=<xsl:value-of select="$bbox"/>
          </xsl:if>
          <xsl:if test="$filter">
   &amp;filter=<xsl:value-of select="$filter"/>
          </xsl:if>
          </xsl:variable>
          <xsl:value-of select="translate(normalize-space($query),' ', '' )" disable-output-escaping="no"/>
        </QueryString>
      </xsl:otherwise>
    </xsl:choose>
    </GetFeature>
  </xsl:template>
  
  <!-- template rule matching source root element -->
  <xsl:template match="wmc:FeatureType[wmc:Server/@service='OGC:WFS']">
    <xsl:param name="resourceName" select="wmc:Name"/>
    <xsl:param name="featureSrs" select="wmc:SRS"/>
    <GetFeature version="1.0.0" service="WFS" maxFeatures="10"
      xmlns="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc">
      <Query typeName="{$resourceName}">
         <!--ogc:PropertyName>GML_Geometry</ogc:PropertyName>
         <ogc:PropertyName>DEFINITION</ogc:PropertyName>
         <ogc:PropertyName>LU37_CODE</ogc:PropertyName>
         <ogc:PropertyName>YEAR</ogc:PropertyName-->
         <ogc:Filter>
            <ogc:And>
              <xsl:if test="wmc:Geometry">
                <ogc:BBOX>
                  <ogc:PropertyName><xsl:value-of select="wmc:Geometry"/></ogc:PropertyName>
                  <gml:Box srsName="{$srs}">
                    <gml:coordinates><xsl:value-of select="$bbox"/></gml:coordinates>
                  </gml:Box>
                </ogc:BBOX>
              </xsl:if>
              <xsl:if test="ogc:Filter">
                <xsl:copy-of select="ogc:Filter/*"/>
              </xsl:if>
            </ogc:And>
          </ogc:Filter>
      </Query>
    </GetFeature>
  </xsl:template>
  
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
