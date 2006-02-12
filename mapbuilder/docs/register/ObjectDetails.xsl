<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xs="http://www.w3.org/2001/XMLSchema" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:out="http://www.w3.org/dummyXSL" >

<!--
Description: Generate the component register from the config XML schema.
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: XmlSchemaForm.xsl,v 1.6 2005/05/01 02:03:50 madair1 Exp $
-->

  <xsl:output method="xml" encoding="utf-8" indent="yes"/>
  <xsl:param name="objectType">AoiBoxType</xsl:param>
  <xsl:variable name="docRoot" select="/xs:schema"/>

	<xsl:template match="/xs:schema">
    <dl>
      <h3><xsl:value-of select="$objectType"/></h3>
      <xsl:apply-templates select="xs:complexType[@name=$objectType]"/>
    </dl>
	</xsl:template>
  
	<xsl:template match="xs:complexType">
    <xsl:apply-templates select="xs:sequence/xs:element"/>
    <xsl:apply-templates select="xs:complexContent/xs:extension"/>
	</xsl:template>
  
	<xsl:template match="xs:extension">
    <xsl:param name="objectType" select="substring-after(@base,':')"/>
    <xsl:apply-templates select="xs:sequence/xs:element"/>
    <xsl:apply-templates select="$docRoot/xs:complexType[@name=$objectType]"/>
	</xsl:template>
  
	<xsl:template match="xs:element">
    <dt><xsl:value-of select="@name"/> (<xsl:value-of select="@type"/>)</dt>
    <dd><xsl:value-of select="xs:annotation/xs:documentation"/></dd>
	</xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>


