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

$Id$
$Name$
-->
  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <xsl:param name="skinDir"/>
  <xsl:param name="selectIcon">/images/id.gif</xsl:param>
  
  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  
<!-- The name of the javascript context object to call -->
  <xsl:param name="featureName"/>
  <xsl:param name="hidden"/>
  <xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/></xsl:param>

  <!-- Main html -->
  <xsl:template match="/wmc:ViewContext">
    <table>
      <tr>
        <th align="left" ><xsl:value-of select="$title"/></th>
      </tr>
      <xsl:choose>
        <xsl:when test="$featureName">
          <xsl:apply-templates select="wmc:ResourceList[wmc:Name='$featureName'] | wmc:LayerList[wmc:Name='$featureName']"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="wmc:ResourceList/* | wmc:LayerList/*">
            <xsl:sort select="position()" order="descending" data-type="number"/>
          </xsl:apply-templates>
        </xsl:otherwise>
      </xsl:choose>
    </table>
  </xsl:template>
  
  <!-- Layer -->
  <xsl:template match="wmc:Layer">
    <tr>
      <!-- Visiblity -->
      <td>
        <input id="legend_{wmc:name}">
          <xsl:choose>
            <xsl:when test="@opaque='1'">
              <xsl:attribute name="type">radio</xsl:attribute>
              <xsl:attribute name="name">legendGroup</xsl:attribute>
              <xsl:attribute name="onclick">config.objects.<xsl:value-of select="$widgetId"/>.swapOpaqueLayer('<xsl:value-of select="wmc:Name"/>',!this.checked)</xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:attribute name="type">checkbox</xsl:attribute>
              <xsl:attribute name="onclick"><xsl:value-of select="$context"/>.setHidden('<xsl:value-of select="wmc:Name"/>',!this.checked)</xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
          <xsl:if test="@hidden='0'"><xsl:attribute name="checked">checked</xsl:attribute></xsl:if>
        </input>
        <xsl:choose>
          <xsl:when test="wmc:Title/@xml:lang">              
            <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="wmc:Title"/>
          </xsl:otherwise>
        </xsl:choose>
      </td>
    </tr>
    <!-- StyleList
    <tr>
      <td></td>
      <td></td>
      <td>
      <xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL"> 
          <xsl:element name="img">
              <xsl:attribute name="src">
                <xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/> 
              </xsl:attribute>
          </xsl:element>
         </xsl:if>
      </td>
    </tr> -->
  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
