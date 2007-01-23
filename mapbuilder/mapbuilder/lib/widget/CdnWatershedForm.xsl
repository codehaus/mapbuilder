<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- Text params for this widget -->
  <xsl:param name="watershedTitle">Canadian Watershed Lookup service</xsl:param>
  <xsl:param name="watershedCode">Watershed code</xsl:param>

  <!-- The name of the form for coordinate output -->
  <xsl:param name="webServiceUrl">http://devgeo.cciw.ca:8080/WatershedLookupServlet/WatershedLookupServlet</xsl:param>
  <xsl:param name="formName">WatershedForm</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
    <form name="{$formName}" id="{$formName}" method="get" action="{$webServiceUrl}">
      <input name="request" type="hidden" value="GetWatershed"/>
      <input name="version" type="hidden" value="1.0.0"/>
    
      <table>
        <tr>
          <th align="left" colspan="3">
            <xsl:value-of select="$watershedTitle"/>
          </th>
        </tr>
        <tr>
          <td>
            <xsl:value-of select="$watershedCode"/>
          </td>
          <td>
            <input name="code" type="text" size="10" value="01E"/>
          </td>
          <td>
            <!--input type="submit"/-->
            <a href="javascript:config.objects.{$widgetId}.submitForm();">load web service data</a>
          </td>
        </tr>
      </table>
    </form>
    </div>
  </xsl:template>
  
</xsl:stylesheet>
