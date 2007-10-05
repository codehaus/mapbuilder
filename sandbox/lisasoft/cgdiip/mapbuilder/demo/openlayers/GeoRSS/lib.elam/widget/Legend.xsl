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

$Id: Legend.xsl 2596 2007-03-15 17:17:21Z steven $
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
  <xsl:template match="/">
    <table border="0" cellpadding="1" cellspacing="0">
      <tr>
        <th colspan="3"><xsl:value-of select="$title"/></th>
      </tr>
      <xsl:apply-templates select="//wmc:ResourceList/*|//wmc:LayerList/*">
        <xsl:sort select="position()" order="descending" data-type="number"/>
      </xsl:apply-templates>
    </table>
  </xsl:template>
  
  <xsl:template match="/wfs:FeatureCollection">
    <table border="0" cellpadding="1" cellspacing="0">
      <tr>
        <!-- Visiblity -->
        <td>
          <xsl:if test="$hidden='false'">
            <input type="checkbox" checked="true" id="legend_{$featureName}" onclick="{$context}.setHidden('{$featureName}',!this.checked)"/>
          </xsl:if>
          <xsl:if test="$hidden='true'">
            <input type="checkbox" id="legend_{$featureName}" onclick="{$context}.setHidden('{$featureName}',!this.checked)"/>
          </xsl:if>
        </td>
         <td>
        </td>
        <!-- No query capability yet -->
        <td>
        </td>
        <td>
          <xsl:value-of select="$featureName"/>
        </td>
      </tr>
    </table>
  </xsl:template>
  
  <!-- Layer -->
  <xsl:template match="wmc:Layer">
    <tr>
      <!-- Visiblity -->
      <td>
        <xsl:if test="@hidden='0'">
          <input type="checkbox" checked="true" id="legend_{wmc:Name}" onclick="{$context}.setHidden('{wmc:Name}',!this.checked)"/>
        </xsl:if>
        <xsl:if test="@hidden='1'">
          <input type="checkbox" id="legend_{wmc:Name}" onclick="{$context}.setHidden('{wmc:Name}',!this.checked)"/>
        </xsl:if>
      </td>
      <!-- opacity -->
        <td>
        <xsl:if test="@opacity">
        <input type="button" value=" - " onClick="javascript:vze=document.getElementById('opacity_{wmc:Name}');nvv=parseFloat(vze.value)-0.1;vze.value=(nvv&#60;0)?0:nvv;{$context}.setOpacity('{wmc:Name}',vze.value)"/>
		  <input type="hidden" id="opacity_{wmc:Name}" onkeypress="{$context}.setOpacity('{wmc:Name}',this.value)">
					 <xsl:attribute name="value"><xsl:value-of select="@opacity"/></xsl:attribute>
			  </input>
<input type="button" value=" + " onClick="javascript:vze=document.getElementById('opacity_{wmc:Name}');nvv=parseFloat(vze.value)+0.1;vze.value=(nvv&#62;1)?1:nvv;{$context}.setOpacity('{wmc:Name}',vze.value)"/>    
		</xsl:if>
        </td>
      <!-- Query Image -->
      <td>
        <xsl:if test="@queryable='1'">
          <img
            id="query_{wmc:Name}"
            title="Click to set {wmc:Title} as the query layer"
            onclick="config.objects.{$widgetId}.selectLayer(config.objects.{$widgetId},'{wmc:Name}')"
            src="{$skinDir}{$selectIcon}" />
        </xsl:if>
      </td>
      <!-- Title -->
      <td>
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
    <!-- StyleList -->
    <tr>
      <td></td>
      <td></td>
       <td>
        </td>
      <td>
      <xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL"> 
          <xsl:element name="img">
              <xsl:attribute name="src">
                <xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/> 
              </xsl:attribute>
          </xsl:element>
         </xsl:if>
      </td>
    </tr>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
