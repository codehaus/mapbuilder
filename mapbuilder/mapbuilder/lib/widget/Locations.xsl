<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!-- $Id$ -->
<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:loc="http://mapbuilder.sourceforge.net/lib/model/locations">
	<xsl:output indent="yes" method="html"/> 
	<xsl:template match="/">
		<select>
		<xsl:for-each select="loc:QuickviewPresetResultSet/gml:featureMember/loc:locationDef">
			<xsl:variable name="bbox" select="loc:spatialKeyword/gml:location/gml:Envelope/gml:coordinates"/>
			<option value="{$bbox}"><xsl:value-of select="gml:name"/></option>
		</xsl:for-each>
		</select>
	</xsl:template>
</xsl:transform>
