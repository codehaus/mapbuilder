<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: Strip white space and comments from XSL to make it more compact.
Author:      Cameron Shorter
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>

  <!--
  <xsl:template select="text()">
    <xsl:value-of select="normalize-space(.)"/>
  </xsl:template>
  -->

  <xsl:template 
    match="*|@*|processing-instruction()|text()">
    <xsl:copy>
      <xsl:apply-templates
       select="*|@*|processing-instruction()|text()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>

<!-- string=normalize-space(string) -->
