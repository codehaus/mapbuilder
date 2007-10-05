<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context collection document to generate a context pick list
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: CollectionList.xsl 2956 2007-07-09 12:17:52Z steven $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xlink="http://www.w3.org/1999/xlink"
    exclude-result-prefixes="wmc xlink">

  <xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8"/>
  <xsl:strip-space elements="*"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>

  <!-- Text params for this widget -->
  <xsl:param name="title"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="widgetId"/>
  <xsl:param name="targetModel"/>

  <!-- template rule matching source root element -->
  <xsl:template match="/wmc:ViewContextCollection">

    <ul>
      <xsl:if test="$title">              
        <h3><xsl:value-of select="$title"/></h3>
      </xsl:if>
      <xsl:apply-templates select="wmc:ViewContextReference"/>
    </ul>

  </xsl:template>

  <xsl:template match="wmc:ViewContextReference">
    <xsl:param name="linkUrl">javascript:config.objects.<xsl:value-of select="$widgetId"/>.switchMap(config.objects.<xsl:value-of select="$widgetId"/>,'<xsl:value-of select="wmc:ContextURL/wmc:OnlineResource/@xlink:href"/>')</xsl:param>
    <li>    
      <a href="{$linkUrl}">
        <xsl:choose>
          <xsl:when test="wmc:Title/@xml:lang">              
            <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="wmc:Title"/>
          </xsl:otherwise>
        </xsl:choose>
      </a>
    </li>    
  </xsl:template>
  
</xsl:stylesheet>
