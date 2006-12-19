<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" >

<!--
Description: Prototype stylesheet to automatically generate a form from an XML doc.
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

XmlForm.xsl,v 1.1 2004/06/28 03:46:49 madair1 Exp
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <xsl:param name="procNode"></xsl:param>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName">XmlForm</xsl:param>

  <!-- Main html -->
	<xsl:template match="/">
    <div>
    <form name="{$formName}" id="{$formName}">
      <xsl:apply-templates select="wmc:ViewContext/wmc:General/wmc:ContactInformation"> 
        <xsl:with-param name="xpathRoot" select="'/wmc:ViewContext/wmc:General'"/>
      </xsl:apply-templates>
    </form>
    </div>
  </xsl:template>

	<xsl:template match="*">
    <xsl:param name="xpathRoot"/>
    <xsl:param name="xpathStr"><xsl:value-of select="$xpathRoot"/>/wmc:<xsl:value-of select="local-name()"/></xsl:param>
    <xsl:choose>
      <xsl:when test="string-length(normalize-space(text()))>0">
        <xsl:value-of select="name()"/>
        <xsl:element name="input">
          <xsl:attribute name="id">elId</xsl:attribute>
          <xsl:attribute name="type">text</xsl:attribute>
          <xsl:attribute name="value"><xsl:value-of select='text()'/></xsl:attribute>
          <xsl:attribute name="onchange">config.objects.<xsl:value-of select="$widgetId"/>.setValue(this,'<xsl:value-of select="$xpathStr"/>')</xsl:attribute>
        </xsl:element>
        <br/>
        <xsl:apply-templates>
          <xsl:with-param name="xpathRoot" select="$xpathStr"/>
        </xsl:apply-templates>
      </xsl:when>
      <xsl:otherwise>
        <dl>
          <dt>
            <xsl:value-of select="name()"/>
          </dt>
          <dd>
          <xsl:apply-templates>
            <xsl:with-param name="xpathRoot" select="$xpathStr"/>
          </xsl:apply-templates>
          </dd>
        </dl>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
	<xsl:template match="text()|@*"/>

</xsl:stylesheet>
