<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
xmlns:rss="http://purl.org/rss/1.0/" 
xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" 
xmlns:dc="http://purl.org/dc/elements/1.1/" 
xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" 
xmlns:georss="http://www.georss.org/georss"  
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:gml="http://www.opengis.net/gml/3.1.1" 
xmlns:wmc="http://www.opengis.net/context" 
xmlns:sld="http://www.opengis.net/sld" 
xmlns:ogc="http://www.opengis.net/ogc" >
	<!-- xsl:output method="html" omit-xml-declaration="no" encoding="utf-8" indent="yes"/ -->
	<xsl:output omit-xml-declaration="yes" encoding="iso-8859-1" indent="yes"/>
  
	<xsl:template match="/rdf:RDF ">
    
		  <wmc:ResourceList>
			  <xsl:apply-templates select="rss:item"/>
		  </wmc:ResourceList>
    
	</xsl:template>
	
	<xsl:template match="rss:item">
    <xsl:variable name="fid"><xsl:value-of select="@uuid"/></xsl:variable>
    <xsl:variable name="width"><xsl:value-of select="@width"/></xsl:variable>
    <xsl:variable name="height"><xsl:value-of select="@height"/></xsl:variable>
    
		<RssLayer  xmlns='http://www.opengis.net/context' queryable="0" hidden="0" id="{$fid}" width="{$width}" height="{$height}">
			<Server service="GeoRSS" version="1.0" title="title">
				<OnlineResource xlink:type="simple" xlink:href="link"/>
			</Server>
      <Name><xsl:value-of select="@uuid"/></Name>
      <Title>
        <xsl:value-of select="rss:title"/>
      </Title>
			<StyleList>
        <Style>
          <Name>Highlite</Name>
          <sld:PointSymbolizer>
           <sld:Stroke> 
              <sld:CssParameter name="stroke">#ffff00</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke> 
          </sld:PointSymbolizer>
          <sld:LineSymbolizer>
           <sld:Stroke> 
              <sld:CssParameter name="stroke">#ffff00</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke> 
          </sld:LineSymbolizer>
          <sld:PolygonSymbolizer>
            <sld:Stroke> 
              <sld:CssParameter name="stroke">#ffff00</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke>          
          </sld:PolygonSymbolizer>
        </Style>
        <Style>
          <Name>Normal</Name>
          <sld:PointSymbolizer>
            <sld:Graphic>
              <sld:ExternalGraphic>
                <sld:OnlineResource xlink:type="simple" xlink:href="http://geoservices.cgdi.ca/mapbuilder/lib/skin/default/images/Icon.gif" />
                <sld:Format>image/gif</sld:Format>
              </sld:ExternalGraphic> 
              <sld:Size>16</sld:Size>
            </sld:Graphic> 
          </sld:PointSymbolizer>
          <sld:LineSymbolizer>
           <sld:Stroke> 
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke> 
          </sld:LineSymbolizer>
          <sld:PolygonSymbolizer>
            <sld:Stroke> 
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke>          
          </sld:PolygonSymbolizer>
        </Style>
      </StyleList>
			<Abstract><xsl:copy-of select="rss:description"/><br/>
  	<b>date:</b><xsl:value-of select="dc:date"/><br/>
    <b>link:</b><xsl:element name="a">
     <xsl:attribute name="href"><xsl:value-of select="rss:link"/></xsl:attribute>click here for more information!
    </xsl:element><br/>
			</Abstract>
			<Where>
			<xsl:copy-of select="georss:where/*"/>
			</Where>
		</RssLayer>
	</xsl:template>
	
</xsl:stylesheet>
