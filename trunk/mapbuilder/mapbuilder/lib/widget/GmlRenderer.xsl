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
  <xsl:output method="html" encoding="utf-8"/>
  
  <xsl:param name="width" select="400"/>
  <xsl:param name="height" select="200"/>
  <xsl:param name="bBoxMinX" select="-180"/>
  <xsl:param name="bBoxMinY" select="-90"/>
  <xsl:param name="bBoxMaxX" select="180"/>
  <xsl:param name="bBoxMaxY" select="90"/>
  <xsl:param name="color" select="red"/>
  <xsl:param name="lineWidth" select="2"/>
  <xsl:param name="skinDir"/>
  <xsl:param name="pointDiameter" select="10"/>

  <xsl:variable name="xRatio" select="$width div ( $bBoxMaxX - $bBoxMinX )"/>
  <xsl:variable name="yRatio" select="$height div ( $bBoxMaxY - $bBoxMinY )"/>


  <!-- Root node -->
  <xsl:template match="/">
    <!--div style="width: {$width}px; height: {$height}px; overflow: hidden"-->
      <div style="position:relative; width:{$width}; height:{$height}">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- Match and render a GML Point -->
  <xsl:template match="gml:pointMember/gml:Point">
    <xsl:variable name="x0" select="round((number(gml:coord/gml:X)-$bBoxMinX)*$xRatio - number($pointDiameter) div 2)"/>
    <xsl:variable name="y0" select="round($height - (number(gml:coord/gml:Y)-$bBoxMinY)*$yRatio - $pointDiameter div 2)"/>

    <div style="position:absolute; left:{$x0}px; top:{$y0}px; width:{$pointDiameter}px; height:{$pointDiameter}px">
      <img src="{$skinDir}/images/Dot.gif"/>
    </div>
  </xsl:template>

  <!-- Match and render a GML Envelope -->
  <xsl:template match="gml:Envelope">
    <xsl:variable name="x0" select="round((number(gml:coord[position()=1]/gml:X)-$bBoxMinX)*$xRatio)"/>
    <xsl:variable name="y0" select="round($height - (number(gml:coord[position()=1]/gml:Y) -$bBoxMinY)*$yRatio)"/>
    <xsl:variable name="x1" select="round((number(gml:coord[position()=2]/gml:X)-$bBoxMinX)*$xRatio)"/>
    <xsl:variable name="y1" select="round($height - (number(gml:coord[position()=2]/gml:Y)-$bBoxMinY)*$yRatio)"/>

    <xsl:call-template name="drawLine">
      <xsl:with-param name="x0" select="$x0"/>
      <xsl:with-param name="y0" select="$y0"/>
      <xsl:with-param name="x1" select="$x1"/>
      <xsl:with-param name="y1" select="$y0"/>
    </xsl:call-template>
    <xsl:call-template name="drawLine">
      <xsl:with-param name="x0" select="$x1"/>
      <xsl:with-param name="y0" select="$y0"/>
      <xsl:with-param name="x1" select="$x1"/>
      <xsl:with-param name="y1" select="$y1"/>
    </xsl:call-template>
    <xsl:call-template name="drawLine">
      <xsl:with-param name="x0" select="$x1"/>
      <xsl:with-param name="y0" select="$y1"/>
      <xsl:with-param name="x1" select="$x0"/>
      <xsl:with-param name="y1" select="$y1"/>
    </xsl:call-template>
    <xsl:call-template name="drawLine">
      <xsl:with-param name="x0" select="$x0"/>
      <xsl:with-param name="y0" select="$y1"/>
      <xsl:with-param name="x1" select="$x0"/>
      <xsl:with-param name="y1" select="$y0"/>
    </xsl:call-template>

    <xsl:call-template name="drawLine">
      <xsl:with-param name="x0" select="$x0"/>
      <xsl:with-param name="y0" select="$y0"/>
      <xsl:with-param name="x1" select="$x1"/>
      <xsl:with-param name="y1" select="$y1"/>
    </xsl:call-template>
    <xsl:call-template name="drawLine">
      <xsl:with-param name="x0" select="$x0"/>
      <xsl:with-param name="y0" select="$y1"/>
      <xsl:with-param name="x1" select="$x1"/>
      <xsl:with-param name="y1" select="$y0"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="drawLine">
    <xsl:param name="x0"/>
    <xsl:param name="y0"/>
    <xsl:param name="x1"/>
    <xsl:param name="y1"/>
    <xsl:variable name="slope" select="($y1 - $y0) div ($x1 - $x0)"/>

    <debug select="drawLine{$x0},{$y0},{$x1},{$y1} slope={$slope}"/>
    <xsl:choose>
      <xsl:when test="$x0 = $x1">
        <xsl:call-template name="fillBox">
          <xsl:with-param name="x0" select="$x0 - round($lineWidth div 2)"/>
          <xsl:with-param name="y0" select="$y0"/>
          <xsl:with-param name="x1" select="$x0 + round($lineWidth div 2)"/>
          <xsl:with-param name="y1" select="$y1"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$y0 = $y1">
        <xsl:call-template name="fillBox">
          <xsl:with-param name="x0" select="$x0"/>
          <xsl:with-param name="y0" select="$y0 - round($lineWidth div 2)"/>
          <xsl:with-param name="x1" select="$x1"/>
          <xsl:with-param name="y1" select="$y1 + round($lineWidth div 2)"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$slope > 0.5 or $slope &lt; -0.5">
        <xsl:call-template name="drawSteepLine">
          <xsl:with-param name="slope" select="$slope"/>
          <xsl:with-param name="x0" select="$x0"/>
          <xsl:with-param name="x1" select="$x1"/>
          <xsl:with-param name="y1" select="$y1"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="drawFlatLine">
          <xsl:with-param name="slope" select="$slope"/>
          <xsl:with-param name="y0" select="$y0"/>
          <xsl:with-param name="x1" select="$x1"/>
          <xsl:with-param name="y1" select="$y1"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- Draw Line with height > width.  Recursively calls itself drawing a series
  of vertical lines with each recursion. -->
  <xsl:template name="drawSteepLine">
    <xsl:param name="slope"/> <!-- height/width -->
    <xsl:param name="x0"/>
    <xsl:param name="x1"/>
    <xsl:param name="y1"/>
    
    <xsl:variable name="inc">
      <xsl:choose>
        <xsl:when test="$x0 &lt; $x1">1</xsl:when>
        <xsl:otherwise>-1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <debug select="drawSteepLine {$x0},y0,{$x1},{$y1} slope={$slope} inc={$inc}"/>

    <xsl:call-template name="fillBox">
      <xsl:with-param name="x0" select="$x0 - round(($lineWidth - 1) div 2)"/>
      <xsl:with-param name="y0" select="$y1 + round($slope * ($x0 - $x1))"/>
      <xsl:with-param name="x1" select="$x0 + round(($lineWidth - 1) div 2)"/>
      <xsl:with-param name="y1" select="$y1 + round($slope * ($x0 - $x1 - $inc))"/>
    </xsl:call-template>
    
    <xsl:if test="$x0 + 2 * $inc != $x1">
      <xsl:call-template name="drawSteepLine">
        <xsl:with-param name="x0" select="$x0 + $inc"/>
        <xsl:with-param name="x1" select="$x1"/>
        <xsl:with-param name="y1" select="$y1"/>
        <xsl:with-param name="slope" select="$slope"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Draw Line with width > height.  Recursively calls itself drawing a series
  of horizontal lines with each recursion. -->
  <xsl:template name="drawFlatLine">
    <xsl:param name="slope"/> <!-- height/width -->
    <xsl:param name="y0"/>
    <xsl:param name="x1"/>
    <xsl:param name="y1"/>
    
    <xsl:variable name="inc">
      <xsl:choose>
        <xsl:when test="$y0 &lt; $y1">1</xsl:when>
        <xsl:otherwise>-1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <debug select="drawFlatLine x0,{$y0},{$x1},{$y1} slope={$slope} inc={$inc}"/>

    <xsl:call-template name="fillBox">
      <xsl:with-param name="x0" select="$x1 - round(($y1 - $y0) div $slope)"/>
      <xsl:with-param name="y0" select="$y0 - round(($lineWidth - 1) div 2)"/>
      <xsl:with-param name="x1" select="$x1 - round(($y1 - $y0 - $inc) div $slope)"/>
      <xsl:with-param name="y1" select="$y0 + round(($lineWidth - 1) div 2)"/>
    </xsl:call-template>
    
    <xsl:if test="$y0 + 2 * $inc != $y1">
      <xsl:call-template name="drawFlatLine">
        <xsl:with-param name="y0" select="$y0 + $inc"/>
        <xsl:with-param name="x1" select="$x1"/>
        <xsl:with-param name="y1" select="$y1"/>
        <xsl:with-param name="slope" select="$slope"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Render a solid box -->
  <xsl:template name="fillBox">
    <xsl:param name="x0"/>
    <xsl:param name="y0"/>
    <xsl:param name="x1"/>
    <xsl:param name="y1"/>

    <debug select="fillBox {$x0},{$y0},{$x1},{$y1}"/>
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
          <xsl:value-of select="$y0"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$y1"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="yMax">
      <xsl:choose>
        <xsl:when test="$y1 > $y0">
          <xsl:value-of select="$y1"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$y0"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <div style="position:absolute; left:{$xMin}px; top:{$yMin}px; width:{$xMax - $xMin +1}px; height:{$yMax -$yMin +1}px; background-color:{$color}"><i/></div>
  </xsl:template>

  <!-- Render a <div> box -->
  <xsl:template name="mkDiv">
    <xsl:param name="x"/>
    <xsl:param name="y"/>
    <xsl:param name="w"/>
    <xsl:param name="h"/>

    <div style="position:absolute; left:{$x}px; top:{$y}px; width:{$w}px; height:{$h}px; background-color:{$color}"><i/></div>
  </xsl:template>

  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
