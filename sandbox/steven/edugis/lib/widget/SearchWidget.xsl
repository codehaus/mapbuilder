<?xml version="1.0"?>
<xsl:stylesheet xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" encoding="utf-8"/><xsl:param name="lang">en</xsl:param><xsl:param name="modelId"/><xsl:param name="modelTitle"/><xsl:param name="targetModel"/><xsl:param name="widgetId"/><xsl:param name="title"/><xsl:param name="load"/><xsl:param name="defaultUrl"/><xsl:param name="formName">SearchInputForm</xsl:param><xsl:template match="/"><div><form name="{$formName}" id="{$formName}" onsubmit="return config.objects.{$widgetId}.submitForm()"><input name="defaultUrl" type="text" size="30" value="{$defaultUrl}"/><input type="button" onclick="javascript:config.objects.{$widgetId}.submitForm();" value="Search"/></form></div></xsl:template></xsl:stylesheet>