<?xml version="1.0" encoding="UTF-8"?>

<!--
Description: presents the list of events in a GeoRSS
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: GeoRSSListing.xsl 2957 2007-07-09 12:21:10Z steven $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  
  xmlns:atom="http://www.w3.org/2005/Atom">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="targetModelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="hiddenItems"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/atom:feed ">
    <table>
      <xsl:apply-templates select="atom:entry"/>
    </table>
  </xsl:template>

  <xsl:template match="atom:entry">
    <xsl:variable name="fid"><xsl:value-of select="atom:id"/></xsl:variable>
    <xsl:variable name="link"><xsl:value-of select="atom:link"/></xsl:variable>
    <tr>
      <td onmouseover="config.objects.{$modelId}.setParam('highlightFeature','{$fid}')"
      	  onmouseout="config.objects.{$modelId}.setParam('dehighlightFeature','{$fid}')">
        <div id = "item">
          <div id="{$fid}" style="width:325px">
      	    <input type="checkbox" checked="true"
      		  onclick="this.checked?config.objects.{$modelId}.setParam('showFeature','{$fid}'):config.objects.{$modelId}.setParam('hideFeature','{$fid}')" />
	        <a href="{$link}"><xsl:value-of select="atom:link"/></a><br/>
	        <xsl:copy-of select="atom:summary"/>
          </div>
        </div>
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet>
