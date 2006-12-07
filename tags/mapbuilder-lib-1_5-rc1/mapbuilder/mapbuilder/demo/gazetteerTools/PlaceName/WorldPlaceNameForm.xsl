<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: PostalCodeForm.xsl,v 1.7 2005/01/12 21:36:59 madair1 Exp $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="targetModel"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="featureTypeName"/>
  <xsl:param name="filterXpath"/>

  <!-- widgetText parameters -->
  <xsl:param name="title"/>
  <xsl:param name="placeName"/>
  <xsl:param name="country">Country:</xsl:param>
  <xsl:param name="find"/>
  <xsl:param name="exampleWorld"/>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">PlaceNameForm_</xsl:param>

  <!-- Main html -->
  <xsl:template match="/Filter">
    <div>

   <form name="{$formName}" id="{$formName}">
     <table>
      <tr>
        <th align="left" colspan="3">
          <img src="../skin/images/PN.gif" width="34px" height="35px"/>
          <xsl:value-of select="$title"/>
        </th>
      </tr>
      <tr>
        <td align="right">
         <xsl:value-of select="$placeName"/>
        </td>
        <td align="left">
         <xsl:variable name="placeValue" select="And/PropertyIsLike[PropertyName='topp:full_name_lc']/Literal"/>
         <input name="place" type="text" size="11" value="{$placeValue}"/>
        </td>
        <td align="left">
          <input type="submit" name="submitButton" value="{$find}"/>
        </td>
      </tr>
      <tr>
        <td align="right">
         <xsl:value-of select="$country"/>
        </td>
        <td align="left">
         <xsl:variable name="countryValue" select="And/PropertyIsLike[PropertyName='topp:country_name']/Literal"/>
         <input name="country" type="text" size="11" value="{$countryValue}"/>
        </td>
        <td/>
      </tr>
      <tr>
        <td align="left" colspan="2" style="font-style: italic">
          <xsl:value-of select="$exampleWorld"/>
        </td>
      </tr>
     </table>
   </form>
    </div>
  </xsl:template>

</xsl:stylesheet>
