<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:wmc="http://www.opengis.net/context"
xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Displays the Title value from a Web Map Context document
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
$Name:  $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="layerName">TEMPERATURE</xsl:param>

  <!-- Main html -->
  
  <xsl:template match="/wmc:ViewContext/wmc:General/wmc:Extension ">
    <div>
      <form>
        start:<select name="firstFrame" onchange="config.objects.{$modelId}.setParam('firstFrame',this.value)">
          <xsl:apply-templates select="mb:TimestampList[@layerName=$layerName]/mb:Timestamp"/>
        </select>
        <!--
        - stop:<select name="lastFrame" onchange="config.objects.{$widgetId}.setLastFrame(this.value)">
          <xsl:apply-templates select="wmc:TimestampList[@layerName=$layerName]/wmc:Timestamp"/>
        </select>
        -->
      </form>
    </div>
  </xsl:template>
  
  <xsl:template match="mb:Timestamp">
    <xsl:param name="index" select="position()-1"/>
    <option value="{$index}">
      <xsl:value-of select="."/>
    </option>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>

