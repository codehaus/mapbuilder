<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Convert a Web Map Context into a HTML Legend
Author:      Cameron Shorter cameron ATshorter.net
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: Context2Legend.xml,v 1.6 2004/02/15 00:53:49 nedjo Exp $
$Name:  $
-->

  <xsl:output method="html"/>
  
  <xsl:param name="functionRef" select="'buttonBar.setMode'"/>
  
  <!-- Main html -->
  <xsl:template match="/MapbuilderConfig">
    <DIV>
      <xsl:apply-templates select="controllers/ButtonBar/buttonArray/Button"/>
    </DIV>
  </xsl:template>
  

  <xsl:template match="Button">
    <xsl:param name="linkUrl">javascript:<xsl:value-of select="$functionRef"/>(<xsl:value-of select="modeValue"/>)</xsl:param>
    <xsl:param name="imgId"><xsl:value-of select="@id"/></xsl:param>
 
    <A HREF="{$linkUrl}"><IMG ID="{$imgId}" BORDER="0"/></A>
  </xsl:template>

</xsl:stylesheet>
