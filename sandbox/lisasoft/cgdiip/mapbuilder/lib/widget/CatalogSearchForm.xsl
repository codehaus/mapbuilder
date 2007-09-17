<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an listing of OGC services from the Discovery Portal registry
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id$
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
  
  <xsl:param name="webServiceUrl">http://devgeo.cciw.ca/cgi-bin/mapserv/owscat</xsl:param>
  <xsl:param name="formName">owsCatSearch</xsl:param>
  <!-- NOTE: it's really bad form to put a hard-coded URL here, but it's the only way to use the document() function in IE -->
  <!--xsl:param name="searchConfigDoc" select="document('http://demo.communitymapbuilder.org/mapbuilder-lib-1.0-release/demo/contextEditor/searchConfig.xml')"/-->  
  <xsl:param name="searchConfigDoc" select="document('http://geodiscover.cgdi.ca/mapbuilder/demo/contextEditor/searchConfig.xml')"/>  
  <xsl:param name="selectSize" select="1"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="north">North</xsl:param>
  <xsl:param name="south">South</xsl:param>
  <xsl:param name="east">East</xsl:param>
  <xsl:param name="west">West</xsl:param>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/">
    <div>
    <h2>Search for layers</h2>
    <form name="{$formName}" id="{$formName}" method="get">
      <input type="hidden" name="version" value="1.0.0"/>
      <input type="hidden" name="service" value="WFS"/>
      <input type="hidden" name="request" value="GetFeature"/>
      <input type="hidden" name="typename" value="service_resources"/>
      <input type="hidden" name="outputFormat" value="GML3"/>
      
      <h3>Keywords</h3>
      <input type="text" name="keywords" value=""/>
      <h3>Location</h3>
      <xsl:call-template name="locations">
        <xsl:with-param name="locationsDoc" select="$searchConfigDoc"/>
      </xsl:call-template>
      <xsl:call-template name="aoiBox"/>
      <h3>Service Type</h3>
      <select name="serviceType" id="serviceType">
        <option></option>
        <option value="WMS">WMS</option>
        <option selected="true" value="WFS">WFS</option>
      </select>
      <input type="button" value="Search" onclick="config.objects.{$widgetId}.doSelect('{$formName}');"/>
      <input type="button" value="Show Query" onclick="config.objects.{$widgetId}.debugQuery('{$formName}');"/>
    </form>

    <div id="debugwindow" style="position:absolute; top:310px;left:370px;width:400px; height:300px; z-index:2;background-color:lightgray;overflow:auto"></div>

    </div>
  </xsl:template>

  <xsl:template name="locations">
    <xsl:param name="locationsDoc"/>
    <div>
      <select name="locations" onchange="config.objects.{$widgetId}.setLocation(this.options[this.selectedIndex].value);" size="{$selectSize}">
        <xsl:apply-templates select="$locationsDoc/searchConfig[@entryType='productCollection']/locations/location"/>
      </select>
    </div>
  </xsl:template>
  
  <xsl:template match="location">
    <xsl:param name="indent"/>
    <xsl:variable name="bbox" select="translate(wens,' ',',')"/>
    <option value="{$bbox}"><xsl:value-of select="$indent"/><xsl:value-of select="title[@lang=$lang]"/></option>
    <xsl:apply-templates select="location">
      <xsl:with-param name="indent"><xsl:value-of select="$indent"/>&#160;&#160;</xsl:with-param>
    </xsl:apply-templates>
  </xsl:template>
  
  <xsl:template name="aoiBox">
    <p>
      <table>
        <tr>
          <td align="left">or enter</td>
          <td><xsl:value-of select="$north"/></td>
          <td><xsl:value-of select="$south"/></td>
          <td><xsl:value-of select="$east"/></td>
          <td><xsl:value-of select="$west"/></td>
        </tr>
        <tr>
          <td>
          </td>
          <td>
            <input name="northCoord" type="text" size="10" class="searchInput"/>
          </td>
          <td>
            <input name="southCoord" type="text" size="10" class="searchInput"/>
          </td>
          <td>
            <input name="eastCoord" type="text" size="10"  class="searchInput"/>
          </td>
          <td>
            <input name="westCoord" type="text" size="10" class="searchInput"/>
          </td>
        </tr>
      </table>
    </p>
  </xsl:template>
  
  <xsl:template name="ntsInput">
    <p>or enter NTS mapsheet index
      <input name="ntsIndex" type="text" size="6" class="searchInput"/>
    </p>
  </xsl:template>
 
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>