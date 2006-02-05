<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

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
    <div>
    <form name="{$formName}" id="{$formName}">
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
            <input name="northCoord" type="text" size="10" style="font: 8pt Verdana, geneva, arial, sans-serif;" readonly="readonly"/>
          </td>
          <td>
          </td>
        </tr>
        <tr>
          <td>
            <xsl:value-of select="$west"/>
            <input name="westCoord" type="text" size="10" style="font: 8pt Verdana, geneva, arial, sans-serif;" readonly="readonly"/>
          </td>
          <td>
          </td>
          <td>
            <xsl:value-of select="$east"/>
            <input name="eastCoord" type="text" size="10" style="font: 8pt Verdana, geneva, arial, sans-serif;" readonly="readonly"/>
          </td>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            <xsl:value-of select="$south"/>
            <input name="southCoord" type="text" size="10" style="font: 8pt Verdana, geneva, arial, sans-serif;" readonly="readonly"/>
          </td>
          <td>
          </td>
        </tr>
      </table>
    </form>
    </div>
  </xsl:template>
  
</xsl:stylesheet>
