<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:wmc="http://www.opengis.net/context"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Convert a Web Map Context into a HTML Legend
Author:      Cameron Shorter cameron ATshorter.net
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The name of the javascript context object to call -->
  <xsl:param name="context" select="'context'"/>

  <!-- Main html -->
  <xsl:template match="/">
    <xsl:apply-templates select="/wmc:ViewContext/wmc:LayerList"/>
  </xsl:template>

  <!-- LayerList -->
  <xsl:template match="/wmc:ViewContext/wmc:LayerList">
    <table border="0" cellpadding="1" cellspacing="0">
      <xsl:apply-templates/>
    </table>
  </xsl:template>
 
  <!-- Layer -->
  <xsl:template match="/wmc:ViewContext/wmc:LayerList/wmc:Layer">
    <tr>
      <!-- Visiblity -->
      <td>
        <xsl:if test="@hidden='0'">
          <input
            type="checkbox"
            checked="true"
            id="legend_{wmc:Name}"
            onclick="{$context}.setHidden(
              '{wmc:Name}',
              ! document.getElementById('legend_{wmc:Name}').checked)"/>
        </xsl:if>
        <xsl:if test="@hidden='1'">
          <input
            type="checkbox"
            id="legend_{wmc:Name}"
            onclick="{$context}.setHidden(
              '{wmc:Name}',
              ! document.getElementById('legend_{wmc:Name}').checked)"/>
        </xsl:if>
      </td>
      <td>
        <xsl:if test="@queryable='1'">
          <img
            id="query_{wmc:Name}"
            title="Click to set {wmc:Title} as the query layer"
            onclick="{$context}.queryLayer='{wmc:Name}'"
            src="../lib/skin/default/images/id.gif" />
        </xsl:if>
      </td>
      <td><xsl:value-of select="wmc:Title"/></td>
    </tr>
  </xsl:template>
</xsl:stylesheet>
