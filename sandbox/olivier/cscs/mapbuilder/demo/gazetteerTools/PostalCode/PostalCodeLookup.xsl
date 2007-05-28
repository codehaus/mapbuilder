<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" 
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: PostalCodeLookup.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
-->

  <xsl:output method="xml"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- widgetText parameters -->
  <xsl:param name="postalCodeCoords"/>
  <xsl:param name="postalCodeRegionTitle"/>
  <xsl:param name="transfer"/>
  <xsl:param name="close"/>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">PostalCodeLookup</xsl:param>

  <!-- Main html -->
  <xsl:template match="/PostalCodeLookup">
    <div>
      <xsl:apply-templates select="PostalCodeResultSet/PostalCode"/>
    </div>
  </xsl:template>
  <xsl:template match="PostalCodeResultSet/PostalCode">
    <xsl:variable name="coordinates" select="gml:centerOf/gml:Point/gml:coordinates"/>
    <xsl:variable name="lat" select="substring-after($coordinates, ',')"/>
    <xsl:variable name="long" select="substring-before($coordinates, ',')"/>

    <xsl:variable name="postalCodeRegion">
       <xsl:value-of select="Placename"/> (<xsl:value-of select="ProvinceOrTerritory"/>
    </xsl:variable>

     <form name="{$formName}" id="{$formName}">

      <table>
        <tr>
          <td>
            <xsl:value-of select="$postalCodeRegionTitle"/>
          </td>
          <td colspan="2">
            <input name="placeName" type="text" size="22" value="{$postalCodeRegion}"/>
          </td>
        </tr>
        <tr>
          <td colspan="3"><br />
            <xsl:value-of select="$postalCodeCoords"/>
          </td>
        </tr>
        <tr>
          <td>
            Lat:
            <input name="coordLat" type="text" size="4" maxlength="7" value="{$lat}"/>
          </td>
          <td>
            Long:
            <input name="coordLong" type="text" size="4" maxlength="7" value="{$long}"/>
          </td>
          <td>
            <input name="transfer" type="button" value="{$transfer}" onclick="window.opener.setAoiCoords(this.form); return false;"/>
          </td>
        </tr>
        <tr>
           <td colspan="2"/>
           <td align="left">
              <input type="button" name="button" value="{$close}" onclick="window.close();"/>
           </td>
        </tr>
      </table>
    </form>
  </xsl:template>
  
</xsl:stylesheet>
