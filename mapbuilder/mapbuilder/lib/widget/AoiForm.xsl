<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

AoiForm.xsl,v 1.2 2004/06/25 17:59:38 madair1 Exp
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">AOIForm</xsl:param>

  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  <xsl:param name="north"/>
  <xsl:param name="south"/>
  <xsl:param name="east"/>
  <xsl:param name="west"/>
  
  <!-- Main html -->
  <xsl:template match="/">
    <DIV>
    <FORM NAME="{$formName}" ID="{$formName}">
      <table>
        <tr>
          <th align="left" colspan="3">
            <xsl:value-of select="$title"/>
          </th>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            <xsl:value-of select="$north"/>
            <input NAME="northCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;" READONLY="readonly"/>
          </td>
          <td>
          </td>
        </tr>
        <tr>
          <td>
            <xsl:value-of select="$west"/>
            <input NAME="westCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;" READONLY="readonly"/>
          </td>
          <td>
          </td>
          <td>
            <xsl:value-of select="$east"/>
            <input NAME="eastCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;" READONLY="readonly"/>
          </td>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            <xsl:value-of select="$south"/>
            <input NAME="southCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;" READONLY="readonly"/>
          </td>
          <td>
          </td>
        </tr>
      </table>
    </FORM>
    </DIV>
  </xsl:template>
  
</xsl:stylesheet>
