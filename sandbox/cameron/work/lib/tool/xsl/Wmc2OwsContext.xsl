<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns="http://www.opengis.net/ows-context/0.2.1"
  xmlns:wmc="http://www.opengis.net/context" 
  xmlns:wmc11="http://www.opengeospatial.net/context" 
  xmlns:wms="http://www.opengis.net/wms"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:ows="http://www.opengis.net/ows">
<!--
Description: Convert a WMC document to a OWS Context document.
Author:      Cameron Shorter
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

This stylesheet contains 5 types of templates:
1. Specific conversions of tag names: Eg: KeywordList to Keywords.
2. A list of tags which are converted to ows namespace
3. Remaining nodes are converted to wmc namespace
4. Everything else (comments, etc) which are copied verbatum
5. tokenize() which converts a string of SRS fields to an array of CRS elements

$Id: $
$Name:  $

-->
  <xsl:output method="xml" indent="yes"/>

  <!-- ViewContext -> OWSContext -->
  <xsl:template match="/wmc:ViewContext">
    <OWSContext
      version="0.2.1"
      id="ows-context"
      xmlns="http://www.opengis.net/ows-context/0.2.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:ogc="http://www.opengis.net/ogc" 
      xmlns:ows="http://www.opengis.net/ows" 
      xmlns:param="http://www.opengis.net/param">
      <xsl:apply-templates/>
    </OWSContext>
  </xsl:template>

  <!-- General nodes: -->

  <!-- BoundingBox -->
  <xsl:template match="wmc:BoundingBox">
    <ows:BoundingBox>
      <xsl:attribute name="crs">
        <xsl:value-of select="@SRS"/>
      </xsl:attribute>
      <ows:LowerCorner>
        <xsl:value-of select="concat(@minx,' ',@miny)"/>
      </ows:LowerCorner>
      <ows:UpperCorner>
        <xsl:value-of select="concat(@maxx,' ',@maxy)"/>
      </ows:UpperCorner>
    </ows:BoundingBox>
  </xsl:template>

  <!-- KeywordList -> Keywords -->
  <xsl:template match="wmc:KeywordList">
    <ows:KeyWords>
      <xsl:apply-templates/>
    </ows:KeyWords>
  </xsl:template>

  <!-- ContactInformation -> ServiceProvider/ServiceContact/ContactInfo -->
  <xsl:template match="wmc:ContactInformation">
    <ows:ServiceProvider>
      <ows:ProviderName>
        <xsl:value-of select="wmc:ContactPersonPrimary/wmc:ContactOrganization"/>
      </ows:ProviderName>
      <ows:ServiceContact>
        <ows:IndividualName>
          <xsl:value-of select="wmc:ContactPersonPrimary/wmc:ContactPerson"/>
        </ows:IndividualName>
        <ows:PositionName>
          <xsl:value-of select="wmc:ContactPosition"/>
        </ows:PositionName>
        <ows:ContactInfo>
          <ows:Phone>
            <ows:Voice>
              <xsl:value-of select="wmc:ContactVoiceTelephone"/>
            </ows:Voice>
            <ows:Facsimile>
              <xsl:value-of select="wmc:ContactFacsimileTelephone"/>
            </ows:Facsimile>
          </ows:Phone>
          <ows:Address>
            <ows:DeliveryPoint>
              <xsl:value-of select="wmc:ContactAddress/wmc:Address"/>
            </ows:DeliveryPoint>
            <ows:City>
              <xsl:value-of select="wmc:ContactAddress/wmc:City"/>
            </ows:City>
            <ows:AdministrativeArea>
              <xsl:value-of select="wmc:ContactAddress/wmc:StateOrProvince"/>
            </ows:AdministrativeArea>
            <ows:Country>
              <xsl:value-of select="wmc:ContactAddress/wmc:Country"/>
            </ows:Country>
          </ows:Address>
        </ows:ContactInfo>
      </ows:ServiceContact>
    </ows:ServiceProvider>
  </xsl:template>

  <!-- LayerList -> ResourceList -->
  <xsl:template match="wmc:LayerList">
    <ResourceList>
      <xsl:apply-templates/>
    </ResourceList>
  </xsl:template>

  <!-- Layer Nodes -->

  <!-- Name -> Identifier -->
  <xsl:template match="wmc:Name">
    <ows:Identifier>
      <xsl:value-of select="."/>
    </ows:Identifier>
  </xsl:template>

  <!-- FormatList/Format -> OutputFormat -->
  <xsl:template match="wmc:Format">
    <ows:OutputFormat>
      <xsl:value-of select="."/>
    </ows:OutputFormat>
  </xsl:template>

  <!-- <SRS>EPSG:4326 EPSG:4269</> -> <AvailableCRS>EPSG:4326</> -->
  <xsl:template match="wmc:SRS">
    <xsl:call-template name="tokenize">
      <xsl:with-param name="str" select="normalize-space(.)"/>
      <xsl:with-param name="tag" select="ows:AvailableCRS"/>
    </xsl:call-template>
  </xsl:template>

  <!-- Server -->
  <xsl:template match="wmc:Server">
    <Server service="{@service}" version="{@version}" title="{@title}">
      <OnlineResource
        xlink:type="{wmc:OnlineResource/@xlink:type}"
        xlink:href="{wmc:OnlineResource/@xlink:href}"/>
    </Server>
  </xsl:template>

  <!-- tokenize -->
  <!-- Extract words out of a space seperated string and return as tags -->
  <xsl:template name="tokenize">
    <xsl:param name="str"/>
    <xsl:param name="tag"/>
    <xsl:choose>
      <!-- Recursively break up string around token -->
      <xsl:when test="contains($str,' ')">
        <xsl:call-template name="tokenize">
          <xsl:with-param name="str" select="substring-before($str,' ')"/>
          <xsl:with-param name="tag" select="$tag"/>
        </xsl:call-template>
        <xsl:call-template name="tokenize">
          <xsl:with-param name="str" select="substring-after($str,' ')"/>
          <xsl:with-param name="tag" select="$tag"/>
        </xsl:call-template>
      </xsl:when>
      <!-- Write remaining token as node -->
      <xsl:when test="string-length($str)>0">
        <!--TBD Use Node instead of <AvailableCRS> -->
        <AvailableCRS>
          <xsl:value-of select="$str"/>
        </AvailableCRS>
      </xsl:when>
      <!-- Recursion stops when string is empty -->
    </xsl:choose>
  </xsl:template>

  <!-- Convert specific elements to ows: namespace -->
  <xsl:template match=" wmc:Title| wmc:Abstract| wmc:Keyword ">
    <xsl:element name="{local-name()}" namespace="http://www.opengis.net/ows">
      <xsl:apply-templates select="@*|node()"/>
    </xsl:element>
  </xsl:template>

  <!-- Change wmc namespace to owc (default) namespace -->
  <xsl:template match="wmc:*">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="@*|node()"/>
    </xsl:element>
  </xsl:template>

  <!-- Copy all other elements verbatum -->
  <xsl:template match="*|@*|processing-instruction()|comment()">
    <xsl:copy>
      <xsl:apply-templates select="node()"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
