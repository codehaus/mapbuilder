<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" >
<!--
Description: Output the context title and abstract
Author:      Mike Adair mike.adairATnrcan.gc.ca
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
$Name$
-->
	<xsl:output method="xml" encoding="utf-8"/>
	<!-- Main html -->
	<xsl:template match="/wmc:ViewContext/wmc:General">
		<xsl:param name="metadataUrl">
			<xsl:value-of select="wmc:DescriptionURL/wmc:OnlineResource/@xlink:href"/>
		</xsl:param>
		<xsl:param name="logoUrl">
			<xsl:value-of select="wmc:LogoURL/wmc:OnlineResource/@xlink:href"/>
		</xsl:param>
		<div>
			<h3>Abstract</h3>
			<div style="float:right">
				<img src='{$logoUrl}' alt='{$logoUrl}'/>
			</div>
			<p>
				<xsl:value-of select="wmc:Abstract"/>
			</p>
			<p>
				<a href='{$metadataUrl}' title='{$metadataUrl}'>more information</a>
			</p>
		</div>
	</xsl:template>
	<xsl:template match="text()|@*"/>
</xsl:stylesheet>
