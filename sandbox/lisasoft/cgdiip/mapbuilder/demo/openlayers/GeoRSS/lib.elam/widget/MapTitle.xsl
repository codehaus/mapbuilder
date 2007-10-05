<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:wmc="http://www.opengis.net/context"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Displays the Title value from a Web Map Context document
Author:      Cameron Shorter cameron ATshorter.net
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapTitle.xsl 1608 2005-08-03 19:07:09Z mattdiez $
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <xsl:param name="lang">en</xsl:param>

  <!-- Main html -->
  <xsl:template match="/wmc:ViewContext/wmc:General | /wmc:OWSContext/wmc:General ">
    <span>
      <xsl:choose>
        <xsl:when test="wmc:Title/@xml:lang">              
          <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="wmc:Title"/>
        </xsl:otherwise>
      </xsl:choose>
    </span>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>

