<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:gml="http://www.opengis.net/gml"
  version="1.0">
<!--
Description: Convert GML to HTML Graphics. 
Author:      Cameron Shorter cameron ATshorter.net
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
$Name$
-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <xsl:param name="width"/>
  <xsl:param name="height"/>
  <xsl:param name="bBoxMinX"/>
  <xsl:param name="bBoxMinY"/>
  <xsl:param name="bBoxMaxX"/>
  <xsl:param name="bBoxMaxY"/>
  <xsl:param name="lineColor" select="red"/>
  <xsl:param name="lineWidth" select="2"/>

  <xsl:variable name="xRatio" select="$width div ( $bBoxMaxX - $bBoxMinX )"/>
  <xsl:variable name="yRatio" select="$height div ( $bBoxMaxY - $bBoxMinY )"/>


  <!-- Root node -->
  <xsl:template match="/">
        <!--div style="width: {$width}px; height: {$height}px; overflow: hidden"-->
        <div>
          <xsl:apply-templates/>
        </div>
  </xsl:template>

  <!-- Match and render a GML Envelope -->
  <xsl:template match="gml:Envelope">
    <xsl:variable name="box" select="gml:coordinates"/>
    <xsl:variable name="x0" select="round((substring-before($box,',')-$bBoxMinX)*$xRatio)"/>
    <xsl:variable name="box2" select="substring-after($box,',')"/>
    <xsl:variable name="y0" select="round($height - (substring-before($box2,' ')-$bBoxMinY)*$yRatio)"/>
    <xsl:variable name="box3" select="substring-after($box2,' ')"/>
    <xsl:variable name="x1" select="round((substring-before($box3,',')-$bBoxMinX)*$xRatio)"/>
    <xsl:variable name="y1" select="round($height - (substring-after($box3,',')-$bBoxMinY)*$yRatio)"/>

    <xsl:variable name="xMax">
      <xsl:choose>
        <xsl:when test="$x1 > $x0">
          <xsl:value-of select="$x1"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$x0"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="xMin">
      <xsl:choose>
        <xsl:when test="$x1 > $x0">
          <xsl:value-of select="$x0"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$x1"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="yMin">
      <xsl:choose>
        <xsl:when test="$y1 > $y0">
          <xsl:value-of select="$y1"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$y0"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="yMax">
      <xsl:choose>
        <xsl:when test="$y1 > $y0">
          <xsl:value-of select="$y0"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$y1"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$xMin"/>
      <xsl:with-param name="y" select="$yMin - $lineWidth + 1"/>
      <xsl:with-param name="w" select="$xMax - $xMin"/>
      <xsl:with-param name="h" select="$lineWidth"/>
    </xsl:call-template>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$xMax - $lineWidth + 1"/>
      <xsl:with-param name="y" select="$yMax"/>
      <xsl:with-param name="w" select="$lineWidth"/>
      <xsl:with-param name="h" select="$yMin - $yMax"/>
    </xsl:call-template>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$xMin"/>
      <xsl:with-param name="y" select="$yMax"/>
      <xsl:with-param name="w" select="$xMax - $xMin"/>
      <xsl:with-param name="h" select="$lineWidth"/>
    </xsl:call-template>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$xMin"/>
      <xsl:with-param name="y" select="$yMax"/>
      <xsl:with-param name="w" select="$lineWidth"/>
      <xsl:with-param name="h" select="$yMin - $yMax"/>
    </xsl:call-template>
  </xsl:template>

  <!-- Render a <div> box -->
  <xsl:template name="mkDiv">
    <xsl:param name="x"/>
    <xsl:param name="y"/>
    <xsl:param name="w"/>
    <xsl:param name="h"/>

    <div style="position:absolute; left:{$x}px; top:{$y}px; width:{$w}px; height:{$h}px; background-color:{$lineColor}"><i/></div>
  </xsl:template>

  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
