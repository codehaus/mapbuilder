<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: presents the list of Layers from a WMS capabilities doc.
            Links provided to preview and add a layer to a Context doc.
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: SelectMapLayers.xsl 1752 2005-10-24 23:52:10Z madair1 $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:wms="http://www.opengis.net/wms"
		xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/WMT_MS_Capabilities | /wms:WMS_Capabilities">
    <table>
      <tr>
        <th colspan="2" align="left">
          Map Layers from: <xsl:value-of select="wms:Service/wms:Title"/><xsl:value-of select="Service/Title"/>
        </th>
      </tr>
      <xsl:apply-templates/>
    </table>
  </xsl:template>

  <!-- template rule matching displayable layers -->
  <xsl:template match="Layer[Name]">
    <xsl:variable name="name"><xsl:value-of select="Name"/></xsl:variable>
    <tr>
      <td>
        <xsl:value-of select="Title"/>
      </td>
      <td width="200px" nowrap="true">
        <a href="javascript:config.objects.editContext.addNodeToModel('{$name}')">add to map</a>
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

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
