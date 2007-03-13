<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="xml" encoding="utf-8"/>
<xsl:param name="modelId"/>
<xsl:param name="widgetId"/>
<xsl:template match="/*">
<div class="featureLayer">
<div class="title">
			Laag: <xsl:value-of select="substring-before(name(./*), '_')"/>
</div>
<form>
<xsl:apply-templates/>
</form>
</div>
</xsl:template>
<xsl:template match="*">
<xsl:variable name="xlink">
<xsl:call-template name="getXpath">
<xsl:with-param name="node" select="."/>
</xsl:call-template>
</xsl:variable>
<xsl:if test="not(./*)">
<xsl:variable name="iets" select="name(.)"/>
<xsl:if test="not($iets='gml:coordinates')">
<div class="record">
<div class="name">
<xsl:value-of select="name(.)"/>
</div>
<div class="value">
<xsl:variable name="waarde">
<xsl:value-of select="format-number(text(),'#.##')"/>
</xsl:variable>
<input type="text" id="{$widgetId}{generate-id()}" value="{$waarde}" readonly="readonly"/>

</div>
</div>
</xsl:if>
</xsl:if>
<xsl:if test="./*">
<xsl:apply-templates/>
</xsl:if>
</xsl:template>
<xsl:template name="getXpath">
<xsl:param name="node"/>
<xsl:if test="name($node/..)">
<xsl:call-template name="getXpath">
<xsl:with-param name="node" select="$node/.."/>
</xsl:call-template>
</xsl:if>
<xsl:text>/</xsl:text>
<xsl:value-of select="name($node)"/>
</xsl:template>
<xsl:template match="comment()|text()|processing-instruction()"/>
</xsl:stylesheet>
