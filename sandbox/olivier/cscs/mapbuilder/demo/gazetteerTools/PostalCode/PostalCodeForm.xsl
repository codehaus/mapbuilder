<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: PostalCodeForm.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- widgetText parameters -->
  <xsl:param name="title"/>
  <xsl:param name="postalCode"/>
  <xsl:param name="find"/>
  <xsl:param name="example"/>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">PostalCodeForm_</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <div>

    <form name="{$formName}" id="{$formName}">
     <input name="request" type="hidden" value="GetPostalCode"/>
     <input name="sortarea" type="hidden" value="fsa"/>
     <input name="version" type="hidden" value="1.0.0"/>
     <table>
      <tr>
        <th align="left" colspan="2">
          <img src="../skin/images/PC.gif" width="34px" height="35px"/>
          <xsl:value-of select="$title"/>
        </th>
      </tr>
      <tr>
        <td>
         <xsl:value-of select="$postalCode"/>
         <input name="code" type="text" size="6" maxlength="7" value=""/>
        </td>
        <td align="left">
          <input type="submit" name="Button" value="{$find}"/>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="font-style: italic">
          <xsl:value-of select="$example"/>
        </td>
      </tr>
     </table>
   </form>
    </div>
  </xsl:template>

</xsl:stylesheet>
