<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: parses a WMS capabilities Layer element and transforms it to a
             Web Map Context document Layer element.
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: wmc_AddResource.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:wms="http://www.opengis.net/wms" 
    xmlns:wfs="http://www.opengis.net/wfs" 
		xmlns:sld="http://www.opengis.net/sld"
    xmlns:owscat="http://www.ec.gc.ca/owscat"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <xsl:param name="version"/>
  <xsl:param name="serverUrl"/>
  <xsl:param name="serviceName"/>
  <xsl:param name="serverTitle"/>
  <xsl:param name="format"/>
  
  <!-- for selecting nodes from an WMS Capabilities document -->
  <xsl:template match="Layer | wms:Layer">
    <wmc:Layer>
      <xsl:attribute name="queryable">
      <xsl:choose>
        <xsl:when test="@queryable">
          <xsl:value-of select="@queryable"/>
        </xsl:when>
	      <xsl:otherwise>0</xsl:otherwise>
  	  </xsl:choose>
    	</xsl:attribute>
      <xsl:attribute name="hidden">0</xsl:attribute>
			<wmc:Server>
        <xsl:attribute name="service"><xsl:value-of select="$serviceName"/></xsl:attribute>
        <xsl:attribute name="version"><xsl:value-of select="$version"/></xsl:attribute>
        <xsl:attribute name="title"><xsl:value-of select="$serverTitle"/></xsl:attribute>
				<wmc:OnlineResource xlink:type="simple" xlink:href="{$serverUrl}"/>
			</wmc:Server>
      <xsl:apply-templates select="child::node()"/>
      <xsl:if test="not(SRS)">
	      <xsl:apply-templates select="../SRS"/>
	    </xsl:if>  
  	  <xsl:if test="not(wms:CRS)">
    	  <xsl:apply-templates select="../wms:CRS"/>
	    </xsl:if>
      <xsl:if test="not(Style or wms:Style)">
  	  <xsl:apply-templates select="../wms:Style"/>
    	<xsl:apply-templates select="../Style"/>
      <wmc:FormatList>
        <wmc:Format current="1"><xsl:value-of select="$format"/></wmc:Format>
      </wmc:FormatList>
      </xsl:if>
    </wmc:Layer>
  </xsl:template>

  <xsl:template match="Layer/Style | wms:Layer/wms:Style">
    <xsl:if test="Name=$styleName or wms:Name=$styleName">
      <wmc:StyleList>
        <wmc:Style current="1">
          <xsl:apply-templates select="child::node()"/>
        </wmc:Style>
    	</wmc:StyleList>
  	</xsl:if>
  </xsl:template>

  <xsl:template match="Layer/LegendURL | wms:Layer/wms:LegendURL">
    <wmc:LegendURL>
      <xsl:apply-templates select="child::node()"/>
    </wmc:LegendURL>
  </xsl:template>

  <xsl:template match="Layer/OnlineResource | wms:Layer/wms:OnlineResource">
    <xsl:variable name="legendUrl"><xsl:value-of select="./@href"/> </xsl:variable>
    <wmc:OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="{$legendUrl}"/>
  </xsl:template>
  
 	<xsl:template match="Layer/Title | wms:Layer/wms:Title">
    <wmc:Title><xsl:value-of select="."/></wmc:Title>
  </xsl:template>
  
  <xsl:template match="Layer/Name | wms:Layer/wms:Name">
    <wmc:Name><xsl:value-of select="."/></wmc:Name>
  </xsl:template>
  
  <xsl:template match="Layer/Abstract | wms:Layer/wms:Abstract">
    <wmc:Abstract><xsl:value-of select="."/></wmc:Abstract>
  </xsl:template>
  
	<xsl:template match="Layer/DataURL">
    <wmc:DataURL>
  	  <wmc:Format>
    	  <xsl:value-of select="Format"/>
	    </wmc:Format>
	    <xsl:variable name="type" select="OnlineResource/@xlink:type"/>
  	  <xsl:variable name="href" select="OnlineResource/@xlink:href"/>
    	<wmc:OnlineResource xlink:type="{$type}" xlink:href="{$href}"/>
	  </wmc:DataURL>
  </xsl:template>
  
  <xsl:template match="Layer/MetadataURL">
    <wmc:MetadataURL>
  	  <wmc:Format>
    	  <xsl:value-of select="Format"/>
	    </wmc:Format>
  	  <xsl:variable name="type" select="OnlineResource/@xlink:type"/>
    	<xsl:variable name="href" select="OnlineResource/@xlink:href"/>
	    <wmc:OnlineResource xlink:type="{$type}" xlink:href="{$href}"/>
  	</wmc:MetadataURL>
  </xsl:template>
  
  <xsl:template match="Layer/SRS">
    <wmc:SRS><xsl:value-of select="."/></wmc:SRS>
  </xsl:template>
  
  <!-- for adding WMS 1.3.0 Layer -->
  <xsl:template match="wms:Layer/wms:DataURL">
    <wmc:DataURL>
   		<wmc:Format>
      	<xsl:value-of select="wms:Format"/>
	    </wmc:Format>
  	  <xsl:variable name="type" select="wms:OnlineResource/@xlink:type"/>
    	<xsl:variable name="href" select="wms:OnlineResource/@xlink:href"/>
	    <wmc:OnlineResource xlink:type="{$type}" xlink:href="{$href}"/>
  	</wmc:DataURL>
  </xsl:template>
  
  <xsl:template match="wms:Layer/wms:MetadataURL">
    <wmc:MetadataURL>
    	<wmc:Format>
      	<xsl:value-of select="wms:Format"/>
	    </wmc:Format>
	    <xsl:variable name="type" select="wms:OnlineResource/@xlink:type"/>
  	  <xsl:variable name="href" select="wms:OnlineResource/@xlink:href"/>
  	  <wmc:OnlineResource xlink:type="{$type}" xlink:href="{$href}"/>
	  </wmc:MetadataURL>
  </xsl:template>
  
  <xsl:template match="wms:Layer/wms:CRS">
    <wmc:SRS><xsl:value-of select="."/></wmc:SRS>
  </xsl:template>
  
  <!-- Styles -->
  <xsl:template match="Style/Name | wms:Style/wms:Name">
    <wmc:Name>
	    <xsl:value-of select="."/>
  	</wmc:Name>
  </xsl:template>
  
  <xsl:template match="Style/Title | wms:Style/wms:Title">
    <wmc:Title>
    	<xsl:value-of select="."/>
	  </wmc:Title>
  </xsl:template>  
  
  <xsl:template match="Style/Abstract | wms:Style/wms:Abstract">
	  <wmc:Abstract>
  	  <xsl:value-of select="."/>
	  </wmc:Abstract>
  </xsl:template>
  
  <xsl:template match="Style/LegendURL">
    <wmc:LegendURL>
      <xsl:attribute name="width">
        <xsl:value-of select="@width"/>
      </xsl:attribute>
      <xsl:attribute name="height">
        <xsl:value-of select="@height"/>
      </xsl:attribute>
      <xsl:variable name="type" select="OnlineResource/@xlink:type"/>
      <xsl:variable name="href" select="OnlineResource/@xlink:href"/>
      <wmc:OnlineResource xlink:type="{$type}" xlink:href="{$href}"/>
    </wmc:LegendURL>  
  </xsl:template>
  
  <xsl:template match="wms:Style/wms:LegendURL">
    <wmc:LegendURL>
      <xsl:attribute name="width">
        <xsl:value-of select="@width"/>
      </xsl:attribute>
      <xsl:attribute name="height">
        <xsl:value-of select="@height"/>
      </xsl:attribute>
      <xsl:variable name="type" select="wms:OnlineResource/@xlink:type"/>
      <xsl:variable name="href" select="wms:OnlineResource/@xlink:href"/>
      <wmc:OnlineResource xlink:type="{$type}" xlink:href="{$href}"/>
    </wmc:LegendURL>  
  </xsl:template>
  
  <!-- for selecting nodes from an OWSCat result set -->
  <xsl:template match="owscat:service_resources">
    <xsl:variable name="serverUrl"><xsl:value-of select="owscat:endpoint_getresource"/></xsl:variable>
    <wmc:Layer>
      <xsl:attribute name="queryable"><xsl:value-of select="./@queryable"/></xsl:attribute>
      <xsl:attribute name="hidden">0</xsl:attribute>
			<wmc:Server>
        <xsl:attribute name="service"><xsl:value-of select="owscat:service_type"/></xsl:attribute>
        <xsl:attribute name="version"><xsl:value-of select="owscat:service_version"/></xsl:attribute>
        <xsl:attribute name="title"><xsl:value-of select="owscat:organization"/></xsl:attribute>
				<wmc:OnlineResource xlink:type="simple" xlink:href="{$serverUrl}"/>
			</wmc:Server>
      <xsl:apply-templates/>
    </wmc:Layer>
  </xsl:template>
  
  <xsl:template match="owscat:title">
    <wmc:Title><xsl:value-of select="."/></wmc:Title>
  </xsl:template>
  
  <xsl:template match="owscat:name">
    <wmc:Name><xsl:value-of select="."/></wmc:Name>
  </xsl:template>
  
  <xsl:template match="owscat:abstract">
    <wmc:Abstract><xsl:value-of select="."/></wmc:Abstract>
  </xsl:template>
  
  <xsl:template match="owscat:dataurl">
    <wmc:DataURL><xsl:value-of select="."/></wmc:DataURL>
  </xsl:template>
  
  <xsl:template match="owscat:metadataurl">
    <wmc:MetadataURL><xsl:value-of select="."/></wmc:MetadataURL>
  </xsl:template>
  
  <xsl:template match="owscat:srs">
    <wmc:SRS><xsl:value-of select="."/></wmc:SRS>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>