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
  <xsl:output method="xml" encoding="utf-8"/>
  
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
    <xsl:variable name="hiddenAttr">
      <xsl:choose>
        <xsl:when test="@hidden='0'">true</xsl:when>
        <xsl:otherwise>false</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <tr>
      <!-- Visiblity -->
      <td>
        <xsl:choose>
          <xsl:when test="@opaque='1'">
            <input type="radio" checked="{$hiddenAttr}" name="legendGroup" id="legend_{wmc:Name}" onclick="config.objects.{$widgetId}.swapOpaqueLayer('{wmc:Name}',!this.checked)"/>
          </xsl:when>
          <xsl:otherwise>
            <input type="checkbox" checked="{$hiddenAttr}" id="legend_{wmc:Name}" onclick="{$context}.setHidden('{wmc:Name}',!this.checked)"/>
          </xsl:otherwise>
        </xsl:choose>
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
