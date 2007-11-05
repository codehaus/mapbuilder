<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
xmlns:gml="http://www.opengis.net/gml" 
xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss"  xmlns:cw="http://www.cubewerx.com/cw"
version="1.0">

<!--
Description: Convert a GML Feature or FeatureCollection into a HTML form.
Author:      Cameron Shorter cameron ATshorter.net
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureList.xsl 3256 2007-09-14 00:39:54Z mvivian $
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <!--xsl:param name="targetModelId"/-->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="fid"/>
  <xsl:param name="title"/>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
      <xsl:if test="//atom:entry/atom:id = $fid">
        <h3><xsl:value-of select="$title"/></h3>
        <!-- <input type="button" value="Save" onclick="config.objects.insertFeature.doSelect(config.objects.insertFeature,true);" /> -->
        <table border="1" cellpadding="0" cellspacing="0">
        <xsl:apply-templates select="//atom:entry[atom:id = $fid]"/>
        </table>
      </xsl:if>
    </div>
  </xsl:template>

  <!-- don't print boundedBy -->
  <xsl:template match="gml:boundedBy"/>

  <!-- featureMember -->
  <xsl:template match="gml:featureMember">
    <div>
      <table border="1" cellpadding="0" cellspacing="0">
        <xsl:apply-templates/>
      </table>
      <br/>
    </div>
  </xsl:template>

  <!-- All nodes -->
  <xsl:template match="*">
    <xsl:variable name="xlink">
      <xsl:call-template name="getXpath">
        <xsl:with-param name="node" select="."/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:if test="not(./*)">
	  <xsl:choose>
<!-- 
    	<xsl:when test="name(.)='category'">
          <tr>
            <td>
              <xsl:value-of select="@scheme"/>
            </td>
            <td>
              <xsl:value-of select="@term"/>
            </td>
          </tr>
    	</xsl:when>
-->
    	<xsl:when test="name(.)='category'">
          <tr>
            <td>
              <xsl:value-of select="@scheme"/>
            </td>
            <td>
				<xsl:value-of select="@term"/>
            </td>
          </tr>
        
        </xsl:when>
        <xsl:otherwise>
          <tr>
            <td>
              <xsl:value-of select="name(.)"/>
            </td>
            <td>
              <xsl:value-of select="text()"/>
            </td>
          </tr>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
    <xsl:if test="./*">
      <xsl:apply-templates>
      </xsl:apply-templates>
    </xsl:if>
  </xsl:template>

  <!-- Return xpath reference to a node. Calls itself recursively -->
  <xsl:template name="getXpath">
    <xsl:param name="node"/>
    <xsl:if test="name($node/..)">
      <xsl:call-template name="getXpath">
        <xsl:with-param name="node" select="$node/.."/>
      </xsl:call-template>
    </xsl:if>
    <xsl:text>/</xsl:text>
    <xsl:value-of select="name($node)"/>
  </xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
