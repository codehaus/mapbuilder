<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:gml='http://www.opengis.net/gml' 
    xmlns:wfs='http://www.opengis.net/wfs'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    version="1.0">
<!--
Description: provides a list of layers and controls for them (delete/visibility/move up/move down/show metadata
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: Legend.xsl,v 1.23 2005/04/09 20:45:30 madair1 Exp $
$Name:  $
-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="skinDir"/>
  <xsl:param name="moveUpImage"/>
  <xsl:param name="moveDownImage"/>
  <xsl:param name="deleteImage"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  <xsl:param name="toggleVisTip"/>
  <xsl:param name="moveLayerUpTip"/>
  <xsl:param name="moveLayerDownTip"/>
  <xsl:param name="deleteLayerTip"/>
  
<!-- The name of the javascript context object to call -->
  <xsl:param name="featureName"/>
  <xsl:param name="hidden"/>
  <xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/></xsl:param>
  
<!-- Main html -->
  <xsl:template match="/wmc:ViewContext">
    <div>
      <table class="layerControl" cellspacing="0" width="340">
        <!--tr>
          <td colspan="5">Layer Control | Layer metadata | Map metadata</td>
        </tr-->
        <xsl:apply-templates select="wmc:LayerList/wmc:Layer">
          <xsl:sort select="position()" order="descending" data-type="number"/>
        </xsl:apply-templates>
      </table>
    </div>
  </xsl:template>
  
<!-- Layer -->
  <xsl:template match="wmc:Layer">
    <xsl:variable name="layerName" select="wmc:Name"/>
    <xsl:variable name="rowClass">altRow_<xsl:value-of select="position() mod 2"/></xsl:variable>
    <tr class="{$rowClass}" onmouseover="config.objects.{$widgetId}.highlightLayer('{$layerName}')">
<!-- Visiblity -->
      <td>
        <input type="checkbox" id="vis_{$layerName}" title="{$toggleVisTip}" onclick="{$context}.setHidden('{$layerName}',!document.getElementById('vis_{$layerName}').checked)">
          <xsl:if test="@hidden='0'"><xsl:attribute name="checked"/></xsl:if>
        </input>
      </td>
      <td>
       <a href="javascript:{$context}.setParam('moveLayerUp','{$layerName}')" class="mbButton">
        <img title="{$moveLayerUpTip}" src="{$skinDir}{$moveUpImage}" />
       </a>
      </td>
      <td>
       <a href="javascript:{$context}.setParam('moveLayerDown','{$layerName}')" class="mbButton">
        <img title="{$moveLayerDownTip}" src="{$skinDir}{$moveDownImage}" />
       </a>
      </td>
      <td>
       <a href="javascript:{$context}.setParam('deleteLayer','{$layerName}')" class="mbButton">
        <img title="{$deleteLayerTip}" src="{$skinDir}{$deleteImage}" />
       </a>
      </td>
      <td onclick="config.objects.{$widgetId}.showLayerMetadata('{$layerName}')">
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
    <tr class="{$rowClass}" onmouseover="config.objects.{$widgetId}.highlightLayer('{$layerName}')">
     <td colspan="5">
       <xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL"> 
          <xsl:element name="IMG">
              <xsl:attribute name="SRC">
                <xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/> 
              </xsl:attribute>
          </xsl:element>
         </xsl:if>
     </td>
    </tr>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
