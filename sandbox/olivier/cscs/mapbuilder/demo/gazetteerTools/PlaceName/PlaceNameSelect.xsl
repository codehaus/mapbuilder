<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" 
   xmlns:ogc="http://www.opengis.net/ogc"
   xmlns:wfs="http://www.opengis.net/wfs" 
   xmlns:gml="http://www.opengis.net/gml" 
   xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"
   xmlns:cw="http://www.cubewerx.com/cw"
   xmlns:topp="http://www.openplans.org/topp"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: PlaceNameSelect.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
-->

  <xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- widgetText parameters -->
  <xsl:param name="selectPlace"/>
  <xsl:param name="placeNameCoords"/>
  <xsl:param name="transfer"/>
  <xsl:param name="close"/>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">PlaceNameLookupForm_</xsl:param>
  <xsl:param name="outputMode">selectBox</xsl:param>

  <!-- Main html -->
  <xsl:template match="/wfs:FeatureCollection">
    <xsl:variable name="featureSet" select="gml:featureMember"/>
    <div>
    
      <xsl:choose>
        <xsl:when test="count($featureSet)>0">
        
    <form name="{$formName}" id="{$formName}">
      <table>
        <tr>
          <td colspan="4">
          <xsl:value-of select="$selectPlace"/>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <select name="Results" size="10" onchange="setCoords(this.options[this.selectedIndex].value,this.form)">
              <xsl:apply-templates select="gml:featureMember"/>
            </select>
          </td>
        </tr>
        <tr>
         <td colspan="4">
            <xsl:value-of select="$placeNameCoords"/>
         </td> 
        </tr>
        <tr>
          <td>
            Lat:
            <input name="coordLat" type="text" size="4" maxlength="7" value=""/>
          </td>
          <td>
            Long:
            <input name="coordLong" type="text" size="4" maxlength="7" value=""/>
          </td>
          <td>
            <input name="transfer" type="button" value="{$transfer}" onclick="window.opener.setAoiCoords(this.form); return false;"/> 
          </td>
           <td>
              <input type="button" name="button" value="{$close}" onclick="window.close();"/>
           </td> 
        </tr>
      </table>
    </form>
    
        </xsl:when>
        <xsl:otherwise>
          No results found.
        </xsl:otherwise>
      </xsl:choose>
    
    </div>
  </xsl:template>

  <xsl:template match="topp:gnis">
     <xsl:variable name="coords" select="topp:the_geom/gml:Point/gml:coordinates"/>
     <option value="{$coords},international"> 
        <xsl:value-of select="topp:full_name"/>, <xsl:value-of select="topp:sub_national"/>, <xsl:value-of select="topp:country_name"/> (<xsl:call-template name="gnisTypeCode"/>)
     </option>
  </xsl:template>

  <xsl:template match="cw:GEONAMES">
     <xsl:variable name="place" select="cw:GEONAMES.GEONAME"/>
     <xsl:variable name="coords" select="cw:GEONAMES.GEOMETRY/gml:Point/gml:coordinates"/>

     <option value="{$coords},canadian"> 
        <xsl:value-of select="$place"/>, <xsl:call-template name="region"/>, Canada (<xsl:call-template name="conciseCode"/>)
     </option>
  </xsl:template>

  <xsl:template name="region">
    <xsl:variable name="region" select="cw:GEONAMES.REGION_CODE"/>
    <xsl:choose>
      <xsl:when test="$region='10'">Newfoundland and Labrador</xsl:when>
      <xsl:when test="$region='11'">Prince Edward Island</xsl:when>
      <xsl:when test="$region='12'">Nova Scotia</xsl:when>
      <xsl:when test="$region='13'">New Brunswick</xsl:when>
      <xsl:when test="$region='24'">Quebec</xsl:when>
      <xsl:when test="$region='35'">Ontario</xsl:when>
      <xsl:when test="$region='46'">Manitoba</xsl:when>
      <xsl:when test="$region='47'">Saskatchewan</xsl:when>
      <xsl:when test="$region='48'">Alberta</xsl:when>
      <xsl:when test="$region='59'">British Columbia</xsl:when>
      <xsl:when test="$region='60'">Yukon Territory</xsl:when>
      <xsl:when test="$region='61'">Northwest Territories</xsl:when>
      <xsl:when test="$region='62'">Nunavut</xsl:when>
      <xsl:when test="$region='73'">International Waters</xsl:when>
      <xsl:otherwise>Region Not Found</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="conciseCode">
    <xsl:variable name="conciseCode" select="cw:GEONAMES.CONCISE_CODE"/>
    <xsl:choose>
      <xsl:when test="$conciseCode='BAY'">Bay</xsl:when>
      <xsl:when test="$conciseCode='BCH'">Beach</xsl:when>
      <xsl:when test="$conciseCode='CAPE'">Cape</xsl:when>
      <xsl:when test="$conciseCode='CAVE'">Cave</xsl:when>
      <xsl:when test="$conciseCode='CHAN'">Channel</xsl:when>
      <xsl:when test="$conciseCode='CITY'">City</xsl:when>
      <xsl:when test="$conciseCode='CLF'">Cliff</xsl:when>
      <xsl:when test="$conciseCode='PARK'">Conservation area</xsl:when>
      <xsl:when test="$conciseCode='CRAT'">Crater</xsl:when>
      <xsl:when test="$conciseCode='FALL'">Falls</xsl:when>
      <xsl:when test="$conciseCode='FOR'">Forest</xsl:when>
      <xsl:when test="$conciseCode='GEOG'">Geographical area</xsl:when>
      <xsl:when test="$conciseCode='GLAC'">Glacier</xsl:when>
      <xsl:when test="$conciseCode='HAM'">Hamlet</xsl:when>
      <xsl:when test="$conciseCode='IR'">Indian Reserve</xsl:when>
      <xsl:when test="$conciseCode='ISL'">Island</xsl:when>
      <xsl:when test="$conciseCode='LAKE'">Lake</xsl:when>
      <xsl:when test="$conciseCode='VEGL'">Low vegetation</xsl:when>
      <xsl:when test="$conciseCode='MIL'">Military area</xsl:when>
      <xsl:when test="$conciseCode='MISC'">Miscellaneous</xsl:when>
      <xsl:when test="$conciseCode='MTN'">Mountain</xsl:when>
      <xsl:when test="$conciseCode='MUN1'">Other municipal/district area - major agglomeration</xsl:when>
      <xsl:when test="$conciseCode='MUN2'">Other municipal/district area - miscellaneous</xsl:when>
      <xsl:when test="$conciseCode='PLN'">Plain</xsl:when>
      <xsl:when test="$conciseCode='PROV'">Province</xsl:when>
      <xsl:when test="$conciseCode='RAP'">Rapids</xsl:when>
      <xsl:when test="$conciseCode='RIV'">River</xsl:when>
      <xsl:when test="$conciseCode='RIVF'">River feature</xsl:when>
      <xsl:when test="$conciseCode='SEA'">Sea</xsl:when>
      <xsl:when test="$conciseCode='SEAF'">Sea feature</xsl:when>
      <xsl:when test="$conciseCode='SHL'">Shoal</xsl:when>
      <xsl:when test="$conciseCode='SPRG'">Spring</xsl:when>
      <xsl:when test="$conciseCode='TERR'">Territory</xsl:when>
      <xsl:when test="$conciseCode='TOWN'">Town</xsl:when>
      <xsl:when test="$conciseCode='SEAU'">Undersea feature</xsl:when>
      <xsl:when test="$conciseCode='UNP'">Unincorporated area</xsl:when>
      <xsl:when test="$conciseCode='VALL'">Valley</xsl:when>
      <xsl:when test="$conciseCode='VILG'">Village</xsl:when>
      <xsl:otherwise>Feature Not Found</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template name="gnisTypeCode">
    <xsl:variable name="typeCode" select="topp:type"/>
    <xsl:choose>
      <xsl:when test="$typeCode='Seat Of A First-order Administrative Division'">City</xsl:when>
      <xsl:when test="$typeCode='Seat Of A Second-order Administrative Division'">City</xsl:when>
      <xsl:when test="$typeCode='Capital Of A Political Entity'">City</xsl:when>
      <xsl:otherwise><xsl:value-of select="$typeCode"/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="/ogc:ServiceExceptionReport">
    <p>Exception: <xsl:value-of select="ogc:ServiceException"/></p>
  </xsl:template>

  
</xsl:stylesheet>
