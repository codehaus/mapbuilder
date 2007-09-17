<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: parses a EBRIM response from a Catalog Query and returns
             an OWS Context document.
             This stylesheet assumes the Service node follows the
             IntrinsicObject (Layer) node.
Author:      camerons
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id:$
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:wms="http://www.opengis.net/wms"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:ows="http://www.opengis.net/ows"
    xmlns:csw="http://www.opengis.net/cat/csw"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:rim="urn:oasis:names:tc:ebxml-regrep:rim:xsd:2.5"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
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
  <xsl:param name="id"></xsl:param>
  
  <!-- Match Root -->
  <xsl:template match="/">
    <wmc:OWSContext>
		  <wmc:General>
		    <wmc:Window width="600" height="300"/>
		    <ows:BoundingBox crs="EPSG:4326">
		      <ows:LowerCorner>-180 -90</ows:LowerCorner>
		      <ows:UpperCorner>180 90</ows:UpperCorner>
		    </ows:BoundingBox>
		    <wmc:Title xml:lang="en">Mapbuilder Generated Context</wmc:Title>
		  </wmc:General>
      <wmc:ResourceList>
        <xsl:apply-templates/>
      </wmc:ResourceList>
    </wmc:OWSContext>
  </xsl:template>

  <!-- Match Layer (ExtrinsicObject -->
  <xsl:template match="rim:ExtrinsicObject">
    <!--xsl:if test="not($id) or ($id=@id)"-->
      <wmc:Layer queryable="0" hidden="0">
        <xsl:attribute name="id">
          <xsl:value-of select="@id"/>
        </xsl:attribute>
        <!-- insert service -->
        <!--xsl:apply-templates select="//rim:Service[position()=(position()+1)]"/-->
        <xsl:call-template name="Service">
          <xsl:with-param name="pos" select="position()"/>
        </xsl:call-template>
        <wmc:Name>
          <xsl:value-of select="rim:Name/rim:LocalizedString/@value"/>
        </wmc:Name>
        <wmc:Title>
          <xsl:value-of select="rim:Slot[@name='Title']//rim:Value"/>
        </wmc:Title>
        <wmc:Abstract>
          <xsl:value-of select="rim:Description/rim:LocalizedString/@value"/>
        </wmc:Abstract>
      </wmc:Layer>
    <!--/xsl:if-->
  </xsl:template>

  <!-- Match Service -->
  <!-- xsl:template match="rim:Service[position()={$pos}]"-->
  <xsl:template name="Service">
    <xsl:param name="pos"/>
  
    <xsl:for-each select="../rim:Service[(($pos+1) div 2)]">
	    <wmc:Server>
	      <xsl:attribute name="id">
	        <xsl:value-of select="@id"/>
	      </xsl:attribute>
	      <xsl:attribute name="service">
	        <xsl:value-of select="rim:Name/rim:LocalizedString/@value"/>
	      </xsl:attribute>
	      <xsl:attribute name="version">
	        <xsl:value-of select="@userVersion"/>
	      </xsl:attribute>
	      <xsl:attribute name="title">
	        <xsl:value-of select="rim:Slot[@name='Title']//rim:Value"/>
	      </xsl:attribute>
	      <!-- TBD: How do we extract method=POST/GET? -->
	      <wmc:OnlineResource method="POST" xlink:type="simple">
	        <xsl:attribute name="xlink:href">
	          <xsl:value-of select="rim:Slot[@name='OnlineResource']//rim:Value"/>
	        </xsl:attribute>
	      </wmc:OnlineResource>
	    </wmc:Server>
    </xsl:for-each>

  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>