<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the cursor coordinates
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: CursorTrack.xsl 2576 2007-02-19 09:14:01Z gjvoosten $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  
  <!-- text value params -->
  <xsl:param name="longitude">lon:</xsl:param>
  <xsl:param name="latitude">lat:</xsl:param>
  <xsl:param name="xcoord">x:</xsl:param>
  <xsl:param name="ycoord">y:</xsl:param>
  <xsl:param name="pixel">pixel:</xsl:param>
  <xsl:param name="line">line:</xsl:param>
  <xsl:param name="showXY">false</xsl:param>
  <xsl:param name="showDMS">false</xsl:param>
  <xsl:param name="showDM">false</xsl:param>
  <xsl:param name="showMGRS">false</xsl:param>
  <xsl:param name="showPx">false</xsl:param>
  <xsl:param name="showLatLong">true</xsl:param>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName"/>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
    <form name="{$formName}" id="{$formName}">
      <ul>
      
        <xsl:if test="$showPx='true'">
          <li>
            <span class="cursorTrackLeft">
              <xsl:value-of select="$pixel"/> <input name="px" type="text" size="8" readonly="readonly"/>
            </span>
            <span class="cursorTrackRight">
              <xsl:value-of select="$line"/> <input name="py" type="text" size="8" readonly="readonly"/>
            </span>
          </li>
        </xsl:if>
        
        <xsl:if test="$showXY='true'">
          <li>
            <span class="cursorTrackLeft">
              <xsl:value-of select="$xcoord"/> <input name="x" type="text" size="8" readonly="readonly"/>
            </span>
            <span class="cursorTrackRight">
              <xsl:value-of select="$ycoord"/> <input name="y" type="text" size="8" readonly="readonly"/>
            </span>
          </li>
        </xsl:if>
        
        <xsl:if test="$showDMS='true'">
          <li>
            <span class="cursorTrackLeft">
              <xsl:value-of select="$longitude"/> 
              <input name="longdeg" type="text" size="3" readonly="readonly"/>&#176;
              <input name="longmin" type="text" size="2" readonly="readonly"/>&apos;
              <input name="longsec" type="text" size="2" readonly="readonly"/>&quot;
              <input name="longH" type="text" size="1" readonly="readonly"/>&#8195;
            </span>
            <span class="cursorTrackRight">
              <xsl:value-of select="$latitude"/> 
              <input name="latdeg" type="text" size="2" readonly="readonly"/>&#176;
              <input name="latmin" type="text" size="2" readonly="readonly"/>&apos;
              <input name="latsec" type="text" size="2" readonly="readonly"/>&quot;
              <input name="latH" type="text" size="1" readonly="readonly"/>
            </span>
          </li>
        </xsl:if>
        
        <xsl:if test="$showDM='true'">
          <li>
            <span class="cursorTrackLeft">
              <xsl:value-of select="$longitude"/> 
              <input name="longDMdeg" type="text" size="3" readonly="readonly"/>&#176;
              <input name="longDMmin" type="text" size="6" readonly="readonly"/>&apos;
              <input name="longDMH" type="text" size="1" readonly="readonly"/>&#8195;
            </span>
            <span class="cursorTrackRight">
              <xsl:value-of select="$latitude"/> 
              <input name="latDMdeg" type="text" size="2" readonly="readonly"/>&#176;
              <input name="latDMmin" type="text" size="6" readonly="readonly"/>&apos;
              <input name="latDMH" type="text" size="1" readonly="readonly"/>
            </span>
          </li>
        </xsl:if>

        <xsl:if test="$showLatLong='true'">
          <li>
            <span class="cursorTrackLeft">
              <xsl:value-of select="$longitude"/> <input name="longitude" type="text" size="8" readonly="readonly"/>
            </span>
            <span class="cursorTrackRight">
              <xsl:value-of select="$latitude"/> <input name="latitude" type="text" size="8" readonly="readonly"/>
            </span>
          </li>
        </xsl:if>
 
        <xsl:if test="$showMGRS='true'">
          <li>
          MGRS: <input name="mgrs" type="text" size="14" readonly="readonly"/>
          </li>
        </xsl:if>
     
      </ul>
      </form>
    </div>
  </xsl:template>

</xsl:stylesheet>
