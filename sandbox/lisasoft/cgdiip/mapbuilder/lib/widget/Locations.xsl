<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!--
Description: Convert a Locations XML document (as per schema at lib/model/schemas/locations.xsd)
             into a HTML select box
Author:      Tom Kralidis
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: Locations.xsl,v 1.3 2004/02/27 14:05:36 tomkralidis Exp 
$Name$Name:  $
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gb="http://www.geobase.ca/interop-pilot-2007">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="gml:name option"/>

  <!-- The common params set for all widgets -->

  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="targetModel"/>

  <xsl:param name="selectSize" select="1"/>
  <xsl:param name="selectedOption"/>

  <xsl:param name="resultNameXpath"/>
  <xsl:param name="resultValueXpath"/>

  <xsl:template match="/mb:QuickviewPresetResultSet">
  <xsl:variable name="srsName" select="gml:featureMember/mb:locationDef/mb:spatialKeyword/gml:location/gml:Envelope/@srsName"/>
    <div>
    <form>
      <select name="locations" onchange="javascript:config.objects.{$widgetId}.setAoi(this.options[this.selectedIndex].value,'{$targetModel}','{$srsName}');" size="{$selectSize}">
        <xsl:apply-templates select="gml:featureMember/mb:locationDef"/>
      </select>
    </form>
    </div>
  </xsl:template>

  <xsl:template match="mb:locationDef">
    <xsl:variable name="bbox" select="translate(mb:spatialKeyword/gml:location/gml:Envelope/gml:coordinates,' ',',')"/>
    <option value="{$bbox}"><xsl:value-of select="gml:name"/></option>
  </xsl:template>

  <xsl:template match="/wfs:FeatureCollection">
    <xsl:variable name="srsName" select="//gml:Point/@srsName"/>
    <div>
    <h3>Results</h3>
      <form>
        <select name="locations" onchange="javascript:config.objects.{$widgetId}.setAoi(this.options[this.selectedIndex].value,'{$targetModel}','{$srsName}');" size="{$selectSize}">
          <option value="">-- select location --</option>
          <xsl:apply-templates select="gml:featureMember"/>
        </select>
      </form>
    </div>
  </xsl:template>

  <xsl:template match="gml:featureMember">
    <xsl:variable name="name" select="concat(gb:PlaceName/gb:geographicalName, ' (', gb:PlaceName/gb:regionName , ')')"/>
    <xsl:variable name="coordinates" select=".//gml:Point/gml:coordinates"/>

    <option value="{$coordinates}"><xsl:value-of select="$name"/></option>
 </xsl:template>

</xsl:stylesheet>

