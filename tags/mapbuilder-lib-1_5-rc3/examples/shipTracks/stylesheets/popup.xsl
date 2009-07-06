<?xml version="1.0" encoding="UTF-8"?>

<!--
Description: presents the list of events in a GeoRSS
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id$
$Name:  $
-->

<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
  xmlns:rss="http://purl.org/rss/1.0/" 
  xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" 
  xmlns:georss="http://www.georss.org/georss" 
  xmlns:gml='http://www.opengis.net/gml/3.1.1' >
  
  <!-- xsl:output method="html" omit-xml-declaration="yes" encoding="utf-8" indent="yes"/ -->
  <xsl:output method="xml" indent="yes" omit-xml-declaration="yes"/>
  <xsl:param name="fid"/>
  
  <xsl:template match="rdf:RDF">
    <div class="PopupContainer">
      <div class="PopupHeader">Info</div>
      <div class="PopupContent">
        <xsl:apply-templates/>
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="rss:item">
    <xsl:if test="@id=$fid">
      <table cellspacing="0" border="0">
    	<tr><td><b>title:</b><xsl:value-of select="rss:title"/></td></tr>
    	<tr><td><b>description:</b><xsl:copy-of select="rss:description"/></td></tr>
    	<tr><td><b>date:</b><xsl:value-of select="dc:date"/></td></tr>
      <tr><td><b>pos:</b><xsl:value-of select="georss:where/gml:Point/gml:pos"/></td></tr>
      <tr><td><b>link:</b><xsl:element name="a">
       <xsl:attribute name="target">_blank</xsl:attribute>
       <xsl:attribute name="href"><xsl:value-of select="rss:link"/></xsl:attribute>click here for more information!
      </xsl:element></td></tr>
      </table>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
