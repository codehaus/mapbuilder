<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!--
Description: Convert a Locations XML document (as per schema at lib/model/schemas/locations.xsd)
             into a HTML select box
Author:      Tom Kralidis
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: Locations.xsl,v 1.3 2004/02/27 14:05:36 tomkralidis Exp 
$Name$Name:  $
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder">
	<xsl:output method="xml" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<select name="locations" onchange="javascript:config.globalModelId.locationsId.setAoi(this.options[this.selectedIndex].value);" size="5">
		<xsl:for-each select="mb:QuickviewPresetResultSet/gml:featureMember/mb:locationDef">
			<xsl:variable name="bbox" select="translate(mb:spatialKeyword/gml:location/gml:Envelope/gml:coordinates,' ',',')"/>
			<option value="{$bbox}"><xsl:value-of select="gml:name"/></option>
		</xsl:for-each>
		</select>
	</xsl:template>
</xsl:stylesheet>
