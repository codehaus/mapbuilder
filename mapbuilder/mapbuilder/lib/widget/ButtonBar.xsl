<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 

  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!--

  xmlns:mb="http://mapbuilder.sourceforge.net/config" 

  exclude-result-prefixes="mb">

  -->



<!--

Description: Convert a Web Map Context into a HTML Legend

Author:      Cameron Shorter cameron ATshorter.net

Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html



$Id$

$Name$

-->



  <xsl:output method="xml" omit-xml-declaration="yes"/>

  

  <xsl:param name="functionRef" select="'buttonBar.setMode'"/>

  <xsl:param name="skinDir" select="/MapbuilderConfig/skinDir"/>

  

  <!-- Main html -->

  <xsl:template match="/MapbuilderConfig">

    <DIV>

      <xsl:apply-templates select="views/ButtonBar/buttonArray/Button"/>

    </DIV>

  </xsl:template>

  



  <xsl:template match="Button">

    <xsl:param name="linkUrl">javascript:<xsl:value-of select="$functionRef"/>(<xsl:value-of select="modeValue"/>)</xsl:param>

    <xsl:param name="imgId"><xsl:value-of select="@id"/></xsl:param>

    <xsl:param name="imgSrc"><xsl:value-of select="$skinDir"/><xsl:value-of select="disabledSrc"/></xsl:param>

 

    <A HREF="{$linkUrl}"><IMG SRC="{$imgSrc}" ID="{$imgId}" BORDER="0"/></A>

  </xsl:template>



</xsl:stylesheet>

