<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" encoding="utf-8"/><xsl:param name="modelId"/><xsl:param name="widgetId"/><xsl:param name="formName">GeocoderForm</xsl:param><xsl:param name="postcode"/><xsl:param name="straat"/><xsl:param name="nummer"/><xsl:param name="plaats"/><xsl:param name="gemeente"/><xsl:param name="load">zoek</xsl:param><xsl:template match="/"><div id="geocoder">
Vul de postcode of straat en plaats/gemeente in.
<p>Een sterretje (*) kan gebruikt worden als vervanging van een aantal letters<br/>
Voorbeeld: <i>Vijzel*</i> in <i>Amsterdam</i> geeft <b>Vijzelgracht</b> en <b>Vijzelstraat</b>.</p><form name="{$formName}" id="{$formName}"><div class="record"><div class="name">Postcode:</div><div class="value"><input name="postcode" type="text"/></div></div><div class="record"><div class="name">Straat:</div><div class="value"><input name="straat" type="text"/></div></div><div class="record"><div class="name">Nummer:</div><div class="value"><input name="nummer" type="text"/></div></div><div class="record"><div class="name">Plaats:</div><div class="value"><input name="plaats" type="text"/></div></div><div class="record"><div class="name">Gemeente:</div><div class="value"><input name="gemeente" type="text"/></div></div><p><div class="record"><div class="checkbox"><input type="checkbox" checked="true" title="Klik om wel of geen markeringspunt te zien" id="geocodermark"/></div><div class="name">Markeringspunt</div></div><div class="record"><div class="checkbox"><input type="checkbox" checked="true" title="Klik om wel of niet in te zoomen" id="geocoderzoom"/></div><div class="name">Zoom in</div></div></p><p><div class="zoek"><a href="javascript:config.objects.{$widgetId}.submitForm(config.objects.{$widgetId});" onClick="toggleBox('geoForm',0);toggleBox('olsResponsView',1)"><xsl:value-of select="$load"/></a></div></p></form></div></xsl:template></xsl:stylesheet>