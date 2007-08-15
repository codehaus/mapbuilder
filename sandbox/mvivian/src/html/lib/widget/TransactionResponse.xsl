<?xml version="1.0"?>
<xsl:stylesheet xmlns:ogc="http://www.opengis.net/ogc"
	xmlns:wfs="http://www.opengis.net/wfs"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="xml" />
	<xsl:template match="/">
		<div>
			<xsl:apply-templates />
		</div>
	</xsl:template>
	<xsl:template match="ogc:ServiceException">
		<table>
			<tr>
				<td>Service Exception:</td>
				<td>
					<xsl:apply-templates />
				</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template match="wfs:WFS_TransactionResponse">
		<table>
			<tr>
				<td>Transaction Status:</td>
				<td>
					<xsl:value-of
						select="name(wfs:TransactionResult/wfs:Status/*)" />
				</td>
			</tr>
			<tr>
				<td>New Feature Id:</td>
				<td>
					<xsl:value-of
						select="wfs:InsertResult/ogc:FeatureId/@fid" />
				</td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
