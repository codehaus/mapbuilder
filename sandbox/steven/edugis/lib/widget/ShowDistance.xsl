<?xml version="1.0"?>
<xsl:stylesheet xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" omit-xml-declaration="yes"/><xsl:param name="modelId"/><xsl:param name="widgetId"/><xsl:param name="action"/><xsl:param name="skinDir" select="/mb:MapbuilderConfig/mb:skinDir"/><xsl:param name="distance">Afstand:</xsl:param><xsl:param name="formName"/><xsl:template match="/"><div><form name="{$formName}" id="{$formName}"><xsl:value-of select="$distance"/><input name="distance" type="text" size="8" readonly="readonly"/></form></div></xsl:template></xsl:stylesheet>
