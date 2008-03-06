<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" version="1.0">

<!--
Description: Convert a GML Feature or FeatureCollection into a HTML form.
Author:      Cameron Shorter cameron ATshorter.net
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
$Name$
-->

  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>

  <!-- Common params for all widgets -->
  <!--xsl:param name="targetModelId"/-->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
      <h3>Feature List</h3>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- don't print boundedBy -->
  <xsl:template match="gml:boundedBy"/>

  <!-- featureMember -->
  <xsl:template match="gml:featureMember">
    <div>
      <table border="1" cellpadding="0" cellspacing="0">
        <xsl:apply-templates>
          <xsl:with-param name="pos" select="position()"/>
        </xsl:apply-templates>
      </table>
      <br/>
    </div>
  </xsl:template>

  <!-- All nodes -->
  <xsl:template name="allNodes" match="*">
    <xsl:param name="pos"/>
    <xsl:variable name="xlink">
      <xsl:call-template name="getXpath">
        <xsl:with-param name="node" select="."/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:if test="not(./*)">
      <tr>
        <td>
          <xsl:value-of select="name(.)"/>
        </td>
        <td>
          <input
            type="text"
            id="{$widgetId}{generate-id()}"
            size="40"
            value="{text()}"
            onchange="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'/*/*[position()={$pos}]{$xlink}', this.value);"/>
        </td>
      </tr>
    </xsl:if>
    <xsl:if test="./*">
      <xsl:apply-templates>
          <xsl:with-param name="pos" select="$pos"/>
      </xsl:apply-templates>
    </xsl:if>
  </xsl:template>

  <!-- Return xpath reference to a node. Calls itself recursively -->
  <xsl:template name="getXpath">
    <xsl:param name="node"/>
    <xsl:if test="name($node/..) and not(name($node/..)='gml:featureMember')">
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
