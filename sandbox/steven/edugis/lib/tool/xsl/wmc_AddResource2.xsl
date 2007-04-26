<?xml version="1.0"?>
<xsl:stylesheet xmlns:wmc="http://www.opengis.net/context" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="xml" omit-xml-declaration="yes"/>
<xsl:strip-space elements="*"/>
<xsl:param name="modelId"/>
<xsl:param name="widgetId"/>
<xsl:param name="version"/>
<xsl:param name="serverUrl"/>
<xsl:param name="serviceName"/>
<xsl:param name="serverTitle"/>
<xsl:param name="format"/>
<xsl:template match="Layer">
<wmc:Layer>
<xsl:attribute name="queryable">
<xsl:value-of select="./@queryable"/>
</xsl:attribute>
<xsl:attribute name="hidden">0</xsl:attribute>
<wmc:Server>
<xsl:attribute name="service">
<xsl:value-of select="$serviceName"/>
</xsl:attribute>
<xsl:attribute name="version">
<xsl:value-of select="$version"/>
</xsl:attribute>
<xsl:attribute name="title">
<xsl:value-of select="$serverTitle"/>
</xsl:attribute>
<wmc:OnlineResource xlink:type="simple" xlink:href="{$serverUrl}"/>
</wmc:Server>
<xsl:apply-templates select="child::node()"/>
<wmc:FormatList>
<wmc:Format current="1">
<xsl:value-of select="$format"/>
</wmc:Format>
</wmc:FormatList>
</wmc:Layer>
</xsl:template>
<xsl:template match="Style">
<wmc:StyleList>
<wmc:Style current="1">
<xsl:apply-templates select="child::node()"/>
</wmc:Style>
</wmc:StyleList>
</xsl:template>
<xsl:template match="LegendURL">
<wmc:LegendURL>
<xsl:apply-templates select="child::node()"/>
</wmc:LegendURL>
</xsl:template>
<xsl:template match="OnlineResource">
<xsl:variable name="legendUrl">
<xsl:value-of select="./@href"/>
</xsl:variable>
<wmc:OnlineResource xlink:type="simple" xlink:href="{$legendUrl}"/>
</xsl:template>
<xsl:template match="Layer/Title">
<wmc:Title>
<xsl:value-of select="."/>
</wmc:Title>
</xsl:template>
<xsl:template match="Layer/Name">
<wmc:Name>
<xsl:value-of select="."/>
</wmc:Name>
</xsl:template>
<xsl:template match="Layer/Abstract">
<wmc:Abstract>
<xsl:value-of select="."/>
</wmc:Abstract>
</xsl:template>
<xsl:template match="DataURL">
<wmc:DataURL>
<xsl:value-of select="."/>
</wmc:DataURL>
</xsl:template>
<xsl:template match="MetadataURL">
<wmc:MetadataURL>
<xsl:value-of select="."/>
</wmc:MetadataURL>
</xsl:template>
<xsl:template match="SRS">
<wmc:SRS>
<xsl:value-of select="."/>
</wmc:SRS>
</xsl:template>
<xsl:template match="owscat:service_resources">
<xsl:variable name="serverUrl">
<xsl:value-of select="owscat:endpoint_getresource"/>
</xsl:variable>
<wmc:Layer>
<xsl:attribute name="queryable">
<xsl:value-of select="./@queryable"/>
</xsl:attribute>
<xsl:attribute name="hidden">0</xsl:attribute>
<wmc:Server>
<xsl:attribute name="service">
<xsl:value-of select="owscat:service_type"/>
</xsl:attribute>
<xsl:attribute name="version">
<xsl:value-of select="owscat:service_version"/>
</xsl:attribute>
<xsl:attribute name="title">
<xsl:value-of select="owscat:organization"/>
</xsl:attribute>
<wmc:OnlineResource xlink:type="simple" xlink:href="{$serverUrl}"/>
</wmc:Server>
<xsl:apply-templates/>
</wmc:Layer>
</xsl:template>
<xsl:template match="owscat:title">
<wmc:Title>
<xsl:value-of select="."/>
</wmc:Title>
</xsl:template>
<xsl:template match="owscat:name">
<wmc:Name>
<xsl:value-of select="."/>
</wmc:Name>
</xsl:template>
<xsl:template match="owscat:abstract">
<wmc:Abstract>
<xsl:value-of select="."/>
</wmc:Abstract>
</xsl:template>
<xsl:template match="owscat:dataurl">
<wmc:DataURL>
<xsl:value-of select="."/>
</wmc:DataURL>
</xsl:template>
<xsl:template match="owscat:metadataurl">
<wmc:MetadataURL>
<xsl:value-of select="."/>
</wmc:MetadataURL>
</xsl:template>
<xsl:template match="owscat:srs">
<wmc:SRS>
<xsl:value-of select="."/>
</wmc:SRS>
</xsl:template>
<xsl:template match="text()|@*"/>
</xsl:stylesheet>