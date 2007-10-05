<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Outputs a form for use as a WebServiceForm widget that connects to
             the CGDI NTS lookup service (returns outline of NTS Mapsheet indexes).
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: NtsForm.xsl 1608 2005-08-03 19:07:09Z mattdiez $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- Text params for this widget -->
  <xsl:param name="ntsTitle"/>
  <xsl:param name="mapsheet"/>

  <!-- The name of the form for coordinate output -->
  <xsl:param name="webServiceUrl">http://geoservices.cgdi.ca/NTS/NTSLookup</xsl:param>
  <xsl:param name="formName">NTSForm</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <DIV>
    <form name="{$formName}" id="{$formName}" method="get" action="{$webServiceUrl}">
      <input name="request" type="hidden" value="GetMapsheet"/>
      <input name="version" type="hidden" value="1.1.2"/>
    
      <table>
        <tr>
          <th align="left" colspan="3">
            <xsl:value-of select="$ntsTitle"/>
          </th>
        </tr>
        <tr>
          <td>
            <xsl:value-of select="$mapsheet"/>
          </td>
          <td>
            <input name="mapsheet" type="text" size="10" value="31G05"/>
          </td>
          <td>
            <!--input type="submit"/-->
            <a href="javascript:config.objects.{$widgetId}.submitForm();">load web service data</a>
          </td>
        </tr>
      </table>
    </form>
    </DIV>
  </xsl:template>
  
</xsl:stylesheet>
