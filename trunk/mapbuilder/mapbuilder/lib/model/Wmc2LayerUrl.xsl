<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:wmc="http://www.opengis.net/context"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--==============================================================================
Description: Build a Web Map Server GET map request for one layer from a Web Map
             Context and supplied Layer Name.

Author:      Cameron Shorter cameron ATshorter.net

Licence:     This library is free software; you can redistribute it and/or
             modify it under the terms of the GNU Lesser General Public
             License as published by the Free Software Foundation;
             version 2.1 of the License.

             This library is distributed in the hope that it will be useful,
             but WITHOUT ANY WARRANTY; without even the implied warranty of
             MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
             Lesser General Public License for more details.

$Id$
$Name$
==================================================================================-->

  <xsl:output method="text" encoding="utf-8"/>

  <!-- The id of the layer to load -->
  <xsl:param name="layerName"/>

  <!-- Main -->
  <xsl:template match="/">
    <!-- TBD: if General SRS is in Layer SRS then ... -->

    <xsl:apply-templates select="/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='COASTLINES']"/>
    <xsl:apply-templates select="/wmc:ViewContext/wmc:General"/>
  </xsl:template>

  <!-- LayerList/Layer -->
  <xsl:template match="//wmc:LayerList/wmc:Layer">
    <xsl:value-of select="wmc:Server/wmc:OnlineResource/@xlink:href"/>
    <xsl:text>?VERSION=</xsl:text>
    <xsl:value-of select="wmc:Server/@version"/>

    <xsl:text>&amp;REQUEST=map</xsl:text>

    <xsl:text>&amp;LAYERS=</xsl:text>
    <xsl:value-of select="wmc:Name"/>

    <xsl:text>&amp;STYLES=</xsl:text>
    <xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:Name"/>

    <xsl:text>&amp;FORMAT=</xsl:text>
    <xsl:value-of select="wmc:FormatList/wmc:Format[@current='1']"/>
  </xsl:template>

  <!-- General -->
  <xsl:template match="//wmc:General">
    <xsl:text>&amp;SRS=</xsl:text>
    <xsl:value-of select="wmc:BoundingBox/@SRS"/>

    <xsl:text>&amp;BBOX=</xsl:text>
    <xsl:value-of select="wmc:BoundingBox/@minx"/>
    <xsl:text>,</xsl:text>
    <xsl:value-of select="wmc:BoundingBox/@miny"/>
    <xsl:text>,</xsl:text>
    <xsl:value-of select="wmc:BoundingBox/@maxx"/>
    <xsl:text>,</xsl:text>
    <xsl:value-of select="wmc:BoundingBox/@maxy"/>

    <!--xsl:if select="wmc:Window/@wmc:width & wmc:Window/@wmc:width"/-->
      <xsl:text>&amp;WIDTH=</xsl:text>
      <xsl:value-of select="wmc:Window/@width"/>

      <xsl:text>&amp;HEIGHT=</xsl:text>
      <xsl:value-of select="wmc:Window/@height"/>
    <!--/xsl:if-->
  </xsl:template>
</xsl:stylesheet>

