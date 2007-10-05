<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" version="1.0">

<!--
Description: Convert a GML Feature or FeatureCollection into a HTML form.
Author:      Steven Ottens AT geodan nl
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureInfo.xsl 1677 2005-09-21 08:22:13Z graphrisc $
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- Main html - It matches only non-empty results -->
  <xsl:template match="/*">
    <div class="featureLayer">
      <div class="layerTitle">Layer</div><br/><!--TBD: get the real layername-->
      <form>	
          <xsl:apply-templates/>
      </form>
    </div>
  </xsl:template>


  <!-- All nodes -->
  <xsl:template match="*">
    <xsl:variable name="xlink">
      <xsl:call-template name="getXpath">
        <xsl:with-param name="node" select="."/>
      </xsl:call-template>
    </xsl:variable>
      <xsl:if test="not(./*)">
        <div class="record">
          <div class="name">
            <xsl:value-of select="name(.)"/>
          </div>
          <div class="value">
            <input
              type="text"
              id="{$widgetId}{generate-id()}"
              value="{text()}"
        	    readonly="readonly"
              />
          </div>
        </div>
      </xsl:if>
      <xsl:if test="./*">
        <xsl:apply-templates>
        </xsl:apply-templates>
      </xsl:if>
    </xsl:template>

  <!-- Return xpath reference to a node. Calls itself recursively -->
  <xsl:template name="getXpath">
    <xsl:param name="node"/>
    <xsl:if test="name($node/..)">
      <xsl:call-template name="getXpath">
        <xsl:with-param name="node" select="$node/.."/>
      </xsl:call-template>
    </xsl:if>
    <xsl:text>/</xsl:text>
    <xsl:value-of select="name($node)"/>
  </xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
