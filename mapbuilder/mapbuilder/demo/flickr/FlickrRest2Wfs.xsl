<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"> 
<!--
Description: A stylesheet to convert flickr rest service to standards-compliant wfs.
Author:      Andreas Hocevar andreas.hocevarATgmail.com
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->

  <xsl:param name="proxyUrl"/>
  
  <xsl:template match="rsp/photos">
    <wfs:FeatureCollection xml:base="$proxyUrl">
      <xsl:for-each select="photo">
        <xsl:call-template name="featureMember"/>
      </xsl:for-each>
    </wfs:FeatureCollection>
  </xsl:template>

  <xsl:template name="featureMember">
    <xsl:call-template name="point"/>
  </xsl:template>

<xsl:template name="point">
  <xsl:param name="photouri"><xsl:value-of select="concat($proxyUrl,'?url=http%3A//www.flickr.com/services/rest/%3Fmethod%3Dflickr.photos.getInfo%26api_key%3Dafbacfb4d14cd681c04a06d69b24d847%26photo_id%3D',@id)"/></xsl:param>
  <xsl:param name="photodoc" select="document($photouri)/rsp"/>
  <xsl:variable name="lon">
    <xsl:for-each select="$photodoc/photo/tags/tag">
      <xsl:if test="substring-before(./@raw,'=')='geo:long'">
        <xsl:value-of select="substring-after(./@raw,'=')"/>
      </xsl:if>
    </xsl:for-each>
  </xsl:variable>
  <xsl:variable name="lat">
    <xsl:for-each select="$photodoc/photo/tags/tag">
      <xsl:if test="substring-before(./@raw,'=')='geo:lat'">
        <xsl:value-of select="substring-after(./@raw,'=')"/>
      </xsl:if>
    </xsl:for-each>
  </xsl:variable>
  <xsl:if test="$lat!=''">
    <gml:featureMember>
      <mb:geoRssFeature>
        <xsl:attribute name="fid"><xsl:value-of select="./@id"/></xsl:attribute>
        <mb:geom>
          <gml:Point>
            <gml:coordinates><xsl:value-of select="$lon"/>,<xsl:value-of select="$lat"/></gml:coordinates>
          </gml:Point>
        </mb:geom>
        <mb:title><xsl:value-of select="$photodoc/photo/title"/></mb:title>
        <mb:description><xsl:value-of select="$photodoc/photo/description"/></mb:description>
        <mb:url>http://static.flickr.com/<xsl:value-of select="./@server"/>/<xsl:value-of select="./@id"/>_<xsl:value-of select="./@secret"/>_s.jpg</mb:url>
      </mb:geoRssFeature>      
    </gml:featureMember>
  </xsl:if>
</xsl:template>
</xsl:stylesheet>
