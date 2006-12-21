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
xmlns:media="http://search.yahoo.com/mrss"> 

	<!-- xsl:output method="html" omit-xml-declaration="no" encoding="utf-8" indent="yes"/ -->
	<xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8" indent="yes"/>
  
	<xsl:template match="/">
		<ResourceList xmlns="http://www.opengis.net/context" >
			<xsl:apply-templates select="."/>
		</ResourceList>
	</xsl:template>
	
	<xsl:template match="photo">
    <xsl:variable name="pid"><xsl:value-of select="@pid"/></xsl:variable>
    <xsl:variable name="id"><xsl:value-of select="@id"/></xsl:variable>
    <xsl:variable name="width"><xsl:value-of select="@width"/></xsl:variable>
    <xsl:variable name="height"><xsl:value-of select="@height"/></xsl:variable>
    <xsl:variable name="title"><xsl:value-of select="@title"/></xsl:variable>
    <xsl:variable name="secret"><xsl:value-of select="@secret"/></xsl:variable>
    <xsl:variable name="server"><xsl:value-of select="@server"/></xsl:variable>
    <xsl:variable name="link">http://www.flickr.com/photos/15435549@N00/<xsl:value-of select="$id"/>/</xsl:variable>
    <xsl:variable name="thn">http://static.flickr.com/<xsl:value-of select="$server"/>/<xsl:value-of select="$id"/>_<xsl:value-of select="$secret"/>_s.jpg</xsl:variable>
   
		<wmc:RssLayer  queryable="0" hidden="0" id="{$id}" width="{$width}" height="{$height}" pid="{$id}" >
			<wmc:Server service="GeoRSS" version="1.0" title="{$title}">
				<wmc:OnlineResource xlink:type="simple" xlink:href="{$link}"/>
			</wmc:Server>
			<wmc:Name><xsl:value-of select="$title"/></wmc:Name>
			<wmc:Title><xsl:value-of select="$title"/></wmc:Title>
			<wmc:StyleList>
        <wmc:Style>
          <wmc:Name>Highlite</wmc:Name>
          <sld:PointSymbolizer>
           <sld:Stroke> 
              <sld:CssParameter name="stroke">#ffff00</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke> 
          </sld:PointSymbolizer>
        </wmc:Style>
        <wmc:Style>
          <wmc:Name>Normal</wmc:Name>
          <sld:PointSymbolizer>
            <sld:Graphic>
              <sld:ExternalGraphic>
                <sld:OnlineResource xlink:type="simple" xlink:href="{$thn}" />
              </sld:ExternalGraphic> 
              <sld:Size>32</sld:Size>
            </sld:Graphic> 
          </sld:PointSymbolizer>
        </wmc:Style>
      </wmc:StyleList>
			<wmc:Abstract><img src='{$thn}' /><br/><a href="{$link}" target="_blank" >Flickr Link</a></wmc:Abstract>
			<wmc:Where></wmc:Where>
		</wmc:RssLayer>
	</xsl:template>
	
</xsl:stylesheet>
