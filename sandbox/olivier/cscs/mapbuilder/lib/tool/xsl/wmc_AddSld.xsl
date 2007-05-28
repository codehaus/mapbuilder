<?xml version="1.0" encoding="UTF-8"?>
<!--
Description: create a StyleList node with a sld file
             Web Map Context document Stylelist element.
Author:      Terral
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: wmc_AddSld.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:wms="http://www.opengis.net/wms" 
    xmlns:wfs="http://www.opengis.net/wfs" 
	xmlns:sld="http://www.opengis.net/sld"
    xmlns:owscat="http://www.ec.gc.ca/owscat"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:ogc="http://www.opengis.net/ogc"
>

	<xsl:output method="xml"/>
	<xsl:strip-space elements="*"/>

	<!-- The coordinates of the DHTML Layer on the HTML page -->
	<xsl:param name="modelId"/>
	<xsl:param name="widgetId"/>
  
  
  	<!-- for selecting nodes from an SLD document -->
  	<xsl:template match="StyledLayerDescriptor">
  		<wmc:StyleList>
  			<wmc:Style current="1">
   				<wmc:SLD>
    				<wmc:StyledLayerDescriptor> 
        				<xsl:attribute name="version">1.0.0</xsl:attribute>
            			<xsl:apply-templates select="*|@*|comment()|processing-instruction()|text()"/>
    				</wmc:StyledLayerDescriptor>
    			</wmc:SLD>
   			</wmc:Style>
   		</wmc:StyleList>
  	</xsl:template>
  
  	<xsl:template match="*|@*|comment()|processing-instruction()|text()">
  		<xsl:copy>
    		<xsl:apply-templates select="*|@*|comment()|processing-instruction()|text()"/>
  		</xsl:copy>
	</xsl:template> 
	
</xsl:stylesheet>
