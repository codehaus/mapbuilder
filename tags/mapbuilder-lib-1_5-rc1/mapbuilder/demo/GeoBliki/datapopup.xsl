<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:eo1="http://eo1.gsfc.nasa.gov/">
	
  <xsl:output method="xml" encoding="utf-8"/>
    
<xsl:template match="/eo1:ali">
  <table>
    <thead>
      <tr><td></td><td><b>EO1 ALI data</b><hr/></td></tr>
    </thead>
	<xsl:call-template name="data" />
  </table>
 
</xsl:template>

    
<xsl:template match="/eo1:hyperion">
  <table>
    <thead>
      <tr><td></td><td><b>EO1Hyperion data</b><hr/></td></tr>
    </thead>
    	<xsl:call-template name="data" />
	</table>
</xsl:template>

<xsl:template name="data">
  <tbody>
    <tr>
      <td><xsl:element name="img"><xsl:attribute name="height">200</xsl:attribute><xsl:attribute name="src"><xsl:value-of select="eo1:lowres_href"/></xsl:attribute></xsl:element></td>
      <td>
	        <b>Id:</b><xsl:value-of select="eo1:id"/><br/>
	        <b>Name:</b><xsl:value-of select="eo1:name"/><br/>
	        <b>Scene:</b><xsl:value-of select="eo1:scene"/><br/>
	        <b>Rights:</b><xsl:value-of select="eo1:rights"/><br/>
	        <b>Goal Id:</b><xsl:value-of select="eo1:goal_id"/><br/>
  	      <b>Lat:</b><xsl:value-of select="eo1:latitude"/><br/>
	        <b>Lon:</b><xsl:value-of select="eo1:longitude"/><br/>
	        <b>Link:</b><xsl:element name="a"><xsl:attribute name="href"><xsl:value-of select="eo1:article_href"/>
	        	</xsl:attribute>here</xsl:element><br/>
	    </td>
	  </tr>
	</tbody>
</xsl:template>

</xsl:stylesheet>