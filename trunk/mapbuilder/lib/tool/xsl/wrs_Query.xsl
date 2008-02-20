<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: Generates a EBRIM Catalog Query from Filter Paramaters provided
Author:      rdewit
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


  <!-- Match Root -->
  <xsl:template match="/">

  <GetRecords 
    xmlns:csw="http://www.opengis.net/csw" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:gml="http://www.opengis.net/gml" 
    csw:schemaLocation="http://www.opengis.net/csw http://schemas.cubewerx.com/csw/2.0.0/CSW-discovery.xsd" 
    ogc:schemaLocation="http://www.opengis.net/ogc http://schemas.cubewerx.com/schemas/filter/1.0.0/filter.xsd" 
    service="WRS" 
    version="2.0.0" 
    outputFormat="text/xml" 
    startPosition="1" 
    maxRecords="1000" 
    resultType="RESULTS">

    <Query typeNames="ExtrinsicObject Association=ServiceAssociation Service">
      <ElementName>/ExtrinsicObject</ElementName>
      <ElementName>/Service</ElementName>

      <!-- Check if there is a (non-empty) filter node -->
      <!-- If so, loop through children and look for templates that match them -->
      <xsl:if test="filter/*">
      <Constraint>
        <ogc:Filter>
          <ogc:And>
          <xsl:for-each select="filter/*">
            <xsl:if test="node()">
            <xsl:apply-templates select="."/>
            </xsl:if>
          </xsl:for-each>
          </ogc:And>
        </ogc:Filter>
      </Constraint>
      </xsl:if>

    </Query>
  </GetRecords>

  </xsl:template>


  <xsl:template match="serviceassociation">
    <!-- Link the layer (coming from the extrinsic object), to the service object via the "Serves" association -->
    <!-- Can be things like: OperatesOn, Serves, etc -->
    <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>/ExtrinsicObject/@ID</ogc:PropertyName>
        <ogc:PropertyName>/ServiceAssociation/@targetObject</ogc:PropertyName>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsLike>
        <ogc:PropertyName>/ServiceAssociation/@associationType</ogc:PropertyName>
        <ogc:Literal><xsl:value-of select="."/></ogc:Literal>
      </ogc:PropertyIsLike>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>/Service/@ID</ogc:PropertyName>
        <ogc:PropertyName>/ServiceAssociation/@sourceObject</ogc:PropertyName>
      </ogc:PropertyIsEqualTo>
    </ogc:And>
  </xsl:template>

  <xsl:template match="featuretype">
		<!-- The object type has to be either a feature type WFS_layer or WMS_Layer -->
    <ogc:Or>
      <ogc:PropertyIsLike>
        <ogc:PropertyName>/ExtrinsicObject/@objectType</ogc:PropertyName>
        <ogc:Literal>FeatureType</ogc:Literal>
      </ogc:PropertyIsLike>
      <ogc:PropertyIsLike>
        <ogc:PropertyName>/ExtrinsicObject/@objectType</ogc:PropertyName>
        <ogc:Literal><xsl:value-of select="."/></ogc:Literal>
      </ogc:PropertyIsLike>
    </ogc:Or>
  </xsl:template>

  <xsl:template match="servicetype">
    <!-- Can be things like: WFS, WMS, etc -->
    <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>/Service/Slot/@name</ogc:PropertyName>
        <ogc:Literal>Service Type</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>/Service/Slot/ValueList/Value</ogc:PropertyName>
        <ogc:Literal><xsl:value-of select="."/></ogc:Literal>
      </ogc:PropertyIsEqualTo>
    </ogc:And>
  </xsl:template>

  <xsl:template match="keywords">
    <xsl:call-template name="tokenize">
      <xsl:with-param name="inputString" select="concat(normalize-space(.),' ')"/>
      <xsl:with-param name="resultElement" select="'keyword'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="keyword">
    <xsl:param name="keyword"/>
      <ogc:Or>
        <ogc:PropertyIsLike>
          <ogc:PropertyName>/ExtrinsicObject/Name/LocalizedString/@value</ogc:PropertyName>
          <ogc:Literal>%<xsl:value-of select="$keyword"/>%</ogc:Literal>
        </ogc:PropertyIsLike>
        <ogc:PropertyIsLike>
          <ogc:PropertyName>/ExtrinsicObject/Description/LocalizedString/@value</ogc:PropertyName>
          <ogc:Literal>%<xsl:value-of select="$keyword"/>%</ogc:Literal>
        </ogc:PropertyIsLike>
        <ogc:And>
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>/ExtrinsicObject/Slot/@name</ogc:PropertyName>
            <ogc:Literal>Keyword</ogc:Literal>
          </ogc:PropertyIsEqualTo>
          <ogc:PropertyIsLike>
            <ogc:PropertyName>/ExtrinsicObject/Slot/ValueList/Value</ogc:PropertyName>
            <ogc:Literal>%<xsl:value-of select="$keyword"/>%</ogc:Literal>
          </ogc:PropertyIsLike>
        </ogc:And>
      </ogc:Or>
  </xsl:template>

  <!-- TODO: make this generic -->
  <xsl:template match="location">
    <ogc:BBOX>
      <ogc:PropertyName>/ExtrinsicObject/Slot[@name='FootPrint']/ValueList/Value[1]</ogc:PropertyName>
      <gml:Box srsName="EPSG:4326">
        <gml:coordinates><xsl:value-of select="."/></gml:coordinates>
      </gml:Box>
    </ogc:BBOX>
  </xsl:template>


  <!-- Code to tokenize a string into nodes --> 
  <!-- This can be used to convert a string with keywords to an XML representation -->
  <!-- It fails with the last word if there is no whitespace after that word :-S -->
  <!-- http://www.biglist.com/lists/xsl-list/archives/200603/msg00083.html -->
  <xsl:template name="tokenize">
    <xsl:param name="inputString"/>
    <xsl:param name="separator" select="' '"/>
    <xsl:param name="resultElement" select="'item'"/>
    <xsl:variable
      name="token"
      select="substring-before($inputString, $separator)"
    />
    <xsl:variable
      name="nextToken"
      select="substring-after($inputString, $separator)"
    />

    <xsl:if test="$token">
      <xsl:call-template name="keyword">
        <xsl:with-param name="keyword" select="$token"/>
      </xsl:call-template>
    </xsl:if>

    <xsl:if test="$nextToken">
      <xsl:call-template name="tokenize">
        <xsl:with-param
          name="inputString"
          select="$nextToken"/>
        <xsl:with-param
          name="separator"
          select="$separator"/>
        <xsl:with-param
          name="resultElement"
          select="$resultElement"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
