<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: presents the list of Layers from a Catalogs response (in 
  EBRIM format.
            Links allow you to add the layers to a context document.
Author:      camerons
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:wms="http://www.opengis.net/wms"
	xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:csw="http://www.opengis.net/cat/csw"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:rim="urn:oasis:names:tc:ebxml-regrep:rim:xsd:2.5"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    
  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/">
    <table>
      <tr>
        <th colspan="2" align="left">
          Catalog Query Results:
        </th>
      </tr>
      <xsl:apply-templates/>
    </table>
  </xsl:template>

  <!-- template rule matching displayable layers -->
  <xsl:template match="rim:Service">
    <xsl:variable name="id"><xsl:value-of select="@id"/></xsl:variable>
    <tr>
      <td>
        <xsl:value-of select="rim:Slot[@name='Title']//rim:Value"/>
      </td>
      <td width="200px" nowrap="true">
        <a href="javascript:config.objects.editContext.addEbrimNodeToModel('{$id}')">add</a>
        <!--a href="javascript:config.objects.editContext.addNodeToModel('{$name}')">add</a-->
        <!--a href="javascript:config.objects.{$modelId}.setParam('GetMap','{$name}')">show map</a-->
      </td>
    </tr>
    <xsl:apply-templates/>
  </xsl:template>

  <!-- template rule matching displayable layers for v1.3.x servers-->
  <xsl:template match="wms:Layer[wms:Name and wms:Dimension/@name='time']">
    <xsl:variable name="name"><xsl:value-of select="wms:Name"/></xsl:variable>
    <tr>
      <td>
        <xsl:value-of select="wms:Title"/>
      </td>
      <td>
        <a href="javascript:config.objects.{$modelId}.setParam('mapLayer','{$name}')">show map</a>
        <!--a href="javascript:config.objects.{$modelId}.setParam('GetMap','{$name}')">show map</a-->
      </td>
    </tr>
    <xsl:apply-templates/>
  </xsl:template>

  <!--  Discard other nodes -->
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
