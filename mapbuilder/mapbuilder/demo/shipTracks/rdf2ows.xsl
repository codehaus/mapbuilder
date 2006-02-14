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
xmlns:ogc="http://www.opengis.net/ogc" >
	<!-- xsl:output method="html" omit-xml-declaration="no" encoding="utf-8" indent="yes"/ -->
	<xsl:output method="xml" omit-xml-declaration="yes" encoding="utf-8" indent="yes"/>
  
	<xsl:template match="/rdf:RDF ">
		<ResourceList xmlns="http://www.opengis.net/context" >
			<xsl:apply-templates select="rss:item"/>
		</ResourceList>
	</xsl:template>
	
	<xsl:template match="rss:item">
    <xsl:variable name="fid"><xsl:value-of select="@id"/></xsl:variable>
    <xsl:variable name="width"><xsl:value-of select="@width"/></xsl:variable>
    <xsl:variable name="height"><xsl:value-of select="@height"/></xsl:variable>
    
		<wmc:RssLayer  queryable="0" hidden="0" id="{$fid}" width="{$width}" height="{$height}">
			<wmc:Server service="GeoRSS" version="1.0" title="title">
				<wmc:OnlineResource xlink:type="simple" xlink:href="link"/>
			</wmc:Server>
			<wmc:Title>
				<xsl:value-of select="rss:title"/>
			</wmc:Title>
			<wmc:StyleList>
        <wmc:Style>
          <wmc:Name>Highlite</wmc:Name>
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
            <!--  sld:Fill> 
              <sld:CssParameter name="fill">#ffff00</sld:CssParameter> 
            </sld:Fill --> 
            <sld:Stroke> 
              <sld:CssParameter name="stroke">#ffff00</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke>          
          </sld:PolygonSymbolizer>
        </wmc:Style>
        <wmc:Style>
          <wmc:Name>Normal</wmc:Name>
          <sld:PointSymbolizer>
            <sld:Graphic>
              <sld:ExternalGraphic>
                <sld:OnlineResource xlink:type="simple" xlink:href="http://192.168.15.102:8080/mapbuilder/demo/shipTracks/images/frog.gif" />
                <sld:Format>image/gif</sld:Format>
              </sld:ExternalGraphic> 
              <sld:Size>16</sld:Size>
              <!-- 
              <sld:Mark> 
                <sld:WellKnownName>circle</sld:WellKnownName> 
                <sld:Stroke> 
                  <sld:CssParameter name="stroke">#ff0000</sld:CssParameter> 
                  <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
                </sld:Stroke> 
                <sld:Fill> 
                  <sld:CssParameter name="fill">#ff0000</sld:CssParameter> 
                </sld:Fill> 
              </sld:Mark>
              <sld:Size>3</sld:Size> 
              --> 
            </sld:Graphic> 
          </sld:PointSymbolizer>
          <sld:LineSymbolizer>
           <sld:Stroke> 
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke> 
          </sld:LineSymbolizer>
          <sld:PolygonSymbolizer>
            <!-- sld:Fill> 
              <sld:CssParameter name="fill">#ff0000</sld:CssParameter> 
            </sld:Fill --> 
            <sld:Stroke> 
              <sld:CssParameter name="stroke">#ff0000</sld:CssParameter> 
              <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
            </sld:Stroke>          
          </sld:PolygonSymbolizer>
        </wmc:Style>
      </wmc:StyleList>
			<wmc:Abstract><xsl:copy-of select="rss:description"/><br/>
  	<b>date:</b><xsl:value-of select="dc:date"/><br/>
    <b>link:</b><xsl:element name="a">
     <xsl:attribute name="href"><xsl:value-of select="rss:link"/></xsl:attribute>click here for more information!
    </xsl:element><br/>
			</wmc:Abstract>
			<wmc:Where>
			<xsl:copy-of select="georss:where/*"/>
			</wmc:Where>
		</wmc:RssLayer>
	</xsl:template>
	
</xsl:stylesheet>
