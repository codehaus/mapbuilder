<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<!--

Description: Convert a Web Map Context into a HTML Legend

Author:      Cameron Shorter cameron ATshorter.net

Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html



$Id$

$Name$

-->

  <xsl:output method="xml" encoding="utf-8"/>

  

  <!-- The common params set for all widgets -->

  <xsl:param name="lang">en</xsl:param>

  <xsl:param name="modelId"/>

  

  <!-- empty template for now -->

  

  <xsl:template match="/*">

    <DIV>    

        <xsl:attribute name="STYLE">position:relative; top:0; left:0;</xsl:attribute>

  

      <IMG SRC='/mapbuilder/lib/skin/default/images/eye.gif' WIDTH='15' HEIGHT='15'/>

    </DIV>

  </xsl:template>

  

  <xsl:template match="text()|@*"/>

  

</xsl:stylesheet>

