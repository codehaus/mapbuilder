<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:gml='http://www.opengis.net/gml' 
    xmlns:wfs='http://www.opengis.net/wfs'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    version="1.0">
<!--
Description: Convert a Web Map Context into a HTML Legend
Author:      Cameron Shorter cameron ATshorter.net
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: LegendGraphic.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name$
-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <xsl:param name="skinDir"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  
<!-- The name of the javascript context object to call -->
  <xsl:param name="featureName"/>

  <!-- Main html -->
  <xsl:template match="/wmc:ViewContext">
    <div>
      <xsl:choose>
        <xsl:when test="$featureName">
          <xsl:apply-templates select="wmc:ResourceList[wmc:Name='$featureName'] | wmc:LayerList[wmc:Name='$featureName']"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="wmc:ResourceList | wmc:LayerList"/>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>
  
  <!-- Layer -->
  <xsl:template match="wmc:Layer[@hidden='0']">
    <div>
      <xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL"> 
        <xsl:choose>
          <xsl:when test="wmc:Title/@xml:lang">              
            <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="wmc:Title"/>
          </xsl:otherwise>
        </xsl:choose>
        <br/>
        <xsl:element name="img">
            <xsl:attribute name="src">
              <xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/> 
            </xsl:attribute>
        </xsl:element>
      </xsl:if>
    </div>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
