<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate an array of DHTML layers.
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" xmlns:cml="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>
  <!--
  <xsl:include href="ogcMapImgObjects.xsl" />
  -->

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="top" select="'0px'"/>
  <xsl:param name="left" select="'0px'"/>
  <xsl:param name="baseDir" select="'../widget'"/>

  <xsl:param name="bbox">
    <xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@minx"/>,<xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@miny"/>,
    <xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@maxx"/>,<xsl:value-of select="/cml:ViewContext/cml:General/cml:BoundingBox/@maxy"/>
  </xsl:param>
  <xsl:param name="width">
    <xsl:value-of select="/cml:ViewContext/cml:General/cml:Window/@width"/>
  </xsl:param>
  <xsl:param name="height">
    <xsl:value-of select="/cml:ViewContext/cml:General/cml:Window/@height"/>
  </xsl:param>
  <xsl:param name="srs" select="/cml:ViewContext/cml:General/cml:BoundingBox/@SRS"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/cml:ViewContext">
  
 
    <DIV>
      <xsl:attribute name="STYLE">    
            WIDTH: <xsl:value-of select="$width"/>;
            HEIGHT: <xsl:value-of select="$height"/>;
            BACKGROUND-COLOR: #ccffcc; 
            MARGIN: 0; 
            PADDING: 0pt; 
            POSITION: absolute;            
      </xsl:attribute>
                
      <xsl:apply-templates select="cml:LayerList/cml:Layer"/>
      <!--          
        <xsl:with-param name="srs"><xsl:value-of select="$srs"/></xsl:with-param>
        <xsl:with-param name="bbox"><xsl:value-of select="$bbox"/></xsl:with-param>
        <xsl:with-param name="width"><xsl:value-of select="$width"/></xsl:with-param>
        <xsl:with-param name="height"><xsl:value-of select="$height"/></xsl:with-param>
      </xsl:apply-templates>
 -->
 
 <DIV STYLE="position:absolute; top:{$top}; left:{$left};" ID="glass">
      <xsl:element name="IMG">    
        <xsl:attribute name="SRC">    
          <xsl:value-of select="$baseDir"/>/mappane/dot.gif
        </xsl:attribute>
        <xsl:attribute name="WIDTH">
            <xsl:value-of select="$width"/>
        </xsl:attribute>
        <xsl:attribute name="HEIGHT">
            <xsl:value-of select="$height"/>
        </xsl:attribute>
      </xsl:element>    
    </DIV>    
               
    </DIV>

  
  </xsl:template>
  
  
   <xsl:template match="cml:Layer">
    <xsl:param name="version">
        <xsl:value-of select="cml:Server/@version"/>    
    </xsl:param>
    <xsl:param name="baseUrl">
        <xsl:value-of select="cml:Server/cml:OnlineResource/@xlink:href"/>    
    </xsl:param>
    <xsl:variable name="visible">
      <xsl:choose>
        <xsl:when test="@hidden='1'">false</xsl:when>
        <xsl:otherwise>true</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="firstJoin">
      <xsl:choose>
        <xsl:when test="contains($baseUrl, '?')">&amp;</xsl:when> 
        <xsl:otherwise>?</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="mapRequest">
      <xsl:choose>
        <xsl:when test="starts-with($version, '1.0')">
            WMTVER=<xsl:value-of select="$version"/>&amp;REQUEST=map
        </xsl:when>            
        <xsl:otherwise>
            VERSION=<xsl:value-of select="$version"/>&amp;REQUEST=GetMap
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <DIV>    
        <xsl:attribute name="STYLE">
          position:absolute; top:<xsl:value-of select="$top"/>; left:<xsl:value-of select="$left"/>;
        </xsl:attribute>
        <xsl:attribute name="ID">
            <xsl:value-of select="cml:Name"/>
        </xsl:attribute>
    
    <xsl:element name="IMG">    
        <xsl:variable name="src">    
            <xsl:value-of select="$baseUrl"/>
            <xsl:value-of select="$firstJoin"/>
             <xsl:value-of select="$mapRequest"/>
   &amp;SRS=<xsl:value-of select="$srs"/>
  &amp;BBOX=<xsl:value-of select="$bbox"/>
 &amp;WIDTH=<xsl:value-of select="$width"/>
&amp;HEIGHT=<xsl:value-of select="$height"/>
&amp;LAYERS=<xsl:value-of select="cml:Name"/>
&amp;STYLES=<xsl:value-of select="translate(cml:StyleList/cml:Style[@current='1']/cml:Name,' ','+')"/>
&amp;FORMAT=<xsl:value-of select="cml:FormatList/cml:Format[@current='1']"/>
&amp;TRANSPARENT=true
<!--	if (this.transparent) src += '&' + 'TRANSPARENT=' + this.transparent;
	if (this.bgcolor) src += '&' + 'BGCOLOR=' + this.bgcolor;
	//if (this.exceptions) src += '&' + 'EXCEPTIONS=' + this.exceptions;
	if (this.vendorstr) src += '&' + this.vendorstr;
        -->
        </xsl:variable>
        <xsl:attribute name="SRC">    
            <xsl:value-of select="translate(normalize-space($src),' ', '' )" disable-output-escaping="no"/>
        </xsl:attribute>
        <xsl:attribute name="WIDTH">
            <xsl:value-of select="$width"/>
        </xsl:attribute>
        <xsl:attribute name="HEIGHT">
            <xsl:value-of select="$height"/>
        </xsl:attribute>
        <xsl:attribute name="ALT">
            <xsl:value-of select="cml:Title"/>
        </xsl:attribute>
    </xsl:element>    
    </DIV>    
  </xsl:template>


</xsl:stylesheet>
