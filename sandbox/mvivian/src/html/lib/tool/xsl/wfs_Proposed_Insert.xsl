<?xml version="1.0"?>
<xsl:stylesheet xmlns:wfs="http://www.opengis.net/wfs"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:psma="http://www.psma.com.au/" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	version="1.0">
	<xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8"
		indent="yes" cdata-section-elements="psma:feature_collection" />
	<xsl:template match="/">
		<wfs:Transaction service="WFS">
			<wfs:Insert>
				  <psma:feedback_feed>
					<psma:community>tasmania</psma:community>
					<psma:feed_type>feedback</psma:feed_type>
					<psma:change_id>1</psma:change_id>
					<psma:author>mvivian</psma:author>
					<psma:reviewer />
					<psma:status>pending</psma:status>
					<psma:proposed_change>Insert</psma:proposed_change>
					<psma:feature_collection>
						&lt;gml:FeatureCollection&gt;
							<xsl:apply-templates mode="escape-xml"/>
						&lt;/gml:FeatureCollection&gt;
					</psma:feature_collection>
					<psma:source/>
					<psma:reviewer_note/>
				</psma:feedback_feed>
			</wfs:Insert>
		</wfs:Transaction>
	</xsl:template>
	
	<xsl:template match="text()|@*" />
	
	<xsl:template name="write-starttag">
		<xsl:text>&lt;</xsl:text>
		<xsl:value-of select="name()"/>
		<xsl:for-each select="@*">
			<xsl:call-template name="write-attribute"/>
		</xsl:for-each>
		<xsl:text>></xsl:text>
	</xsl:template>
	
	
	<xsl:template name="write-endtag">
		<xsl:text>&lt;/</xsl:text>
		<xsl:value-of select="name()"/>
		<xsl:text>></xsl:text>
	</xsl:template>
	
	
	<xsl:template name="write-attribute">
		<xsl:text> </xsl:text>
		<xsl:value-of select="name()"/>
		<xsl:text>="</xsl:text>
		<xsl:value-of select="."/>
		<xsl:text>"</xsl:text>
	</xsl:template>
	
	
	<xsl:template match="*" mode="escape-xml">
		<xsl:call-template name="write-starttag"/>
		<xsl:apply-templates mode="escape-xml"/>
		<xsl:call-template name="write-endtag"/>
	</xsl:template>

</xsl:stylesheet>
