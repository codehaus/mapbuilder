<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"

xmlns:wmc="http://www.opengis.net/context"

xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

xmlns:xlink="http://www.w3.org/1999/xlink">



<!--

Description: Convert a WFS Capabilities document to a Web Map Context

Author:      Nedjo Rogers nedjo AT gworks.ca

Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html



$Id$

$Name$



-->



  <xsl:output method="xml" encoding="utf-8" indent="yes"/>



    <xsl:param name="wmsVersion">

        <xsl:value-of select="/WMT_MS_Capabilities/@version"/>    

    </xsl:param>

    <xsl:param name="wmsTitle">

        <xsl:value-of select="/WMT_MS_Capabilities/Service/Title"/>    

    </xsl:param>

    <xsl:param name="wmsOnlineResource">

        <xsl:value-of select="/WMT_MS_Capabilities/Capability/Request/GetMap/DCPType/HTTP/Get/OnlineResource/@xlink:href"/>    

    </xsl:param>

    <xsl:param name="wmsSrs">

        <xsl:value-of select="/WMT_MS_Capabilities/Capability/Layer/SRS"/>    

    </xsl:param>



  <xsl:template match="/">

  <ViewContext version="1.0.0"

			    id="eos_data_gateways"

          xmlns="http://www.opengis.net/context"

			    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

			    xsi:schemaLocation="http://www.opengis.net/context http://schemas.opengis.net/context/1.0.0/context.xsd">

	<General>

          <Window width="400" height="200"/>

          <Title><xsl:value-of select="/WMT_MS_Capabilities/Service/Title"/></Title>

          <!-- TBD: The following should be extracted -->

          <BoundingBox SRS="EPSG:4326" minx="-180" miny="-90" maxx="180" maxy="90"/>

	</General>

    <LayerList>

      <xsl:apply-templates select="/WMT_MS_Capabilities/Capability/Layer/Layer"/>

    </LayerList>

</ViewContext>

  </xsl:template>



  <!-- Layer -->

  <xsl:template match="Layer">

    <xsl:param name="queryable">

        <xsl:value-of select="@queryable"/>    

    </xsl:param>

    <xsl:param name="layerSrs">

        <xsl:value-of select="SRS"/>    

    </xsl:param>

    <xsl:element name="Layer" namespace="http://www.opengis.net/context">

      <xsl:attribute name="queryable">

        <xsl:value-of select="$queryable"/>

      </xsl:attribute>

      <xsl:attribute name="hidden">

        <xsl:text>0</xsl:text>

      </xsl:attribute>

      <xsl:element name="Server" namespace="http://www.opengis.net/context">

        <xsl:attribute name="service">

          <xsl:text>OGC:WMS</xsl:text>

        </xsl:attribute>

        <xsl:attribute name="version">

          <xsl:value-of select="$wmsVersion"/>

        </xsl:attribute>

        <xsl:attribute name="title">

          <xsl:value-of select="$wmsTitle"/>

        </xsl:attribute>

        <xsl:element name="OnlineResource" namespace="http://www.opengis.net/context">

          <xsl:attribute name="type">

            <xsl:text>simple</xsl:text>

          </xsl:attribute>

          <xsl:attribute name="xlink:href">

            <xsl:value-of select="$wmsOnlineResource"/>

          </xsl:attribute>

        </xsl:element>

      </xsl:element>

        <Name xmlns="http://www.opengis.net/context"><xsl:value-of select="Name"/></Name>

        <Title xmlns="http://www.opengis.net/context"><xsl:value-of select="Title"/></Title>

        <Abstract xmlns="http://www.opengis.net/context"><xsl:value-of select="Abstract"/></Abstract>

        <xsl:if test="$layerSrs=''">

          <xsl:variable name="layerSrs">

              <xsl:value-of select="$wmsSrs"/>    

          </xsl:variable>

        </xsl:if>

        <SRS xmlns="http://www.opengis.net/context"><xsl:value-of select="$layerSrs"/></SRS>

        <FormatList xmlns="http://www.opengis.net/context">

        	<Format current="1" xmlns="http://www.opengis.net/context">image/png</Format>

        </FormatList>

        <StyleList xmlns="http://www.opengis.net/context">

          <Style xmlns="http://www.opengis.net/context" current="1">

          <xsl:copy-of select="Style/*"/>

          </Style>

        </StyleList>

    </xsl:element>

  </xsl:template>

</xsl:stylesheet>

