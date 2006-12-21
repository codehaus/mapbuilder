<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
xmlns:rss="http://purl.org/rss/1.0/" 
xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" 
xmlns:dc="http://purl.org/dc/elements/1.1/" 
xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" 
xmlns:georss="http://www.georss.org/rss"  
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:gml="http://www.opengis.net/gml/3.1.1" 
xmlns:wmc="http://www.opengis.net/context" 
xmlns:sld="http://www.opengis.net/sld" 
xmlns:ogc="http://www.opengis.net/ogc"
xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
xmlns:media="http://search.yahoo.com/mrss"> 

	<!-- xsl:output method="html" omit-xml-declaration="no" encoding="utf-8" indent="yes"/ -->
	<xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8" indent="yes"/>
  
	<!-- xsl:template match="//rdf">
		<ResourceList xmlns="http://www.opengis.net/context" >
			<xsl:apply-templates select="/item"/>
		</ResourceList>
	</xsl:template -->
	
	<xsl:template match="//rss:item">
    <xsl:variable name="fid"><xsl:value-of select="@id"/></xsl:variable>
    <xsl:variable name="width"><xsl:value-of select="@width"/></xsl:variable>
    <xsl:variable name="height"><xsl:value-of select="@height"/></xsl:variable>
    <xsl:variable name="title"><xsl:value-of select="rss:title"/></xsl:variable>
    <xsl:variable name="content"><xsl:value-of select="rss:description"/></xsl:variable>
    <xsl:variable name="link"><xsl:value-of select="rss:link"/></xsl:variable>
    <xsl:variable name="longitude"><xsl:value-of select="geo:long"/></xsl:variable>
    <xsl:variable name="latitude"><xsl:value-of select="geo:lat"/></xsl:variable>
    
		<wmc:RssLayer  queryable="0" hidden="0" id="{$fid}" width="{$width}" height="{$height}"  >
			<wmc:Server service="GeoRSS" version="1.0" title="{$title}">
				<wmc:OnlineResource xlink:type="simple" xlink:href="{$link}"/>
			</wmc:Server>
			<wmc:Title><xsl:value-of select="$title"/></wmc:Title>
      <wmc:Where>
        <gml:Point>
          <gml.pos> <xsl:value-of select="$longitude"/>,<xsl:value-of select="$latitude"/></gml.pos>
        </gml:Point>
      </wmc:Where>
			<wmc:StyleList>
        <wmc:Style>
          <wmc:Name>Highlite</wmc:Name>
          <sld:PointSymbolizer>
            <sld:Graphic>
              <sld:ExternalGraphic>
                <sld:OnlineResource xlink:type="simple" xlink:href="./images/red_bullet3.gif" />
              </sld:ExternalGraphic> 
              <sld:Size>10</sld:Size>
            </sld:Graphic> 
            <sld:Stroke> 
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">3</sld:CssParameter> 
            </sld:Stroke> 
          </sld:PointSymbolizer>
        </wmc:Style>
        <wmc:Style>
          <wmc:Name>Normal</wmc:Name>
          <sld:PointSymbolizer>
            <sld:Graphic>
              <sld:ExternalGraphic>
                <sld:OnlineResource xlink:type="simple" xlink:href="./images/yellow_bullet3.gif" />
              </sld:ExternalGraphic> 
              <sld:Size>10</sld:Size>
            </sld:Graphic> 
          </sld:PointSymbolizer>
        </wmc:Style>
      </wmc:StyleList>
			<wmc:Abstract><xsl:value-of select="$content"/></wmc:Abstract>
			<wmc:Where></wmc:Where>
		</wmc:RssLayer>
	</xsl:template>
	
</xsl:stylesheet>
