<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" 
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:ogc="http://www.opengis.net/ogc"
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

  <!-- Main html -->
  <xsl:template match="/PostalCodeLookup">
    <xsl:variable name="featureSet" select="PostalCodeResultSet"/>
    <div>
      <xsl:choose>
        <xsl:when test="count($featureSet)>0">
          <table>
            <xsl:apply-templates select="PostalCodeResultSet/PostalCode"/>
          </table>
        </xsl:when>
        <xsl:otherwise>
          No results found.
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>
  
  <xsl:template match="PostalCode">
    <xsl:variable name="coords" select="gml:centerOf/gml:Point/gml:coordinates"/>
    <xsl:variable name="srs" select="gml:centerOf/gml:Point/@srsName"/>
    <xsl:variable name="lat" select="substring-after($coords, ',')"/>
    <xsl:variable name="long" select="substring-before($coords, ',')"/>

    <tr onmouseover="highlightChoice(new Array({$coords}),'{$srs}');"> 
      <th><xsl:value-of select="$postalCodeRegionTitle"/></th>
      <td>
        <a href="javascript:selectChoice(new Array({$coords}),'{$srs}');">
          <xsl:value-of select="Placename"/> (<xsl:value-of select="ProvinceOrTerritory"/>)
        </a>
      </td>
      <td>
        <a href="javascript:setAoiCoords(new Array({$coords}),'{$srs}');">
          transfer to your form
        </a>
      </td>
    </tr>
  </xsl:template>
  
  <xsl:template match="/ogc:ServiceExceptionReport">
    <div>
      Error: <xsl:value-of select="ogc:ServiceException"/>
    </div>
  </xsl:template>
  
  
</xsl:stylesheet>
