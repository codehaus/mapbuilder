<?xml version="1.0" encoding="ISO-8859-1"?>



<!--

Description: presents the list of FeatureTypes from a WFS capabilities doc.

            Links provided to filter and load the selected FeatureType.

Author:      adair

Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .



$Id$

$Name$

-->



<xsl:stylesheet version="1.0" 

    xmlns:wfs="http://www.opengis.net/wfs"

    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

		xmlns:ogc="http://www.opengis.net/ogc"

		xmlns:gml="http://www.opengis.net/gml"

    xmlns:xlink="http://www.w3.org/1999/xlink">



  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>



  <!-- The coordinates of the DHTML Layer on the HTML page -->

  <xsl:param name="modelId"/>

  <xsl:param name="widgetId"/>

  <xsl:param name="toolId"/>

  

  <!-- template rule matching source root element -->

  <xsl:template match="/wfs:WFS_Capabilities">

    <table>

      <tr>

        <th>

          Feature types from: <xsl:value-of select="wfs:Service/wfs:Title"/>

        </th>

        <td colspan="2">

          <a href="javascript:config.paintWidget(config.objects.wfsServerList)">Back to list</a>

        </td>

      </tr>

      <xsl:apply-templates select="wfs:FeatureTypeList/wfs:FeatureType"/>

    </table>

  </xsl:template>



  <!-- template rule matching source root element -->

  <xsl:template match="wfs:FeatureType">

    <xsl:variable name="name"><xsl:value-of select="wfs:Name"/></xsl:variable>

    <xsl:variable name="title"><xsl:value-of select="wfs:Title"/></xsl:variable>

    <xsl:variable name="id"><xsl:value-of select="@id"/></xsl:variable>

    <tr>

      <td>

        <xsl:value-of select="$title"/> (<xsl:value-of select="$name"/>) <xsl:value-of select="wfs:SRS"/>

      </td>

      <td>

        <a href="javascript:config.objects.{$modelId}.setParam('wfs_GetFeature','{$name}')">load</a>

      </td>

      <td>

        <a href="javascript:config.objects.{$modelId}.setParam('wfs_DescribeFeatureType','{$name}')">filter</a>

      </td>

    </tr>

  </xsl:template>



  <xsl:template match="text()|@*"/>



</xsl:stylesheet>

