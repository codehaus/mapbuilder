<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" >
<!--
Description: Output the context title and abstract
Author:      Mike Adair mike.adairATnrcan.gc.ca
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
Abstract.xsl,v 1.5 2004/06/25 17:59:38 madair1 Exp

-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="widgetNode"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="abstract"/>
  <xsl:param name="moreInfo"/>
  
  <xsl:template match="/">
    <xsl:apply-templates select="wmc:ViewContext/wmc:General"/>
    <xsl:apply-templates select="wmc:OWSContext/wmc:General"/>
  </xsl:template>

  
  <!-- Main html -->
  <xsl:template match="wmc:General">
    <xsl:param name="metadataUrl" select="wmc:DescriptionURL/wmc:OnlineResource/@xlink:href"/>
    <xsl:param name="logoUrl" select="wmc:LogoURL/wmc:OnlineResource/@xlink:href"/>
    <div>
      <h3><xsl:value-of select="$abstract"/></h3>
      <xsl:if test="$logoUrl">
        <div style="float:right"><img src='{$logoUrl}' alt='{$logoUrl}'/></div>
      </xsl:if>
      <p>
        <xsl:choose>
          <xsl:when test="wmc:Abstract/@xml:lang">              
            <xsl:value-of select="wmc:Abstract[@xml:lang=$lang]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="wmc:Abstract"/>
          </xsl:otherwise>
        </xsl:choose>
        <!--br/><xsl:value-of select="{$widgetNode}/stylesheet"/-->
      </p>
      <p>
        <a href='{$metadataUrl}' title='{$metadataUrl}' target="moreInfo"><xsl:value-of select="$moreInfo"/></a>
      </p>
    </div>
  </xsl:template>

  <xsl:template match="text()|@*"/>
  

</xsl:stylesheet>

