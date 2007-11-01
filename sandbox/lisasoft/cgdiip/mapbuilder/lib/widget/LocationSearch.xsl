<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an listing of OGC services from the Discovery Portal registry
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: CatalogSearchForm.xsl 3285 2007-09-20 09:31:07Z rdewit $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelTitle"/>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="targetModelId"/>
  <xsl:param name="targetModel"/>
  <xsl:param name="lang">en</xsl:param>
  
  <xsl:param name="formName">locationSearchForm</xsl:param>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/">
    <div title="Wildcards (*) are allowed. Search is case sensitive!">
    <h2>Placename Search</h2>
    <form name="{$formName}" id="{$formName}" method="get">
      <input type="hidden" name="version" value="1.0.0"/>
      <input type="hidden" name="service" value="WFS"/>
      <input type="hidden" name="request" value="GetFeature"/>
      <input type="hidden" name="typename" value="service_resources"/>
      <input type="hidden" name="outputFormat" value="GML3"/>
      
      <h3>Placename</h3>
      <input type="text" name="placename" value=""/>
      <input type="button" value="search" onclick="config.objects.{$widgetId}.search();"/>

    </form>

    <div id="debugwindow" style="display:none;position:absolute; top:310px;left:370px;width:400px; height:300px; z-index:2;background-color:transparent;overflow:auto"></div>
    <div id="loadingLocationSearch"/>
    </div>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
