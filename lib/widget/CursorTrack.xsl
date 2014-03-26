<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the cursor coordinates
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="widgetId"/>
  <xsl:param name="skinDir"/>
  
  <!-- text value params -->
  <xsl:param name="longitude">lon:</xsl:param>
  <xsl:param name="latitude">lat:</xsl:param>
  <xsl:param name="xcoord">x:</xsl:param>
  <xsl:param name="ycoord">y:</xsl:param>
  <xsl:param name="showXY">false</xsl:param>
  <xsl:param name="showDMS">false</xsl:param>
  <xsl:param name="showDM">false</xsl:param>
  <xsl:param name="showMGRS">false</xsl:param>
  <xsl:param name="showPx">false</xsl:param>
  <xsl:param name="showLatLong">true</xsl:param>
  
  <!-- params to allow pan or zoom to input -->
  <xsl:param name="showPanButton">false</xsl:param>
  <xsl:param name="showZoomButton">false</xsl:param>
  <xsl:param name="panButtonSrc"/>
  <xsl:param name="zoomButtonSrc"/>
  <xsl:param name="tooltipPan">Pan</xsl:param>
  <xsl:param name="tooltipZoom">Zoom</xsl:param>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName"/>

  <!-- Main html -->
  <xsl:template match="/">
    
    <div>
    <form name="{$formName}" id="{$formName}" onsubmit="return config.objects.{$widgetId}.submitForm()">
      
        <xsl:if test="$showXY='true'">
          <xsl:choose>
            <xsl:when test="($showPanButton='true') or ($showZoomButton='true')">
              <xsl:value-of select="$xcoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">x</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
              </xsl:call-template>
              <xsl:text> </xsl:text>
              <xsl:value-of select="$ycoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">y</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
              </xsl:call-template>
              <xsl:if test="$showPanButton='true'">
                <xsl:text> </xsl:text>
                <input type="button" title="{$tooltipPan}" class="cursorTrackInputButton" onclick="config.objects.{$widgetId}.doPan()" name="Pan">
                  <xsl:attribute name="style">background-image: url('<xsl:value-of select="concat($skinDir,$panButtonSrc)"/>');</xsl:attribute>
                </input>
              </xsl:if>
              <xsl:if test="$showPanButton='true'">
                <xsl:text> </xsl:text>
                <input type="button" title="{$tooltipZoom}" class="cursorTrackInputButton" onclick="config.objects.{$widgetId}.doZoom()" name="Zoom">
                  <xsl:attribute name="style">background-image: url('<xsl:value-of select="concat($skinDir,$zoomButtonSrc)"/>');</xsl:attribute>
                </input>
              </xsl:if>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$xcoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">x</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
                <xsl:with-param name="readonly">readonly</xsl:with-param>
              </xsl:call-template>
              <xsl:value-of select="$ycoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">y</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
                <xsl:with-param name="readonly">readonly</xsl:with-param>
              </xsl:call-template>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:if>
        
        <xsl:if test="$showPx='true'">
          <xsl:choose>
            <xsl:when test="($showPanButton='true') or ($showZoomButton='true')">
              <xsl:value-of select="$xcoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">px</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
              </xsl:call-template>
              <xsl:text> </xsl:text>
              <xsl:value-of select="$ycoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">py</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
              </xsl:call-template>
              <xsl:if test="$showPanButton='true'">
                <xsl:text> </xsl:text>
                <input type="button" title="{$tooltipPan}" class="cursorTrackInputButton" onclick="config.objects.{$widgetId}.doPan()" name="Pan">
                  <xsl:attribute name="style">background-image: url('<xsl:value-of select="concat($skinDir,$panButtonSrc)"/>');</xsl:attribute>
                </input>
              </xsl:if>
              <xsl:if test="$showPanButton='true'">
                <xsl:text> </xsl:text>
                <input type="button" title="{$tooltipZoom}" class="cursorTrackInputButton" onclick="config.objects.{$widgetId}.doZoom()" name="Zoom">
                  <xsl:attribute name="style">background-image: url('<xsl:value-of select="concat($skinDir,$zoomButtonSrc)"/>');</xsl:attribute>
                </input>
              </xsl:if>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$xcoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">px</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
                <xsl:with-param name="readonly">readonly</xsl:with-param>
              </xsl:call-template>
              <xsl:value-of select="$ycoord"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">py</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
                <xsl:with-param name="readonly">readonly</xsl:with-param>
              </xsl:call-template>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:if>
        
        <xsl:if test="$showDMS='true'">
          <xsl:value-of select="$longitude"/> 
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longdeg</xsl:with-param>
            <xsl:with-param name="size">3</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&#176;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longmin</xsl:with-param>
            <xsl:with-param name="size">2</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&apos;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longsec</xsl:with-param>
            <xsl:with-param name="size">2</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&quot;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longH</xsl:with-param>
            <xsl:with-param name="size">1</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&#8195;</xsl:text>

          <xsl:value-of select="$latitude"/> 
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latdeg</xsl:with-param>
            <xsl:with-param name="size">2</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&#176;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latmin</xsl:with-param>
            <xsl:with-param name="size">2</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&apos;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latsec</xsl:with-param>
            <xsl:with-param name="size">2</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&quot;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latH</xsl:with-param>
            <xsl:with-param name="size">1</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
        </xsl:if>
        
        <xsl:if test="$showDM='true'">
          <xsl:value-of select="$longitude"/> 
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longDMdeg</xsl:with-param>
            <xsl:with-param name="size">3</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&#176;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longDMmin</xsl:with-param>
            <xsl:with-param name="size">6</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&apos;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">longDMH</xsl:with-param>
            <xsl:with-param name="size">1</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&#8195;</xsl:text>

          <xsl:value-of select="$latitude"/> 
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latDMdeg</xsl:with-param>
            <xsl:with-param name="size">2</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&#176;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latDMmin</xsl:with-param>
            <xsl:with-param name="size">6</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
          <xsl:text>&apos;</xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">latDMH</xsl:with-param>
            <xsl:with-param name="size">1</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
        </xsl:if>

        <xsl:if test="$showLatLong='true'">
          <xsl:choose>
            <xsl:when test="($showPanButton='true') or ($showZoomButton='true')">
              <xsl:value-of select="$longitude"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">longitude</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
              </xsl:call-template>
              <xsl:text> </xsl:text>
              <xsl:value-of select="$latitude"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">latitude</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
              </xsl:call-template>
              <xsl:if test="$showPanButton='true'">
                <xsl:text> </xsl:text>
                <input type="button" title="{$tooltipPan}" class="cursorTrackInputButton" onclick="config.objects.{$widgetId}.doPan()" name="Pan">
                  <xsl:attribute name="style">background-image: url('<xsl:value-of select="concat($skinDir,$panButtonSrc)"/>');</xsl:attribute>
                </input>
              </xsl:if>
              <xsl:if test="$showPanButton='true'">
                <xsl:text> </xsl:text>
                <input type="button" title="{$tooltipZoom}" class="cursorTrackInputButton" onclick="config.objects.{$widgetId}.doZoom()" name="Zoom">
                  <xsl:attribute name="style">background-image: url('<xsl:value-of select="concat($skinDir,$zoomButtonSrc)"/>');</xsl:attribute>
                </input>
              </xsl:if>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$longitude"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">longitude</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
                <xsl:with-param name="readonly">readonly</xsl:with-param>
              </xsl:call-template>
              <xsl:value-of select="$latitude"/>
              <xsl:text> </xsl:text>
              <xsl:call-template name="renderInput">
                <xsl:with-param name="name">latitude</xsl:with-param>
                <xsl:with-param name="size">8</xsl:with-param>
                <xsl:with-param name="readonly">readonly</xsl:with-param>
              </xsl:call-template>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:if>
 
        <xsl:if test="$showMGRS='true'">
          <xsl:text>MGRS: </xsl:text>
          <xsl:call-template name="renderInput">
            <xsl:with-param name="name">mgrs</xsl:with-param>
            <xsl:with-param name="size">14</xsl:with-param>
            <xsl:with-param name="readonly">readonly</xsl:with-param>
          </xsl:call-template>
        </xsl:if>
     
    </form>
    </div>
  </xsl:template>
  
  <xsl:template name="renderInput">
    <xsl:param name="name"/>
    <xsl:param name="size"/>
    <xsl:param name="readonly">false</xsl:param>
    <input name="{$name}" type="text" size="{$size}">
      <xsl:if test="$readonly='readonly'">
        <xsl:attribute name="readonly">readonly</xsl:attribute>
        <xsl:attribute name="style">background-color: transparent; border: 0 none blue;</xsl:attribute>
      </xsl:if>
    </input>
  </xsl:template>

</xsl:stylesheet>
