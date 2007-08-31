<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: parses a EBRIM response from a Catalog Query and returns
             an OWS Context document Layer element.
Author:      camerons
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id:$
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:wms="http://www.opengis.net/wms"
    xmlns:ogc="http://www.opengis.net/ogc"
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
      <xsl:apply-templates/>
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
        <xsl:apply-templates select="//rim:Service[position()=(position()+1)]"/>
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
  <xsl:template match="rim:Service">
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
  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
