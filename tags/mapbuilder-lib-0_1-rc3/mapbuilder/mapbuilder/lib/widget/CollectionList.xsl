<?xml version="1.0" encoding="ISO-8859-1"?>



<!--

Description: parses an OGC context collection document to generate a context pick list

Author:      adair

Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .



$Id$

$Name$

-->



<xsl:stylesheet version="1.0" 

    xmlns:cml="http://www.opengis.net/context" 

    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

    xmlns:xlink="http://www.w3.org/1999/xlink"

    exclude-result-prefixes="cml xlink">



  <xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8"/>

  <xsl:strip-space elements="*"/>



  <!-- The coordinates of the DHTML Layer on the HTML page -->

  <xsl:param name="jsfunction">config.loadModel('</xsl:param>
  <xsl:param name="targetModel"/>



  <!-- template rule matching source root element -->

  <xsl:template match="/cml:ViewContextCollection">


    <UL>
      Select a context to load:
      <xsl:apply-templates select="cml:ViewContextReference"/>

    </UL>

  </xsl:template>

  

  <xsl:template match="cml:ViewContextReference">

    <xsl:param name="linkUrl">javascript:<xsl:value-of select="$jsfunction"/><xsl:value-of select="$targetModel"/>','<xsl:value-of select="cml:ContextURL/cml:OnlineResource/@xlink:href"/>')</xsl:param>

    <LI>    

      <A HREF="{$linkUrl}"><xsl:value-of select="cml:Title"/></A>

    </LI>    

  </xsl:template>



</xsl:stylesheet>

