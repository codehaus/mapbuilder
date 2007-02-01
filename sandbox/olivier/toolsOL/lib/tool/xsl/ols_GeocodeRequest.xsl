<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description:Creates a OpenLS geocodeing request
Author:      Steven Ottens steven.ottensATgeodan.nl
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: ols_GeocodeRequest.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name:  $
-->
<xsl:stylesheet version="1.0" xmlns:cml="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink">
  <xsl:output method="xml" version="1.0" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>
  <xsl:strip-space elements="*"/>

  <!-- parameters to be passed into the XSL -->
  <xsl:param name="postalCode"/>
  <xsl:param name="street"/>
  <xsl:param name="number"/>
  <xsl:param name="municipalitySubdivision"/>
  <xsl:param name="municipality"/>
  <xsl:param name="countryCode"/>

  <!-- Root template -->
  <xsl:template match="/">

		<!--The Geocoding request XML-->
		<xls:GeocodeRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xls="http://www.opengis.net/xls" xmlns:gml="http://www.opengis.net/gml">
			<xls:Address countryCode="{$countryCode}">  
				<xsl:if test="$street">
					<xls:StreetAddress xmlns="http://www.opengis.net/xls">
						<xls:Street><xsl:value-of select="$street"/></xls:Street>
						<xsl:if test="$number">
							<xls:Building number="{$number}"/>
						</xsl:if>
					</xls:StreetAddress>
				</xsl:if>
				<xsl:if test="$postalCode">
					<xls:PostalCode xmlns="http://www.opengis.net/xls"><xsl:value-of select="$postalCode"/></xls:PostalCode>
				</xsl:if>
				<xsl:if test="$municipalitySubdivision">
					<xls:Place type="MunicipalitySubdivision"><xsl:value-of select="$municipalitySubdivision"/></xls:Place>
				</xsl:if>
				<xsl:if test="$municipality">
					<xls:Place type="Municipality"><xsl:value-of select="$municipality"/></xls:Place>
				</xsl:if>
			</xls:Address>
		</xls:GeocodeRequest>
		<!--End Geocodingrequest XML-->
	</xsl:template>
</xsl:stylesheet>