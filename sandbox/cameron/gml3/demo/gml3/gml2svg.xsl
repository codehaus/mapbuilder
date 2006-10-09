<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:saxon="http://icl.com/saxon" xmlns:Extfun="/org.opengis.gml.StyleExt" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:gml="http://www.opengis.net/gml" xmlns:van="http://www.galdosinc.com/vancouver">
	<!-- =======================================================================
		Imports and includes		
	========================================================================== -->
	<!--=============                  Modifiers       ======================= -->
	<xsl:output indent="yes"/>
	<!--=============                  Parameters       ======================= -->
	<xsl:param name="gml-source"/>
	<xsl:param name="WIDTH">800</xsl:param>
	<xsl:param name="HEIGHT">800</xsl:param>
	<!--=============                  Variables       ======================= -->
	<xsl:variable name="sumY">
		<xsl:apply-templates select="van:FeatureCollection/gml:boundedBy/gml:Box/gml:coordinates" mode="sumY"/>
	</xsl:variable>
	<xsl:variable name="scaleX">
		<xsl:apply-templates select="van:FeatureCollection/gml:boundedBy/gml:Box/gml:coordinates" mode="scaleX"/>
	</xsl:variable>
	<xsl:variable name="scaleY">
		<xsl:apply-templates select="van:FeatureCollection/gml:boundedBy/gml:Box/gml:coordinates" mode="scaleY"/>
	</xsl:variable>
	<xsl:variable name="x1">
		<xsl:apply-templates select="van:FeatureCollection/gml:boundedBy/gml:Box/gml:coordinates" mode="x1"/>
	</xsl:variable>
	<xsl:variable name="y1">
		<xsl:apply-templates select="van:FeatureCollection/gml:boundedBy/gml:Box/gml:coordinates" mode="y1"/>
	</xsl:variable>
	<xsl:variable name="minus">-1</xsl:variable>
	<xsl:variable name="one">1</xsl:variable>
	<xsl:variable name="inverseScale">
		<xsl:value-of select="$one div $scaleX"/>
	</xsl:variable>
	<!-- ======================================================================= -->
	<!--                                                 MAIN TEMPLATE                                                                    -->
	<!-- ======================================================================= -->
	<xsl:template match="/">
		<xsl:element name="svg">
			<xsl:attribute name="gml-source"><xsl:value-of select="$gml-source"/></xsl:attribute>
			<xsl:attribute name="width"><xsl:value-of select="$WIDTH"/></xsl:attribute>
			<xsl:attribute name="height"><xsl:value-of select="$HEIGHT"/></xsl:attribute>
			<xsl:apply-templates select="//van:Riverb/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:CourtHouse/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Lake/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:PostOffice/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:CityHall/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Hospital/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Greenhouse/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:FerryTerminal/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Ocean/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:University/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:FireStation/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:School/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:UnspecifiedBuilding/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Buildup/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Communications/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:PoliceStation/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:TransmissionTower/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:College/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:TailingPond/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Church/gml:extentOf" mode="Area"/>
			<xsl:apply-templates select="//van:Footbridge/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RP3U/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RetainingWall/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:Trestle/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RP4D/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:Pipeline/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:Tunnel/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:SingleTrack/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:AbandonedTrack/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:LightRailTransit/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:Bridge/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RP2U1W/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RL1U/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:DoubleTrack/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:MultipleTrack/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RP2U/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:TransmissionLine/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RROUGH/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RP4U/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:CutEarthwork/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RP6U/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:Spur/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:FillEmbankment/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:FerryRoute/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:RL2U/gml:centerLineOf" mode="Line"/>
			<xsl:apply-templates select="//van:Airport/gml:position" mode="Point"/>
			<xsl:apply-templates select="//van:Hotel/gml:position" mode="Point"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<!--                                                 Feature templates                                                                   -->
	<!-- ======================================================================= -->
	<xsl:template match="van:Riverb/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:CourtHouse/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Lake/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:PostOffice/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:CityHall/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Hospital/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Greenhouse/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:FerryTerminal/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Ocean/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:University/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:FireStation/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:School/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:UnspecifiedBuilding/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:beige;stroke:red;fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Buildup/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,122,0);stroke:rgb(0,122,0);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Communications/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:PoliceStation/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:TransmissionTower/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:College/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:TailingPond/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Church/gml:extentOf" mode="Area">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:rgb(0,0,255);stroke:rgb(0,0,255);fill-rule:evenodd;</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<!-- ======================================================================= -->
	<xsl:template match="van:Footbridge/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RP3U/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RetainingWall/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Trestle/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RP4D/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Pipeline/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Tunnel/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:SingleTrack/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:AbandonedTrack/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:LightRailTransit/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Bridge/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RP2U1W/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RL1U/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:DoubleTrack/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:MultipleTrack/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RP2U/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:TransmissionLine/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RROUGH/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RP4U/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:CutEarthwork/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RP6U/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Spur/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:FillEmbankment/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:FerryRoute/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:RL2U/gml:centerLineOf" mode="Line">
		<xsl:element name="path">
			<xsl:attribute name="style">stroke-width:0.1;fill:none;stroke:rgb(255,0,0);</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			<xsl:attribute name="d"><xsl:apply-templates select=".//gml:coordinates" mode="Path"/></xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<!-- ======================================================================= -->
	<xsl:template match="van:Airport/gml:position" mode="Point">
		<xsl:variable name="x">
			<xsl:apply-templates select=".//gml:coordinates" mode="PointX"/>
		</xsl:variable>
		<xsl:variable name="y">
			<xsl:apply-templates select=".//gml:coordinates" mode="PointY"/>
		</xsl:variable>
		<xsl:variable name="scaleValue">
			<xsl:value-of select="0.1"/>
		</xsl:variable>
		<xsl:element name="g">
			<xsl:attribute name="transform">translate(<xsl:value-of select="$x"/>,<xsl:value-of select="$y"/>) scale(<xsl:value-of select="$scaleValue"/>)</xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
			<path d="M14.378,3.45l0.44-1.434     c0.329-0.921,0.666-1.424,1.011-1.516c0.26,0.055,0.631,0.559,1.116,1.516l0.415,1.434l0.338,1.68     c0.034,0.144,0.051,0.343,0.051,0.595c0,0.252,0.009,0.469,0.026,0.65v0.432v2.085l13.463,9.094v3.249l-13.697-5.929     l-0.363,12.452l3.295,2.248v2.435l-4.644-2.167l-4.59,2.167v-2.435l3.268-2.248l-0.311-12.452L0.5,21.235v-3.249l13.437-9.094     V6.807l0.078-1.677c0.018-0.144,0.104-0.551,0.26-1.219C14.292,3.802,14.326,3.649,14.378,3.45z" stroke="#131517" stroke-linecap="round" stroke-linejoin="round">
				<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			</path>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="van:Hotel/gml:position" mode="Point">
		<xsl:variable name="x">
			<xsl:apply-templates select=".//gml:coordinates" mode="PointX"/>
		</xsl:variable>
		<xsl:variable name="y">
			<xsl:apply-templates select=".//gml:coordinates" mode="PointY"/>
		</xsl:variable>
		<xsl:variable name="scaleValue">
			<xsl:value-of select="0.1"/>
		</xsl:variable>
		<xsl:element name="g">
			<xsl:attribute name="transform">scale(0.25)</xsl:attribute>
			<xsl:attribute name="transform">translate(<xsl:value-of select="$x"/>,<xsl:value-of select="$y"/>) scale(<xsl:value-of select="$scaleValue"/>)</xsl:attribute>
			<xsl:call-template name="EventsTemplate"/>
			<path d="M14.48,18.417c1.354,0,2.792,0.509,4.317,1.528     c1.524,1.019,2.287,2.12,2.287,3.305h-9.118L10.84,32.5c-0.322-2.37-0.504-3.694-0.548-3.973     c-0.042-0.277-0.107-0.49-0.192-0.638L9.52,23.25H0.5c0-1.277,0.795-2.426,2.385-3.443c1.438-0.926,2.802-1.389,4.09-1.389     V6.778c-1.16,0-2.266-0.212-3.318-0.639C2.326,5.603,1.66,4.88,1.66,3.973C1.66,2.491,2.615,1.5,4.527,1     c1.267-0.333,3.372-0.5,6.313-0.5c3.394,0,5.553,0.12,6.476,0.361c1.696,0.445,2.545,1.481,2.545,3.112     c0,0.851-0.741,1.564-2.223,2.138c-1.161,0.445-2.212,0.667-3.158,0.667V18.417z" stroke="#131517" stroke-linecap="round" stroke-linejoin="round">
				<xsl:attribute name="id"><xsl:value-of select="../@gml:id"/></xsl:attribute>
			</path>
		</xsl:element>
	</xsl:template>
	<!-- ======================================================================= -->
	<!--                                                 Bounding Box Templates                                                       -->
	<!-- ======================================================================= -->
	<xsl:template match="gml:boundedBy/gml:Box/gml:coordinates" mode="scaleX">
		<xsl:value-of select="Extfun:getScaleX(string($WIDTH),string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:boundedBy/gml:Box/gml:coordinates" mode="scaleY">
		<xsl:value-of select="Extfun:getScaleY(string($HEIGHT),string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:boundedBy/gml:Box/gml:coordinates" mode="x1">
		<xsl:value-of select="Extfun:getX1(string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:boundedBy/gml:Box/gml:coordinates" mode="y1">
		<xsl:value-of select="Extfun:getY1(string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:boundedBy/gml:Box/gml:coordinates" mode="sumY">
		<xsl:value-of select="Extfun:getSumY(string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:boundedBy/gml:Box/gml:coordinates" mode="inverseScale">
		<xsl:value-of select="Extfun:getInverseScale(string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<!--                                                  Coordinates Templates                                                          -->
	<!-- ======================================================================= -->
	<xsl:template match="gml:coordinates" mode="PointX">
		<xsl:value-of select="Extfun:getPointX(string($scaleX),string($x1),string(text()),string(@decimal),string(@cs))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:coordinates" mode="PointY">
		<xsl:value-of select="Extfun:getPointY(string($sumY),string($scaleY),string($y1),string(text()),string(@decimal),string(@cs))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<xsl:template match="gml:coordinates" mode="Path">
		<xsl:value-of select="Extfun:convertCoordinatesToPath(string($sumY),string($scaleX),string($scaleY),string($x1),string($y1),string(text()),string(@decimal),string(@cs),string(@ts))"/>
	</xsl:template>
	<!-- ======================================================================= -->
	<!--                                                  Metadata Templates                                                              -->
	<!-- ======================================================================= -->
	<xsl:template name="getAnc">
		<xsl:param name="featureName"/>
		<xsl:choose>
			<xsl:when test="name(.) = $featureName">
				<xsl:value-of select="./@ID"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="..">
					<xsl:call-template name="getAnc">
						<xsl:with-param name="featureName" select="$featureName"/>
					</xsl:call-template>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- ======================================================================= -->
	<!--                                                  Events Template                                                              -->
	<!-- ======================================================================= -->
	<xsl:template name='EventsTemplate'>
		<xsl:attribute name="onclick">featureClicked(evt)</xsl:attribute>
		<xsl:attribute name="onmouseover">featureEntered(evt)</xsl:attribute>
		<xsl:attribute name="onmousemove">featureHovered(evt)</xsl:attribute>
		<xsl:attribute name="onmouseout">featureExited(evt)</xsl:attribute>
	</xsl:template>
</xsl:transform>
