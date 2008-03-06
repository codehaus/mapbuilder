<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns="http://www.opengis.net/ows-context/0.2.1"
  xmlns:wmc="http://www.opengis.net/context" 
  xmlns:wms="http://www.opengis.net/wms"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:ows="http://www.opengis.net/ows">
<!--
Description: Convert a WMC document to a OWS Context document.
Author:      Cameron Shorter
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: $
$Name:  $

-->
  <xsl:output method="xml" indent="yes"/>

  <!-- Root node -->
  <xsl:template match="/wmc:ViewContext">
    <OWSContext
      version="0.2.1"
      id="ows-context"
    	xmlns="http://www.opengis.net/ows-context/0.2.1"
    	xmlns:xlink="http://www.w3.org/1999/xlink"
			xmlns:ogc="http://www.opengis.net/ogc" 
			xmlns:ows="http://www.opengis.net/ows" 
      xmlns:param="http://www.opengis.net/param">
      <xsl:apply-templates/>
    </OWSContext>
  </xsl:template>

  <!-- General -->
  <xsl:template match="wmc:General">
    <General>
      <xsl:apply-templates/>
    </General>
  </xsl:template>

  <!-- Window -->
  <xsl:template match="wmc:Window">
    <Window>
      <xsl:attribute name="width">
        <xsl:value-of select="@width"/>
      </xsl:attribute>
      <xsl:attribute name="height">
        <xsl:value-of select="@height"/>
      </xsl:attribute>
    </Window>
  </xsl:template>

  <!-- BoundingBox -->
  <xsl:template match="wmc:BoundingBox">
    <BoundingBox>
      <xsl:attribute name="crs">
        <xsl:value-of select="@SRS"/>
      </xsl:attribute>
      <LowerCorner>
        <xsl:value-of select="concat(@minx,' ',@miny)"/>
      </LowerCorner>
      <UpperCorner>
        <xsl:value-of select="concat(@maxx,' ',@maxy)"/>
      </UpperCorner>
    </BoundingBox>
  </xsl:template>

  <!-- Elements of <General> -->

  <!-- Title -->
  <xsl:template match="wmc:Title">
    <Title>
      <xsl:value-of select="."/>
    </Title>
  </xsl:template>

  <!-- Abstract -->
  <xsl:template match="wmc:Abstract">
    <Abstract>
      <xsl:value-of select="."/>
    </Abstract>
  </xsl:template>

  <!-- TBD more <General> keywords etc go here ... -->

  <!-- LayerList -> ResourceList -->
  <xsl:template match="wmc:LayerList">
    <ResourceList>
      <xsl:apply-templates/>
    </ResourceList>
  </xsl:template>

  <!-- Layer -->
  <xsl:template match="wmc:Layer">
    <Layer queryable="{@queryable}" hidden="{@hidden}" id="{wmc:Name}-{generate-id()}">
      <xsl:apply-templates/>
    </Layer>
  </xsl:template>

  <!-- Name -> Identifier -->
  <xsl:template match="wmc:Name">
    <Identifier>
      <xsl:value-of select="."/>
    </Identifier>
  </xsl:template>

  <!-- TBD: OutputFormat -->

  <!-- <SRS>EPSG:4326 EPSG:4269</> -> <AvailableCRS>EPSG:4326</> -->
  <xsl:template match="wmc:SRS">
    <xsl:call-template name="tokenize">
      <xsl:with-param name="str" select="."/>
      <xsl:with-param name="tag" select="AvailableCRS"/>
    </xsl:call-template>
  </xsl:template>

  <!-- tokenize -->
  <!-- Extract words out of a space seperated string and return as tags -->
  <xsl:template name="tokenize">
    <xsl:param name="str"/>
    <xsl:param name="tag"/>
    <xsl:param name="sep" value=" "/>
    <xsl:choose>
      <!-- Remove white space from front of string -->
      <xsl:when test="starts-with($str,$sep)">
        <xsl:call-template name="tokenize">
          <xsl:with-param name="str" select="substr($str,2,string-length($str))"/>
          <xsl:with-param name="tag" select="$tag"/>
          <xsl:with-param name="sep" select="$sep"/>
        </xsl:call-template>
      </xsl:when>
      <!-- Remove white space from back of string -->
      <xsl:when test="starts-with($str,$sep)">
        <xsl:call-template name="tokenize">
          <xsl:with-param name="str" select="substr($str,string-length($str),string-length($str))"/>
          <xsl:with-param name="tag" select="$tag"/>
          <xsl:with-param name="sep" select="$sep"/>
        </xsl:call-template>
      </xsl:when>
      <!-- Recursively break up string around token -->
      <xsl:when test="contains($str,$sep)">
        <xsl:call-template name="tokenize">
          <xsl:with-param name="str" select="substr-before($str,$sep)"/>
          <xsl:with-param name="tag" select="$tag"/>
          <xsl:with-param name="sep" select="$sep"/>
        </xsl:call-template>
        <xsl:call-template name="tokenize">
          <xsl:with-param name="str" select="substr-after($str,$sep)"/>
          <xsl:with-param name="tag" select="$tag"/>
          <xsl:with-param name="sep" select="$sep"/>
        </xsl:call-template>
      </xsl:when>
      <!-- Write remaining token as node -->
      <xsl:when test="string-length($str)>0">
        <!--TBD Use Node instead of <AvailableCRS> -->
        <AvailableCRS>
          <xsl:value-of select="$str"/>
        </AvailableCRS>
      </xsl:when>
      <!-- Recursion stops when string is empty -->
    </xsl:choose>
  </xsl:template>
  <!-- Catch everything else -->
  <xsl:template match="text()|@*"/>
</xsl:stylesheet>
