<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" version="1.0">

<!--
Description: Convert a GML Feature or FeatureCollection into a HTML form.
Author:      Cameron Shorter cameron ATshorter.net
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureList.xsl 1717 2005-10-09 10:55:55Z camerons $
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <!--xsl:param name="targetModelId"/-->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- Main html -->
  <xsl:template match="/">
    <!--xsl:variable name="propertyName" select="//wmc:PrpertyName"/-->
    <form>
      Species:
      <select
        id="{$widgetId}_species"
        onchange="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'//wmc:PropertyName',document.getElementById('{$widgetId}_species').value);"
        >
        <option value=""></option>
        <option value="SUSSCR">SUSSCR</option>
        <option value="CAPHIR">CAPHIR</option>
        <option value="CERSPP">CERSPP</option>
      </select><br/>
      <!--
      Value:
      <input
        type="text"
        id="{$widgetId}_value"
        value="4/2/3"
        onchange="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'//wmc:Literal',document.getElementById('{$widgetId}_value').value);"
       />
       -->
    </form>
    <xsl:apply-templates/>
  </xsl:template>

  <!-- Print out an option list with one option selected -->
  <!--
  <xsl:template name="optionList">
    <xsl:param name="selected"/>
    <xsl:if>
      <xsl:when test="compare($selected,$option)">
      </xsl:when>
      <xsl:otherwise>
        <option value="$option"></option>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  -->

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
