<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

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
  <xsl:param name="searchFormTitle"/>
  <xsl:param name="north"/>
  <xsl:param name="south"/>
  <xsl:param name="east"/>
  <xsl:param name="west"/>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">AOIForm</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <form name="{$formName}" id="{$formName}" method="get" action="defaultUrl">
      <table>
        <tr>
          <th align="left" colspan="3">
            <xsl:value-of select="$searchFormTitle"/>
          </th>
        </tr>
        <tr>
          <td>
            keyword:
          </td>
          <td>
            <input name="keyword" type="text" size="10"/>
          </td>
          <td>
            <input type="submit"/>
          </td>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            <xsl:value-of select="$north"/>
            <input NAME="northCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
          <td>
          </td>
        </tr>
        <tr>
          <td>
            <xsl:value-of select="$west"/>
            <input NAME="westCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
          <td>
          </td>
          <td>
            <xsl:value-of select="$east"/>
            <input NAME="eastCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            <xsl:value-of select="$south"/>
            <input NAME="southCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
          <td>
          </td>
        </tr>
      </table>
    </form>
  </xsl:template>
  
</xsl:stylesheet>
