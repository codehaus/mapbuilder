<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parse DescribeFeatureType response 
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: LayerProperty.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
		xmlns:gml="http://www.opengis.net/gml">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <xsl:param name="elementName">
    <xsl:value-of select="/xsd:schema/xsd:element/@name"/>
  </xsl:param>
  <xsl:param name="elementType">
    <xsl:value-of select="/xsd:schema/xsd:element/@type"/>
  </xsl:param>
  <xsl:param name="elementTypeNoNs">
    <xsl:value-of select="substring-after($elementType,':')"/>
  </xsl:param>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/xsd:schema">
<!--  <xsl:variable name="id">'choixFeatureProperty'</xsl:variable>-->
   
   	<select name="featureProperty"  size="1" onchange="config.objects.editor.setAttr(config.objects.editor,'//ogc:PropertyName',document.getElementById('selectPropertyCanvas').value,'{$attr}');">
   		<option selected="the_geom">Choose feature property</option> 
      	<xsl:apply-templates select="xsd:complexType[@name=$elementTypeNoNs]"/>
    </select>
  </xsl:template>

  <!-- template rule matching source root element -->
  <xsl:template match="xsd:element">
    <xsl:variable name="name"><xsl:value-of select="@name"/></xsl:variable>
    <xsl:variable name="type"><xsl:value-of select="@type"/></xsl:variable>   
       <option value="{$name}"><xsl:value-of select="$name"/><xsl:value-of select="$type"/></option>
  		
  </xsl:template>

 

</xsl:stylesheet>
