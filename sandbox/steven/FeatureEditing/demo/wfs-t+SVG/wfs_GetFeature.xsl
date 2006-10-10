<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
  Description: transforms a WFS FeatureType node to a GetFeatureType request
  Author:      adair
  Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .
  $Id: wfs_GetFeature.xsl 1823 2005-11-27 13:00:31 -0500 (Sun, 27 Nov 2005) madair1 $
  $Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:sld="http://www.opengis.net/sld"
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    
  <xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8" indent="no" />
  <xsl:preserve-space elements="gml:coordinates" />
  <xsl:param name="cs" select="','" />
  <xsl:param name="ts" select="' '" />
  <xsl:param name="bBoxMinX" />
  <xsl:param name="bBoxMinY" />
  <xsl:param name="bBoxMaxX" />
  <xsl:param name="bBoxMaxY" />
  <xsl:param name="srs" />
  <xsl:param name="version" />
  <xsl:param name="httpMethod" />
  <xsl:param name="filter" />
  <xsl:param name="maxFeatures">1</xsl:param>
  <xsl:param name="geometry">topp:GEOMETRIE</xsl:param>
  <xsl:param name="resourceName" />
  <xsl:param name="featureSrs" />
  <xsl:param name="fromDateField" />
  <xsl:param name="toDateField" />

  <!-- template rule matching source root element -->

  <xsl:template match="/">

    <wmc:FeatureType hidden="0" id="B58B8C7B-6592-4D67-9CD5-5D43CB46BF83">
      <wmc:Server service="OGC:WFS" version="1.0.0" title="decock">
        <wmc:OnlineResource method="post" xlink:type="simple" xlink:href="http://deocock:11080/geoserver/wfs" />
      </wmc:Server>
      <wmc:Name>decock</wmc:Name>
      <wmc:Title>decock</wmc:Title>
      
      <wfs:GetFeature version="1.0.0" service="WFS" maxFeatures="{$maxFeatures}" outputFormat="GML2" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
        <wfs:Query typeName="{$resourceName}">
          <ogc:Filter>
            <xsl:if test="$bBoxMinX">
              <BBOX>
                <PropertyName>
                  <xsl:value-of select="$geometry" />
                </PropertyName>
                <gml:Box srsName="{$srs}">
                  <gml:coordinates>
                    <xsl:value-of select="$bBoxMinX" />
                    <xsl:value-of select="$cs" />
                    <xsl:value-of select="$bBoxMinY" />
                    <xsl:value-of select="$ts" />
                    <xsl:value-of select="$bBoxMaxX" />
                    <xsl:value-of select="$cs" />
                    <xsl:value-of select="$bBoxMaxY" />
                  </gml:coordinates>
                </gml:Box>
              </BBOX>
            </xsl:if>
          </ogc:Filter>
        </wfs:Query>
      </wfs:GetFeature>
      <wmc:StyleList>
        <wmc:Style>
          <wmc:Name>Highlite</wmc:Name>
          <sld:LineSymbolizer>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">#ff0000</sld:CssParameter>
                </sld:Fill>
              </sld:Mark>
              <sld:Size>40</sld:Size>
            </sld:Graphic>
            <sld:Stroke>
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter>
              <sld:CssParameter name="stroke-width">5</sld:CssParameter>
            </sld:Stroke>
          </sld:LineSymbolizer>
        </wmc:Style>
        <wmc:Style>
          <wmc:Name>Normal</wmc:Name>
          <sld:LineSymbolizer>
            <sld:Stroke>
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter>
              <sld:CssParameter name="stroke-width">3</sld:CssParameter>
            </sld:Stroke>
          </sld:LineSymbolizer>
        </wmc:Style>
      </wmc:StyleList>
    </wmc:FeatureType>
  </xsl:template>
</xsl:stylesheet>