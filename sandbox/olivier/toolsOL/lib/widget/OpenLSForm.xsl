<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for creating an OpenLS geocoder request
Author:      Steven Ottens AT geodan.nl
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OpenLSForm.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  

  <!-- The name of the form geocoding -->
  <xsl:param name="formName">GeocoderForm</xsl:param>

  <!-- Text params for this widget -->
  <xsl:param name="pc">Postalcode: </xsl:param>
  <xsl:param name="street">Street: </xsl:param>
  <xsl:param name="number">Number: </xsl:param>
  <xsl:param name="city">City: </xsl:param>
  <xsl:param name="municipality">Municipality: </xsl:param>
  <xsl:param name="countryCode">Country: </xsl:param>
  <xsl:param name="load">search</xsl:param>
  
  
  <xsl:template match="/">
  <!-- Main html (div/stylesheet based)-->
		<!--div id="geocoder">
			<form name="{$formName}" id="{$formName}">
			<div class="record"><div class="name"><xsl:value-of select="$pc"/></div><div class="value"><input name="pcValue" type="text"/></div></div>
			<div class="record"><div class="name"><xsl:value-of select="$street"/></div><div class="value"><input name="streetValue" type="text"  /></div></div>
			<div class="record"><div class="name"><xsl:value-of select="$number"/></div><div class="value"><input name="numberValue" type="text"/></div></div>
			<div class="record"><div class="name"><xsl:value-of select="$city"/></div><div class="value"><input name="cityValue" type="text"  /></div></div>
			<div class="record"><div class="name"><xsl:value-of select="$municipality"/></div><div class="value"><input name="municipalityValue" type="text" /></div></div>
            <div class="record"><div class="name"><xsl:value-of select="$countryCode"/></div><div class="value"><input name="countryValue" type="text" /></div></div>
			<p>
				<div class="zoek"><a href="javascript:config.objects.{$widgetId}.submitForm(config.objects.{$widgetId});"><xsl:value-of select="$load"/></a>
				</div>
			</p>
			</form>
    </div-->
	<!-- Main html (table based)-->
		<div id="geocoder">
			<form name="{$formName}" id="{$formName}">
				<table>
					<tr>
						<td><xsl:value-of select="$pc"/></td>
						<td><input name="pcValue" type="text"/></td>
					</tr><tr>
						<td><xsl:value-of select="$street"/></td>
						<td><input name="streetValue" type="text"  /></td>
					</tr><tr>
						<td><xsl:value-of select="$number"/></td>
						<td><input name="numberValue" type="text"/></td>
					</tr><tr>
						<td><xsl:value-of select="$city"/></td>
						<td><input name="cityValue" type="text"  /></td>
					</tr><tr>
						<td><xsl:value-of select="$municipality"/></td>
						<td><input name="municipalityValue" type="text" /></td>
					</tr><tr>
          </tr><tr>
            <td><xsl:value-of select="$countryCode"/></td>
            <td><input name="countryValue" type="text" /></td>
          </tr><tr>
						<td></td>
						<td>			
							<a href="javascript:config.objects.{$widgetId}.submitForm(config.objects.{$widgetId});"><xsl:value-of select="$load"/></a>
						</td>
					</tr>
				</table>
			</form>
    </div>
  </xsl:template>  
</xsl:stylesheet>
