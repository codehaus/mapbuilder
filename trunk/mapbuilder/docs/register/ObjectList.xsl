<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xs="http://www.w3.org/2001/XMLSchema" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:out="http://www.w3.org/dummyXSL" >

<!--
Description: Generate the component register from the config XML schema.
Author:      Mike Adair / Gertjan van Oosten
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8" indent="yes"/>
  
  <xsl:param name="widgetId"/>
  <xsl:param name="listType"/>
  <xsl:param name="subType"/>
  <xsl:param name="excludeType"/>
  
  <xsl:variable name="docRoot" select="/xs:schema"/>

  <xsl:template match="/xs:schema">
    <dl>
      <xsl:for-each select="xs:complexType[@name=$listType]/xs:choice/*">
        <xsl:variable name="typeName" select="substring-after(@type,':')"/>
        <xsl:variable name="typeDef" select="$docRoot/xs:complexType[@name=$typeName]"/>
        <xsl:choose>
        <xsl:when test="string-length($subType)=0 or $typeName=substring-after($subType,':') or $typeDef/xs:complexContent/xs:extension/@base=$subType">
          <dt><a href="javascript:config.objects.{$widgetId}.showDetails('{$typeName}')"><xsl:value-of select="@name"/></a></dt>
          <dd><xsl:value-of select="$typeDef/xs:annotation/xs:documentation"/></dd>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="findSubType">
            <xsl:with-param name="typeName" select="$typeName"/>
            <xsl:with-param name="typeDesc" select="$typeDef/xs:annotation/xs:documentation"/>
            <xsl:with-param name="typeBase" select="$typeName"/>
          </xsl:call-template>
        </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
    </dl>
  </xsl:template>

  <xsl:template name="findSubType">
    <xsl:param name="typeName"/>
    <xsl:param name="typeDesc"/>
    <xsl:param name="typeBase"/>
    <xsl:variable name="typeDef" select="$docRoot/xs:complexType[@name=$typeBase]"/>
    <xsl:if test="$typeBase and $typeBase!=substring-after($excludeType,':')">
      <xsl:choose>
        <xsl:when test="$typeDef/xs:complexContent/xs:extension/@base=$subType">
          <dt><a href="javascript:config.objects.{$widgetId}.showDetails('{$typeName}')"><xsl:value-of select="@name"/></a></dt>
          <dd><xsl:value-of select="$typeDesc"/></dd>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="findSubType">
            <xsl:with-param name="typeName" select="$typeName"/>
            <xsl:with-param name="typeDesc" select="$typeDesc"/>
            <xsl:with-param name="typeBase" select="substring-after($typeDef/xs:complexContent/xs:extension/@base,':')"/>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
