<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!--
Description: Convert a Web Map Context into a HTML Legend
Author:      Cameron Shorter cameron ATshorter.net
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
$Name$
-->
  <xsl:output method="html" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  
<!-- The name of the javascript context object to call -->
  <xsl:param name="context">config['<xsl:value-of select="$modelId"/>']</xsl:param>
  
<!-- Main html -->
  <xsl:template match="/">
    <xsl:apply-templates select="/wmc:ViewContext/wmc:LayerList"/>
  </xsl:template>
<!-- LayerList -->
  <xsl:template match="/wmc:ViewContext/wmc:LayerList">
    <table border="0" cellpadding="1" cellspacing="0">
      <tr>
        <th colspan="3"><xsl:call-template name="title"/></th>
      </tr>
      <xsl:apply-templates/>
    </table>
  </xsl:template>
<!-- Layer -->
  <xsl:template match="/wmc:ViewContext/wmc:LayerList/wmc:Layer">
    <tr>
<!-- Visiblity -->
      <td>
        <xsl:if test="@hidden='0'">
          <input type="checkbox" checked="true" id="legend_{wmc:Name}" onclick="{$context}.setHidden('{wmc:Name}',!document.getElementById('legend_{wmc:Name}').checked)"/>
        </xsl:if>
        <xsl:if test="@hidden='1'">
          <input type="checkbox" id="legend_{wmc:Name}" onclick="{$context}.setHidden('{wmc:Name}',! document.getElementById('legend_{wmc:Name}').checked)"/>
        </xsl:if>
      </td>
      <td>
        <xsl:if test="@queryable='1'">
          <img
            id="query_{wmc:Name}"
            title="Click to set {wmc:Title} as the query layer"
            onclick="{$context}.setParam('queryLayer','{wmc:Name}')"
            src="/mapbuilder/lib/skin/default/images/id.gif" />
        </xsl:if>
      </td>
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
  </xsl:template>
  
  <xsl:template name="title">
    <xsl:choose>
      <xsl:when test="$lang='fr'">Couches de la carte</xsl:when>
      <xsl:otherwise>Map Layers</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>
