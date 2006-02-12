<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"
  xmlns:wmc="http://www.opengis.net/context" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:xlink="http://www.w3.org/1999/xlink" >
<!--
Description: Output the timestamp value
Author:      Mike Adair mike.adairATnrcan.gc.ca
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
Abstract.xsl,v 1.5 2004/06/25 17:59:38 madair1 Exp

-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="widgetNode"/>

  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  
  <xsl:template match="/">
    <form STYLE="font: 8pt Verdana, geneva, arial, sans-serif;">
      <xsl:value-of select="$title"/>
      <xsl:apply-templates select="wmc:ViewContext/wmc:General"/>
    </form>
  </xsl:template>

  
  <!-- readonly input element to display the time value -->
  <xsl:template match="mb:TimestampList">
    <input id="timestampValue" type="text" size="10" class="bareInput" readonly="true">
      <xsl:attribute name="value">
        <xsl:value-of select="mb:Timestamp[@current='1']"/>
      </xsl:attribute>
    </input>
  </xsl:template>

  <!-- readonly input element to display the time value 
  repeated here without namespaces because IE doesn't support the createElementNS function
  and this part of the extension is output without any apparent namespace
  -->
  <xsl:template match="TimestampList">
    <input id="timestampValue" type="text" size="10" class="bareInput" readonly="true">
      <xsl:attribute name="value">
        <xsl:value-of select="Timestamp[@current='1']"/>
      </xsl:attribute>
    </input>
  </xsl:template>
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>

