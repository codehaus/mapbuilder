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
  
  <xsl:param name="width" select="200"/>
  <xsl:param name="height" select="100"/>
  <xsl:param name="bBoxMinX" select="-77.0"/>
  <xsl:param name="bBoxMinY" select="44.0"/>
  <xsl:param name="bBoxMaxX" select="-73.0"/>
  <xsl:param name="bBoxMaxY" select="47.0"/>
  <xsl:param name="color" select="FF0000"/>
  <xsl:param name="stroke" select="2"/>

  <xsl:variable name="xRatio" select="$width div ( $bBoxMaxX - $bBoxMinX )"/>
  <xsl:variable name="yRatio" select="$height div ( $bBoxMaxY - $bBoxMinY )"/>


  <!-- Root node -->
  <xsl:template match="/">
    <html>
      <body>
        <h1>GML Renderer</h1>
        <div>
          <xsl:apply-templates/>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Match and render a GML BBox -->
  <xsl:template match="gml:Box">
    <xsl:variable name="box" select="gml:coordinates"/>
    <xsl:variable name="x0" select="round((substring-before($box,',')-$bBoxMinX)*$xRatio)"/>
    <xsl:variable name="box2" select="substring-after($box,',')"/>
    <xsl:variable name="y0" select="round($height - (substring-before($box2,' ')-$bBoxMinY)*$yRatio)"/>
    <xsl:variable name="box3" select="substring-after($box2,' ')"/>
    <xsl:variable name="x1" select="round((substring-before($box3,',')-$bBoxMinX)*$xRatio)"/>
    <xsl:variable name="y1" select="round($height - (substring-after($box3,',')-$bBoxMinY)*$yRatio)"/>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$x0"/>
      <xsl:with-param name="y" select="$y0 - $stroke + 1"/>
      <xsl:with-param name="w" select="$x1 - $x0"/>
      <xsl:with-param name="h" select="$stroke"/>
    </xsl:call-template>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$x1 - $stroke + 1"/>
      <xsl:with-param name="y" select="$y1"/>
      <xsl:with-param name="w" select="$stroke"/>
      <xsl:with-param name="h" select="$y0 - $y1"/>
    </xsl:call-template>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$x0"/>
      <xsl:with-param name="y" select="$y1"/>
      <xsl:with-param name="w" select="$x1 - $x0"/>
      <xsl:with-param name="h" select="$stroke"/>
    </xsl:call-template>

    <xsl:call-template name="mkDiv">
      <xsl:with-param name="x" select="$x0"/>
      <xsl:with-param name="y" select="$y1"/>
      <xsl:with-param name="w" select="$stroke"/>
      <xsl:with-param name="h" select="$y0 - $y1"/>
    </xsl:call-template>
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
