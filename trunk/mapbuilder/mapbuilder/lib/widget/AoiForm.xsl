<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the context doc AOI
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">AOIForm</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <FORM NAME="{$formName}" ID="{$formName}">
      <table>
        <tr>
          <th align="left" colspan="3">
            AOI coordinates
          </th>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            North:
            <input NAME="northCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
          <td>
          </td>
        </tr>
        <tr>
          <td>
            West:
            <input NAME="westCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
          <td>
          </td>
          <td>
            East:
            <input NAME="eastCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            South:
            <input NAME="southCoord" TYPE="text" SIZE="10" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;"/>
          </td>
          <td>
          </td>
        </tr>
      </table>
    </FORM>
  </xsl:template>

</xsl:stylesheet>
