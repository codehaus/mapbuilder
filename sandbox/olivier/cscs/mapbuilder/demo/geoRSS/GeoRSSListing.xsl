<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: presents the list of events in a GeoRSS
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: GeoRSSListing.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
  xmlns:rss="http://purl.org/rss/1.0/" 
  xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" 
  xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="targetModelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/rdf:RDF ">
    <table>
      <th><xsl:value-of select="rss:channel/rss:title"/></th>
      <xsl:apply-templates select="rss:item"/>
    </table>
  </xsl:template>

  <xsl:template match="rss:item">
    <xsl:variable name="fid"><xsl:value-of select="@id"/></xsl:variable>
    <xsl:variable name="x"><xsl:value-of select="geo:long"/></xsl:variable>
    <xsl:variable name="y"><xsl:value-of select="geo:lat"/></xsl:variable>
    <xsl:variable name="link"><xsl:value-of select="rss:link"/></xsl:variable>
    <xsl:variable name="time"><xsl:value-of select="dc:date"/></xsl:variable>
 
    <tr onmouseover="config.objects.{$modelId}.setParam('highlightFeature','{$fid}')" onmouseout="config.objects.{$modelId}.setParam('dehighlightFeature','{$fid}')">
      <td><img src='./images/yellow_bullet3.gif'/>&#38;nbsp;&#38;nbsp;<xsl:value-of select="dc:date"/></td>
      <td>
        <a href="{$link}"><xsl:value-of select="rss:title"/></a>
        - <xsl:value-of select="rss:description"/>
      </td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
