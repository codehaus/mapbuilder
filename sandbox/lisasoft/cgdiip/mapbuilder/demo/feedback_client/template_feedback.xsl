<xsl:stylesheet
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:georss="http://www.georss.org/georss"
xmlns:gml="http://www.opengis.net/gml"
xmlns:wfs="http://www.opengis.net/wfs"
xmlns:ogc="http://www.opengis.net/ogc"
xmlns:cw="http://www.cubewerx.com/cw"
xmlns:gb="http://geocon.sunertek.com" 
xmlns="http://www.w3.org/2005/Atom"
version="1.0">
	<xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes" />

	<xsl:template match="/">
		<gml:featureMember xmlns:def="http://www.w3.org/2005/Atom" xmlns:gml="http://www.opengis.net/gml" xmlns:gb="http://geocon.sunertek.com" xmlns:cw="http://www.cubewerx.com/cw" xmlns:georss="http://www.georss.org/georss">
			<cw:FeedbackFeed>
				<entry>
					<title>feedback proposal</title>
					<author>
						<name>Martin Vivian</name>
						<uri>www.lisasoft.com</uri>
						<email>mvivian@lisasoft.com</email>
					</author>
					<category scheme="http://www.geobase.ca/scheme/feedtype" term="feedback" ></category>
					<category scheme="http://www.geobase.ca/scheme/domain" term="Newfoundland and Labrador" ></category>
					<category scheme="http://www.geobase.ca/scheme/featuretype" term="placename" ></category>
					<category scheme="http://www.geobase.ca/scheme/action" term="update" ></category>
					<category scheme="http://www.geobase.ca/scheme/status" term="published" ></category>
<!-- 
					<link rel="http://www.geobase.ca/linktype/sourcefeature" href="http://wfs.geobase.ca?request=GetFeature..."/>
					<link rel="http://www.geobase.ca/linktype/feedback" href="http://www.geonames.org/somelink"/>
					<link rel="alternate" href="http://www.geonames.org/Brisbane"/>
-->
					<id></id>
					<updated></updated>
					<summary></summary>
					<content></content>
					<georss:where>
						<gml:Point>
							<gml:pos></gml:pos>
						</gml:Point>
					</georss:where>
					<georss:featureOfInterest>
						<gml:FeatureCollection>
- 							<xsl:choose>
								<xsl:when test="count(/wfs:FeatureCollection) &gt; 0">
 									<xsl:copy-of select="/wfs:FeatureCollection/*" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:copy-of select="/" />
								</xsl:otherwise>
							</xsl:choose>
						</gml:FeatureCollection>
					</georss:featureOfInterest>
				</entry>
			</cw:FeedbackFeed>
		</gml:featureMember>
	</xsl:template>
</xsl:stylesheet>
