<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!--
Description: Convert Mapbuilder Config to a list of buttons.
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

ButtonBar.xsl,v 1.5 2004/03/25 21:25:43 madair1 Exp
-->

  <xsl:output method="xml" omit-xml-declaration="yes"/>
  
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="skinDir" select="/MapbuilderConfig/skinDir"/>
  
  <!-- Main html   -->
  <xsl:template match="/MapbuilderConfig">
    <DIV>
      <xsl:apply-templates select="widgets/ButtonBar/tools"/>
    </DIV>
  </xsl:template>

  <xsl:template match="ButtonBar/tools/*">
    <xsl:param name="linkUrl">javascript:config.<xsl:value-of select="$modelId"/>.<xsl:value-of select="$widgetId"/>['<xsl:value-of select="name()"/>'].select()</xsl:param>
 
    <A HREF="{$linkUrl}"><IMG SRC="{$skinDir}/{disabledSrc}" ID="{@id}" BORDER="0"/></A>
  </xsl:template>

</xsl:stylesheet>
