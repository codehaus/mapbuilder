<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:psma="http://www.psma.com.au/" 
	version="1.0">
	<xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>
	
	<xsl:template match="/">
		<gml:featureMember xmlns:psma="http://www.psma.com.au/" xmlns:gml="http://www.opengis.net/gml">
	    	<psma:feedback_feed>
				<psma:community>BC</psma:community>
				<psma:feed_type>feedback</psma:feed_type>
				<psma:author></psma:author>
				<psma:status>pending</psma:status>
				<psma:proposed_change></psma:proposed_change>
				<psma:the_geom>
					<gml:MultiPolygon srsName="epsg:4326">
				        <gml:polygonMember>
				          <gml:Polygon>
				            <gml:outerBoundaryIs>
				              <gml:LinearRing>
				                <gml:coordinates decimal="." cs="," ts=" "></gml:coordinates>
				              </gml:LinearRing>
				            </gml:outerBoundaryIs>
				          </gml:Polygon>
				        </gml:polygonMember>
				      </gml:MultiPolygon>
				</psma:the_geom>
				<psma:feature_collection>
					<xsl:copy-of select="/"/>
				</psma:feature_collection>
			</psma:feedback_feed>
		</gml:featureMember>
	</xsl:template>
</xsl:stylesheet>
