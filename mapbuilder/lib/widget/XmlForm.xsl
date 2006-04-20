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
      <xsl:apply-templates select="wmc:ViewContext/wmc:General/wmc:ContactInformation"/> 
    </form>
    </div>
  </xsl:template>

	<xsl:template match="*">
    <xsl:choose>
      <xsl:when test="string-length(normalize-space(text()))>0">
        <xsl:value-of select="name()"/>
        <xsl:element name="INPUT">
          <xsl:attribute name="ID">elId</xsl:attribute>
          <xsl:attribute name="TYPE">text</xsl:attribute>
          <xsl:attribute name="VALUE"><xsl:value-of select='text()'/></xsl:attribute>
        </xsl:element>
        <br/>
        <xsl:apply-templates /> 
      </xsl:when>
      <xsl:otherwise>
        <dl>
          <dt>
            <xsl:value-of select="name()"/>
          </dt>
          <dd>
            <xsl:apply-templates /> 
          </dd>
        </dl>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
	<xsl:template match="text()|@*"/>

</xsl:stylesheet>
