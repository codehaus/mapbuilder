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
   <xsl:param name="pc">Postcode</xsl:param>
  <xsl:param name="street">Straat</xsl:param>
  <xsl:param name="number">Nummer</xsl:param>
  <xsl:param name="city">Plaats</xsl:param>
  <xsl:param name="municipality">Gemeente</xsl:param>
  <xsl:param name="countryCode">Land</xsl:param>
  <xsl:param name="country">NL</xsl:param>
  <xsl:param name="load">zoek</xsl:param>
  
  
  <xsl:template match="/">
    <xsl:variable name="streetBlur">
    if(this.value==''){this.style.color='grey';this.value='<xsl:value-of select="$street"/>'}
    </xsl:variable>
    <xsl:variable name="numberBlur">
    if(this.value==''){this.style.color='grey';this.value='<xsl:value-of select="$number"/>'}
    </xsl:variable>
    <xsl:variable name="pcBlur">
    if(this.value==''){this.style.color='grey';this.value='<xsl:value-of select="$pc"/>'}
    </xsl:variable>
    <xsl:variable name="cityBlur">
    if(this.value==''){this.style.color='grey';this.value='<xsl:value-of select="$city"/>'}
    </xsl:variable>
    <xsl:variable name="municipalityBlur">
    if(this.value==''){this.style.color='grey';this.value='<xsl:value-of select="$municipality"/>'}
    </xsl:variable>
    <xsl:variable name="streetFocus">
    this.style.color='black';if(this.value=='<xsl:value-of select="$street"/>')this.value=''
    </xsl:variable>
    <xsl:variable name="numberFocus">
    this.style.color='black';if(this.value=='<xsl:value-of select="$number"/>')this.value=''
    </xsl:variable>
    <xsl:variable name="pcFocus">
    this.style.color='black';if(this.value=='<xsl:value-of select="$pc"/>')this.value=''
    </xsl:variable>
    <xsl:variable name="cityFocus">
    this.style.color='black';if(this.value=='<xsl:value-of select="$city"/>')this.value=''
    </xsl:variable>
    <xsl:variable name="municipalityFocus">
    this.style.color='black';if(this.value=='<xsl:value-of select="$municipality"/>')this.value=''
    </xsl:variable>
    <div id="geocoderForm">
      <form name="{$formName}" id="{$formName}">
      <table>
            <tr><td>
            <input name="streetValue" type="text" size="20" style="color:grey" value="{$street}" onblur="{$streetBlur}" onfocus="{$streetFocus}"/>
            <input name="numberValue" type="text" size="4" style="color:grey" value="{$number}" onblur="{$numberBlur}" onfocus="{$numberFocus}"/>
            </td></tr>
            <tr><td>
            <input name="pcValue" type="text" size="7" style="color:grey" value="{$pc}" onblur="{$pcBlur}" onfocus="{$pcFocus}"/>
            <input name="cityValue" type="text" size="17" style="color:grey" value="{$city}" onblur="{$cityBlur}" onfocus="{$cityFocus}"/>
            </td></tr>
            <tr><td>
            <input name="municipalityValue" type="text" size="19" style="color:grey" value="{$municipality}" onblur="{$municipalityBlur}" onfocus="{$municipalityFocus}"/>
            <input type="hidden" name="countryValue" value="NL"/>
            <input type="button" size="7" value="{$load}" onclick="javascript:config.objects.{$widgetId}.submitForm(config.objects.{$widgetId});"/>
            </td></tr>
          </table>
      </form>
      
    </div>
  </xsl:template>  
</xsl:stylesheet>
