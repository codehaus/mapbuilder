<?xml version="1.0" encoding="UTF-8"?>

<!--
Description: presents the list of events in a GeoRSS
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: GeoRSSListing.xsl 3017 2007-07-26 23:01:32Z ahocevar $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="targetModelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="hiddenItems"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/">
    <table>
      <tr><th colspan="2">Community Mapbuilder Community</th></tr>
      <xsl:apply-templates select="//mb:geoRssFeature"/>
    </table>
  </xsl:template>

  <xsl:template match="//mb:geoRssFeature">
    <xsl:variable name="fid"><xsl:value-of select="@fid"/></xsl:variable>
    <xsl:variable name="link"><xsl:value-of select="mb:photopage"/></xsl:variable>
    <xsl:variable name="icon"><xsl:value-of select="mb:url"/></xsl:variable>
    <tr>
      <td>
        <input type="checkbox" checked="checked" onclick="this.checked?config.objects.{$modelId}.setParam('showFeature','{$fid}'):config.objects.{$modelId}.setParam('hideFeature','{$fid}')" />
      </td>
      <td onmouseover="config.objects.{$modelId}.setParam('highlightFeature','{$fid}')" onmouseout="config.objects.{$modelId}.setParam('dehighlightFeature','{$fid}')">
        <table><tr>
        <td valign="top"><img src="{$icon}" /></td>
        <td valign="top"><a href="{$link}" target="_blank"><xsl:value-of select="mb:title"/></a><br/>
        <xsl:value-of select="mb:description"/></td>
        </tr></table>
      </td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
