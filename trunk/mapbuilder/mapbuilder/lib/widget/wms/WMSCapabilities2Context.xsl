<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:wmc="http://www.opengis.net/context"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Convert a WFS Capabilities document to a Web Map Context
Author:      Nedjo Rogers nedjo AT gworks.ca
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

-->

  <xsl:output method="xml" encoding="utf-8"/>

  <xsl:template match="/">
<ViewContext version="1.0.0"
			    id="eos_data_gateways"
			    xmlns="http://www.opengis.net/context"
			    xmlns:xlink="http://www.w3.org/1999/xlink"
			    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			    xsi:schemaLocation="http://www.opengis.net/context http://schemas.opengis.net/context/1.0.0/context.xsd">
	<General>
	</General>
    <xsl:param name="wmsVersion">
        <xsl:value-of select="WMT_MS_Capabilities/@version"/>    
    </xsl:param>
    <xsl:param name="wmsTitle">
        <xsl:value-of select="Service/Title"/>    
    </xsl:param>
    <xsl:param name="wmsOnlineResource">
        <xsl:value-of select="Capability/Request/GetMap/DCPType/HTTP/Get/OnlineResource/@xlink:href"/>    
    </xsl:param>
    <xsl:param name="wmsSrs">
        <xsl:value-of select="Capability/Layer/SRS"/>    
    </xsl:param>
    <LayerList>
    <xsl:apply-templates/>
    </LayerList>
</ViewContext>
  </xsl:template>

  <!-- Layer -->
  <xsl:template match="Capability/Layer/Layer">
    <xsl:param name="queryable">
        <xsl:value-of select="@queryable"/>    
    </xsl:param>
    <xsl:param name="layerSrs">
        <xsl:value-of select="/SRS"/>    
    </xsl:param>
      <Layer queryable="<xsl:value-of select="$queryable"/>" hidden="0">
        <Server service="OGC:WMS" version="<xsl:value-of select="$wmsVersion"/>" title="<xsl:value-of select="$wmsTitle"/>">
          <OnlineResource xlink:type="simple" xlink:href="<xsl:value-of select="$wmsOnlineResource"/>"/>
        </Server>

        <Name><xsl:value-of select="/Name"/></Name>
        <Title><xsl:value-of select="/Title"/></Title>
        <Abstract><xsl:value-of select="/Abstract"/></Abstract>
        <xsl:if test="$layerSrs=''">
          <xsl:param name="layerSrs">
              <xsl:value-of select="$wmsSrs"/>    
          </xsl:param>
        </xsl:if>
        <SRS><xsl:value-of select="$layerSrs"/></SRS>
        <FormatList>
        	<Format current="1">image/png</Format>
        </FormatList>
      </Layer>
  </xsl:template>
</xsl:stylesheet>
