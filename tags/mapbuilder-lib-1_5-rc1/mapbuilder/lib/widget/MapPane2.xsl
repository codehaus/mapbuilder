<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: parses an OGC context document to generate an array of DHTML layers
            that contain an <IMG> tag with src attribute set to the GetMap request.
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: MapPane.xsl 1918 2006-02-13 22:31:26 -0500 (Mon, 13 Feb 2006) cappelaere $
$Name$
-->
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows" >

  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:strip-space elements="*"/>
  <!--
  <xsl:include href="ogcMapImgObjects.xsl" />
  -->

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="context">config['<xsl:value-of select="$modelId"/>']</xsl:param>
  <xsl:param name="extraAttributes">true</xsl:param>
  <xsl:param name="isIE">false</xsl:param>
  <xsl:param name="outputNodeId"/>

  <xsl:param name="bbox">
    <xsl:value-of select="substring-before(//wmc:General/ows:BoundingBox/ows:LowerCorner,' ')" />,
    <xsl:value-of select="substring-after(//wmc:General/ows:BoundingBox/ows:LowerCorner,' ')" />,
    <xsl:value-of select="substring-before(//wmc:General/ows:BoundingBox/ows:UpperCorner,' ')" />,
    <xsl:value-of select="substring-after(//wmc:General/ows:BoundingBox/ows:UpperCorner,' ')" />
  </xsl:param>
  <xsl:param name="width">
    <xsl:value-of select="//wmc:General/wmc:Window/@width"/>
  </xsl:param>
  <xsl:param name="height">
    <xsl:value-of select="//wmc:General/wmc:Window/@height"/>
  </xsl:param>
  <xsl:param name="srs" select="//wmc:General/wmc:BoundingBox/@SRS"/>
  <xsl:param name="timeList"/>
  <xsl:param name="timeListName"/>
  <xsl:param name="uniqueId"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/wmc:OWSContext">
      <div style="position:absolute; width:{$width}px; height:{$height}px" id="{$outputNodeId}">
        <xsl:apply-templates select="wmc:ResourceList"/>
      </div>
  </xsl:template>
  
  <xsl:template match="wmc:Layer">
  
    <xsl:choose>
      <xsl:when test="$timeList and wmc:DimensionList/wmc:Dimension[@name='time']">
          <xsl:call-template name="tokenize">
            <xsl:with-param name="str" select="$timeList"/>
            <xsl:with-param name="sep" select="','"/>
          </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="layerOutput"/>
      </xsl:otherwise>
    </xsl:choose>
    
  </xsl:template>

  <xsl:template match="wmc:StyledLayerDescriptor">
    <xsl:apply-templates mode="serialize" select="."/>
  </xsl:template>

  <xsl:template name="layerOutput">
    <xsl:param name="version">
        <xsl:value-of select="wmc:Server/@version"/>    
    </xsl:param>
    <xsl:param name="baseUrl">
        <xsl:value-of select="wmc:Server/wmc:OnlineResource/@xlink:href"/>    
    </xsl:param>
    <xsl:param name="timestamp"><xsl:value-of select="wmc:DimensionList/wmc:Dimension[@name='time']/@default"/></xsl:param>
    <xsl:param name="metadataUrl">
        <xsl:value-of select="wmc:MetadataURL/wmc:OnlineResource/@xlink:href"/>    
    </xsl:param>
    <xsl:param name="format">
      <xsl:choose>
        <xsl:when test="wmc:FormatList"><xsl:value-of select="wmc:FormatList/wmc:Format[@current='1']"/></xsl:when>
        <xsl:otherwise>image/gif</xsl:otherwise>
      </xsl:choose>
    </xsl:param>
    <xsl:param name="visibility">
      <xsl:choose>
        <xsl:when test="starts-with($isIE,'true') and $format='image/png'">hidden</xsl:when>
        <xsl:when test="@hidden='1'">hidden</xsl:when>
        <xsl:otherwise>visible</xsl:otherwise>
      </xsl:choose>
    </xsl:param>
    <xsl:param name="layerName">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text"><xsl:value-of select="wmc:Name"/></xsl:with-param>
        <xsl:with-param name="replace"><xsl:value-of select="' '"/></xsl:with-param>
        <xsl:with-param name="with"><xsl:value-of select="'+'"/></xsl:with-param>
      </xsl:call-template>
    </xsl:param>
    <xsl:variable name="styleParam">
      <xsl:choose>
        <xsl:when test="wmc:StyleList/wmc:Style[@current='1']/wmc:SLD/wmc:OnlineResource">
          sld=<xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:SLD/wmc:OnlineResource/@xlink:href"/>
        </xsl:when>
        <xsl:when test="wmc:StyleList/wmc:Style[@current='1']/wmc:SLD/wmc:StyledLayerDescriptor">
          sld_body=<xsl:apply-templates select="wmc:StyleList/wmc:Style[@current='1']/wmc:SLD/wmc:StyledLayerDescriptor" />
        </xsl:when>
        <xsl:when test="wmc:StyleList/wmc:Style[@current='1']/wmc:SLD/wmc:FeatureTypeStyle">
          sld=<xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:SLD/wmc:FeatureTypeStyle"/>
        </xsl:when>
        <xsl:otherwise>
          styles=<xsl:call-template name="replace-string">
            <xsl:with-param name="text"><xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:Name"/></xsl:with-param>
            <xsl:with-param name="replace"><xsl:value-of select="' '"/></xsl:with-param>
            <xsl:with-param name="with"><xsl:value-of select="'+'"/></xsl:with-param>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="firstJoin">
      <xsl:choose>
        <xsl:when test="substring($baseUrl,string-length($baseUrl))='?'"></xsl:when>
        <xsl:when test="contains($baseUrl, '?')">&amp;</xsl:when> 
        <xsl:otherwise>?</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="mapRequest">
      <xsl:choose>
        <xsl:when test="starts-with($version, '1.0')">
            wmtver=<xsl:value-of select="$version"/>&amp;request=map
        </xsl:when>            
        <xsl:otherwise>
            version=<xsl:value-of select="$version"/>&amp;request=GetMap&amp;service=wms
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <div>    
      <xsl:attribute name="style">position:absolute; visibility:<xsl:value-of select="$visibility"/>; top:0px; left:0px;</xsl:attribute>
      <xsl:attribute name="id">
        <xsl:value-of select="$modelId"/>_<xsl:value-of select="$widgetId"/>_<xsl:value-of select="$layerName"/><xsl:if test="$timestamp and wmc:DimensionList/wmc:Dimension[@name='time']">_<xsl:value-of select="$timestamp"/></xsl:if>
      </xsl:attribute>
      <xsl:if test="$timestamp and wmc:DimensionList/wmc:Dimension[@name='time']">
        <xsl:attribute name="time"><xsl:value-of select="$timestamp"/></xsl:attribute>
      </xsl:if>
    
    <xsl:element name="img">    
        <xsl:variable name="src">    
            <xsl:value-of select="$baseUrl"/>
            <xsl:value-of select="$firstJoin"/>
            <xsl:value-of select="$mapRequest"/>
&amp;layers=<xsl:value-of select="$layerName"/>
   &amp;srs=<xsl:value-of select="$srs"/>
  &amp;bbox=<xsl:value-of select="$bbox"/>
 &amp;width=<xsl:value-of select="$width"/>
&amp;height=<xsl:value-of select="$height"/>
&amp;format=<xsl:value-of select="$format"/>
       &amp;<xsl:value-of select="$styleParam"/>
&amp;transparent=true
        <xsl:if test="string-length($timestamp)>0"> 
       &amp;time=<xsl:value-of select="$timestamp"/>
        </xsl:if>
        &amp;uniqueid=<xsl:value-of select="$uniqueId"/>
<!--	
  //TBD: these still to be properly handled 
  //if (this.exceptions) src += '&' + 'EXCEPTIONS=' + this.exceptions;
  //if (this.vendorstr) src += '&' + this.vendorstr;
  // -->
        </xsl:variable>
        <xsl:attribute name="src">    
            <xsl:value-of select="translate(normalize-space($src),' ', '' )" disable-output-escaping="no"/>
        </xsl:attribute>
        <xsl:attribute name="width">
            <xsl:value-of select="$width"/>
        </xsl:attribute>
        <xsl:attribute name="height">
            <xsl:value-of select="$height"/>
        </xsl:attribute>
        <xsl:if test="starts-with($extraAttributes,'true')">
          <xsl:attribute name="alt">
              <xsl:value-of select="wmc:Title"/>
          </xsl:attribute>
          <xsl:attribute name="title">
              <xsl:value-of select="wmc:Title"/>
          </xsl:attribute>
          <xsl:if test="string-length($metadataUrl)>0">
            <xsl:attribute name="longdesc"><xsl:value-of select="$metadataUrl"/></xsl:attribute>
          </xsl:if>
        </xsl:if>
    </xsl:element>    
    </div>    
  </xsl:template>

  
  <xsl:template name="tokenize"> <!-- tokenize a string -->
   <xsl:param name="str"/> <!-- String to process -->
   <xsl:param name="sep"/> <!-- Legal separator character -->
   <xsl:choose>
    <xsl:when test="contains($str,$sep)"> <!-- Only tokenize if there is a separator present in the string -->
      <xsl:call-template name="process-token"> <!-- Process the token before the separator -->
        <xsl:with-param name="token" select="substring-before($str,$sep)"/>
      </xsl:call-template>
      <xsl:call-template name="tokenize">  <!-- Re-tokenize the new string which is contained after the separator -->
        <xsl:with-param name="str" select="substring-after($str,$sep)"/>
        <xsl:with-param name="sep" select="$sep"/> <!-- carriage return -->
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>  <!-- If there is nothing else to tokenize, just treat the last part of the str as a regular token -->
      <xsl:call-template name="process-token">
        <xsl:with-param name="token" select="$str"/>
      </xsl:call-template>
    </xsl:otherwise>
   </xsl:choose>
  </xsl:template>

  <xsl:template name="process-token">  <!-- process - separate with <br> -->
    <xsl:param name="token"/> <!-- token to process -->
    <xsl:call-template name="layerOutput">
      <xsl:with-param name="timestamp" select="$token"/>
      <xsl:with-param name="visibility">hidden</xsl:with-param>
    </xsl:call-template>
  </xsl:template>
  
<!-- String replacemnent -->
<xsl:template name="replace-string">
  <xsl:param name="text"/>
  <xsl:param name="replace"/>
  <xsl:param name="with"/>
  <xsl:choose>
    <xsl:when test="contains($text,$replace)">
      <xsl:value-of select="substring-before($text,$replace)"/>
      <xsl:value-of select="$with"/>
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="substring-after($text,$replace)"/>
        <xsl:with-param name="replace" select="$replace"/>
        <xsl:with-param name="with" select="$with"/>
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="$text"/>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<!-- escape URI -->
<xsl:template name="escape-uri">
  <xsl:param name="text"/>

  <xsl:param name="tmp">
  <xsl:call-template name="replace-string">
    <xsl:with-param name="text" select="$text"/>
    <xsl:with-param name="replace" select="' '"/>
    <xsl:with-param name="with" select="'%20'"/>
  </xsl:call-template>
  </xsl:param>

  <xsl:call-template name="replace-string">
    <xsl:with-param name="text" select="$tmp"/>
    <xsl:with-param name="replace" select="'#'"/>
    <xsl:with-param name="with" select="'%23'"/>
  </xsl:call-template>

</xsl:template>

<!-- Serialize node using escape URI -->
<xsl:template match="*" mode="serialize">
  <xsl:param name="count"><xsl:value-of select="count(*)"/></xsl:param>
  <xsl:param name="value"><xsl:apply-templates mode="serialize"/></xsl:param>

  <xsl:text/>%3C<xsl:value-of select="name()"/>
  <xsl:apply-templates select="@*" mode="serialize"/>%3E<xsl:text/>
  <xsl:choose>
    <xsl:when test="$count=0"> 
      <xsl:call-template name="escape-uri">
        <xsl:with-param name="text" select="$value"/>
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="$value"/>    
    </xsl:otherwise>
  </xsl:choose>
  <xsl:text/>%3C/<xsl:value-of select="name()"/>%3E<xsl:text/>
</xsl:template>

<xsl:template match="@*" mode="serialize">
  <xsl:param name="value"><xsl:value-of select="."/></xsl:param>
  <!-- Attention: double quotes (%22) around parametr break it somewhere -->
  %20<xsl:value-of select="name()"/>=%22
  <xsl:call-template name="escape-uri">
    <xsl:with-param name="text" select="$value"/>
  </xsl:call-template>%22
</xsl:template>

</xsl:stylesheet>

