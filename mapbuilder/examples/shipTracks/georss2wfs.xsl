<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:gml3="http://www.opengis.net/gml/3.1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rss="http://purl.org/rss/1.0/" xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" xmlns:georss="http://www.georss.org/georss"  xmlns:wfs="http://www.opengis.net/wfs" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder"> 
<!--
Description: A stylesheet to convert strange geobliki wfs to standards-compliant wfs.
Author:      Andreas Hocevar andreas.hocevarATgmail.com
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->
  <xsl:template match="rdf:RDF">
    <wfs:FeatureCollection>
      <xsl:for-each select="rss:item">
        <xsl:call-template name="featureMember"/>
      </xsl:for-each>
    </wfs:FeatureCollection>
  </xsl:template>

  <xsl:template name="featureMember">
    <gml:featureMember>
    	<mb:geoRssFeature>
    	  <xsl:attribute name="fid"><xsl:value-of select="./@id"/></xsl:attribute>
    	  <mb:geom>
    	    <xsl:call-template name="point"/>
    	    <xsl:call-template name="lineString"/>
    	  </mb:geom>
    	</mb:geoRssFeature>      
    </gml:featureMember>
  </xsl:template>

<xsl:template name="point">
  <xsl:if test="georss:where/gml3:Point">
    <gml:Point>
      <gml:pos><xsl:value-of select="georss:where/gml3:Point/gml3:pos"/></gml:pos>
    </gml:Point>
  </xsl:if>
</xsl:template>

<xsl:template name="lineString">
  <xsl:if test="georss:where/gml3:LineString">
    <gml:LineString>
      <gml:posList dimension="2"><xsl:value-of select="translate(georss:where/gml3:LineString/gml3:posList, ',', ' '"/></gml:posList>
    </gml:LineString>
  </xsl:if>
</xsl:template>

</xsl:stylesheet>
