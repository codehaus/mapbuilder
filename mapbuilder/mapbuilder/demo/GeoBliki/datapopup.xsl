<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs" xmlns:eo1="http://eo1.gsfc.nasa.gov/" version="1.0">

  <!--
    Description: Convert a GeoBliki WFS response into a OL popup text.
    Author:      Andreas Hocevar
    $Id$
  -->

  <xsl:output method="xml" encoding="utf-8" />

  <!-- Common params for all widgets -->
  <xsl:param name="modelId" />
  <xsl:param name="widgetId" />

  <!-- params for this widget -->
  <xsl:param name="fid" />

  <!-- Main html - It matches only non-empty results -->
  <xsl:template match="/">
    <div class="PopupContainer">
      <div class="PopupHeader">Info</div>
      <div class="PopupContent">
        <xsl:apply-templates />
      </div>
    </div>
  </xsl:template>

  <!-- featureInfo -->
  <xsl:template match="wfs:FeatureCollection/gml:featureMember/eo1:ali|wfs:FeatureCollection/gml:featureMember/eo1:hyperion">
    <xsl:if test="@fid=$fid">
      <table cellspacing="0" border="0">
        <tr>
          <td>
            <xsl:element name="img">
              <xsl:attribute name="height">200</xsl:attribute>
              <xsl:attribute name="src">
                <xsl:value-of select="eo1:lowres_href" />
              </xsl:attribute>
            </xsl:element>
          </td>
          <td>
            <b>Id:</b>
            <xsl:value-of select="eo1:id" />
            <br />
            <b>Name:</b>
            <xsl:value-of select="eo1:name" />
            <br />
            <b>Scene:</b>
            <xsl:value-of select="eo1:scene" />
            <br />
            <b>Rights:</b>
            <xsl:value-of select="eo1:rights" />
            <br />
            <b>Goal Id:</b>
            <xsl:value-of select="eo1:goal_id" />
            <br />
            <b>Lat:</b>
            <xsl:value-of select="eo1:latitude" />
            <br />
            <b>Lon:</b>
            <xsl:value-of select="eo1:longitude" />
            <br />
            <b>Link:</b>
            <xsl:element name="a">
              <xsl:attribute name="href">
                <xsl:value-of select="eo1:article_href" />
              </xsl:attribute>
              here
            </xsl:element>
            <br />
          </td>
        </tr>
      </table>
    </xsl:if>
  </xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()"></xsl:template>
</xsl:stylesheet>
