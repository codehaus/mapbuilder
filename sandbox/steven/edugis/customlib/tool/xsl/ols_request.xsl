<?xml version="1.0"?>
<xsl:stylesheet xmlns:cml="http://www.opengis.net/context" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" version="1.0" omit-xml-declaration="no" encoding="utf-8" indent="yes"/><xsl:param name="postalCode"/><xsl:param name="street"/><xsl:param name="number"/><xsl:param name="municipalitySubdivision"/><xsl:param name="municipality"/><xsl:template match="/"><xls:GeocodeRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xls="http://www.opengis.net/xls" xmlns:gml="http://www.opengis.net/gml"><xls:Address countryCode="NL"><xsl:if test="$street"><xls:StreetAddress xmlns="http://www.opengis.net/xls"><xls:Street><xsl:value-of select="$street"/></xls:Street><xsl:if test="$number"><xls:Building number="{$number}"/></xsl:if></xls:StreetAddress></xsl:if><xsl:if test="$postalCode"><xls:PostalCode xmlns="http://www.opengis.net/xls"><xsl:value-of select="$postalCode"/></xls:PostalCode></xsl:if><xsl:if test="$municipalitySubdivision"><xls:Place type="MunicipalitySubdivision"><xsl:value-of select="$municipalitySubdivision"/></xls:Place></xsl:if><xsl:if test="$municipality"><xls:Place type="Municipality"><xsl:value-of select="$municipality"/></xls:Place></xsl:if></xls:Address></xls:GeocodeRequest></xsl:template></xsl:stylesheet>
