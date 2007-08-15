<?xml version="1.0"?>
<xsl:stylesheet xmlns:wfs="http://www.opengis.net/wfs"
	xmlns:ogc="http://www.opengis.net/ogc"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8"
		indent="yes" />
	<xsl:template match="/">
		<wfs:Transaction service="WFS" version="1.0.0">
			<xsl:apply-templates />
		</wfs:Transaction>
	</xsl:template>
	<xsl:template match="gml:featureMember/*[@fid]">
		<wfs:Delete typeName="{name()}">
			<ogc:Filter>
				<ogc:FeatureId fid="{./@fid}" />
			</ogc:Filter>
		</wfs:Delete>
	</xsl:template>
	<xsl:template match="text()|@*" />
</xsl:stylesheet>
