<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:psma="http://www.psma.com.au/" 
	version="1.0">
	<xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>
	
	<xsl:template match="/">
		<gml:featureMember xmlns:psma="http://www.psma.com.au/" xmlns:gml="http://www.opengis.net/gml">
	    	<psma:feedback_feed>
				<psma:community>tasmania</psma:community>
				<psma:feed_type>feedback</psma:feed_type>
				<psma:author></psma:author>
				<psma:status>pending</psma:status>
				<psma:proposed_change>Insert</psma:proposed_change>
				<psma:feature_collection>
					<xsl:copy-of select="/"/>
				</psma:feature_collection>
			</psma:feedback_feed>
		</gml:featureMember>
	</xsl:template>
</xsl:stylesheet>
