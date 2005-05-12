<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xs="http://www.w3.org/2001/XMLSchema" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:out="http://www.w3.org/dummyXSL" >

<!--
Description: Generate the component register from the config XML schema.
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: XmlSchemaForm.xsl,v 1.6 2005/05/01 02:03:50 madair1 Exp $
-->

  <xsl:output method="xml" encoding="utf-8" indent="yes"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="listType">modelsType</xsl:param>
  <xsl:variable name="docRoot" select="/xs:schema"/>

	<xsl:template match="/xs:schema">
    <dl>
      <xsl:for-each select="xs:complexType[@name=$listType]/xs:choice/*">
        <xsl:variable name="typeName" select="substring-after(@type,':')"/>
        <xsl:variable name="typeDef" select="$docRoot/xs:complexType[@name=$typeName]"/>
        <dt><a href="javascript:config.objects.{$widgetId}.showDetails('{$typeName}')"><xsl:value-of select="@name"/></a></dt>
        <dd><xsl:value-of select="$typeDef/xs:annotation/xs:documentation"/></dd>
      </xsl:for-each>
    </dl>
	</xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
