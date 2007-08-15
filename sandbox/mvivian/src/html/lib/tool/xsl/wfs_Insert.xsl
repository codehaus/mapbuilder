<?xml version="1.0"?>
<xsl:stylesheet xmlns:wfs="http://www.opengis.net/wfs"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8"
		indent="yes" />
	<xsl:template match="/">
		<wfs:Transaction service="WFS">
			<wfs:Insert>
				<xsl:apply-templates />
			</wfs:Insert>
		</wfs:Transaction>
	</xsl:template>
	<xsl:template match="gml:featureMember">
		<xsl:for-each select="./*">
			<xsl:copy-of select="." />
		</xsl:for-each>
	</xsl:template>
	<xsl:template match="text()|@*" />
</xsl:stylesheet>
