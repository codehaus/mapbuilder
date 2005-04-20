<?xml version="1.0" encoding="ISO-8859-1"?><!--Description: parses an OGC context document to generate an array of DHTML layers.Author:      adairLicence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .$Id: GetFeatureRequest.xsl,v 1.6 2004/10/15 13:42:09 madair1 Exp $$Name:  $--><xsl:stylesheet version="1.0"     xmlns:wps="http://www.opengis.net/wps"    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 		xmlns:ogc="http://www.opengis.net/ogc"    xmlns:ows="http://www.opengis.net/ows"		xmlns:gml="http://www.opengis.net/gml"    xmlns:xlink="http://www.w3.org/1999/xlink">  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>  <!-- The coordinates of the DHTML Layer on the HTML page -->  <xsl:param name="modelId"/>  <xsl:param name="modelUrl"/>  <xsl:param name="widgetId"/>  <xsl:param name="toolId"/>    <!-- template rule matching source root element -->  <xsl:template match="/wps:ExecuteResponse">    <xsl:variable name="statusURL"><xsl:value-of select="@wps:statusLocation"/></xsl:variable>    <div>    <p style="text-align:right;font:70%;margin:0"><a href="{$modelUrl}" target="modelXML">ExecuteProcess response</a></p>    Process results for <xsl:value-of select="wps:ProcessName"/>:     <xsl:apply-templates select="wps:Status"/>        <table cellspacing="0" border="1">      <tr>        <th colspan="2" align="left">Outputs</th>      </tr>      <tr>        <td>parameter</td>        <td>value</td>      </tr>      <xsl:apply-templates select="wps:Output"/>    </table>    <table cellspacing="0" border="1">      <tr>        <th colspan="2" align="left">Inputs</th>      </tr>      <tr>        <td>parameter</td>        <td>value</td>      </tr>      <xsl:apply-templates select="wps:Input"/>    </table>    </div>  </xsl:template>    <xsl:template match="wps:Status[wps:ProcessSucceeded]">    Succeeded.<br/>  </xsl:template>  <xsl:template match="wps:Status[wps:ProcessFailed]">    Failed.<br/>    Exception message:<xsl:value-of select="wps:ExceptionReport/ows:ExceptionText"/>  </xsl:template>  <xsl:template match="wps:Status[wps:ProcessAccepted]">    Accepted.<br/>    <a href="#">Check the status here</a>   </xsl:template>  <xsl:template match="wps:Status[wps:ProcessStarted]">    Started.<br/>    <a href="#">Check the status here</a>   </xsl:template>  <xsl:template match="wps:Input/wps:ParameterValue | wps:Output/wps:ParameterValue">    <xsl:variable name="paramName"><xsl:value-of select="wps:Name"/></xsl:variable>    <tr>      <td>        <dl class="params">          <dt><xsl:value-of select="wps:Label"/></dt>          <dd><xsl:value-of select="wps:Description"/></dd>        </dl>      </td>      <td>        <xsl:apply-templates select="wps:LiteralValue | wps:BoundingBox | wps:ComplexValue | wps:Reference">          <xsl:with-param name="paramName" select="$paramName"/>        </xsl:apply-templates>      </td>    </tr>  </xsl:template>  <xsl:template match="wps:LiteralValue">    <xsl:param name="paramName"/>    <span>type: <xsl:value-of select="@ows:type"/></span>    <br/>    <xsl:value-of select="$paramName"/>=<xsl:value-of select="."/>  </xsl:template>    <xsl:template match="wps:Reference">    <xsl:param name="paramName"/>    <xsl:value-of select="$paramName"/>=<xsl:value-of select="@xlink:href"/>    <br/>    <span>format: <xsl:value-of select="ows:Format"/></span>  </xsl:template>    <xsl:template match="wps:BoundingBox">    <xsl:param name="paramName"/>    <xsl:value-of select="$paramName"/> set to:<br/>    lower corner: <xsl:value-of select="ows:LowerCorner"/><br/>    upper corner: <xsl:value-of select="ows:UpperCorner"/><br/>    CRS: <xsl:value-of select="@crs"/>  </xsl:template>  <xsl:template match="wps:ComplexValue">    <xsl:param name="paramName"/>    No XSL template yet.  </xsl:template>    <xsl:template match="text()|@*"/></xsl:stylesheet>