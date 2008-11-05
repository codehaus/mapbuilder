<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context collection document to generate a context pick list
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: CollectionList.xsl 2956 2007-07-09 12:17:52Z steven $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xlink="http://www.w3.org/1999/xlink"
    exclude-result-prefixes="xlink">

  <xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8"/>
  <xsl:strip-space elements="*"/>

  <!-- The common params set for all widgets -->
  <!-- TBD: I don't think language is supported by atom protocol, so 
       lang param doesn't make sense here.
       Check.  -->
  <xsl:param name="lang">en</xsl:param>

  <!-- Text params for this widget -->
  <!-- TBD: Deprecated. This is not used any more -->
  <xsl:param name="title"/>

  <!-- The names of the javascript object for this widget-->
  <xsl:param name="widgetId"/>

  <!-- match root element -->
  <xsl:template match="/atom:feed">
    <div>
      <xsl:if test="/atom:feed/atom:title">              
        <h3><xsl:value-of select="/atom:feed/atom:title"/></h3>
      </xsl:if>
      <ul>
        <xsl:apply-templates select="atom:entry"/>
      </ul>
    </div>
  </xsl:template>

  <!-- match each Context entry -->
  <xsl:template match="atom:entry">
    <xsl:param name="linkUrl">javascript:config.objects.<xsl:value-of select="$widgetId"/>.switchModel(config.objects.<xsl:value-of select="$widgetId"/>,'<xsl:value-of select="atom:content/@src"/>')</xsl:param>
    <li>    
      <a href="{$linkUrl}">
      <xsl:value-of select="atom:title"/>
      </a>
    </li>    
  </xsl:template>
  
</xsl:stylesheet>
