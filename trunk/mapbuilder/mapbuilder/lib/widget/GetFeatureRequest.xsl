<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate an array of DHTML layers.
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:cml="http://www.opengis.net/context" 
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <xsl:param name="cs" select="' '"/>
  <xsl:param name="bbox">
    <xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@minx"/>,<xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@miny"/>
    <xsl:value-of select="$cs"/>
    <xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@maxx"/>,<xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@maxy"/>
  </xsl:param>
  <xsl:param name="srs" select="/cml:ViewContext/cml:General/cml:BoundingBox/@SRS"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/cml:ViewContext/cml:ResourceList/cml:FeatureType">
    <xsl:param name="resourceName" select="cml:Name"/>
    <xsl:param name="featureSrs" select="cml:SRS"/>
    <GetFeature version="1.0.0" service="WFS" maxFeatures="500"
      xmlns="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc">
      <Query typeName="{$resourceName}">
         <!--ogc:PropertyName>GML_Geometry</ogc:PropertyName>
         <ogc:PropertyName>DEFINITION</ogc:PropertyName>
         <ogc:PropertyName>LU37_CODE</ogc:PropertyName>
         <ogc:PropertyName>YEAR</ogc:PropertyName-->
         <ogc:Filter>
            <ogc:And>
              <xsl:if test="cml:Geometry">
                <ogc:BBOX>
                  <ogc:PropertyName><xsl:value-of select="cml:Geometry"/></ogc:PropertyName>
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
