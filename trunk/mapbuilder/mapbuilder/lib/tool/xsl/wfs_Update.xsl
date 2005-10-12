<?xml version="1.0" encoding="ISO-8859-1"?>



<!--

Description: Extract FeatureMembers from a FeatureCollection and build

  into a WFS Insert transaction.

Author:      Cameron Shorter

Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .



$Id$

-->



<xsl:stylesheet version="1.0" 

    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

    xmlns:wfs="http://www.opengis.net/wfs"

    xmlns:ogc="http://www.opengis.net/ogc"

    xmlns:gml="http://www.opengis.net/gml"

    xmlns:xlink="http://www.w3.org/1999/xlink">



  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>



  <xsl:param name="typeName"/>



  <!-- Match root -->

  <xsl:template match="/">

    <wfs:Transaction service="WFS" version="1.0.0">

      <wfs:Update typeName="{$typeName}">

        <xsl:apply-templates/>

      </wfs:Update>

    </wfs:Transaction>

  </xsl:template>



  <!-- Match featureMember -->

  <xsl:template match="gml:featureMember/*[@fid]">

    <ogc:Filter>

      <ogc:FeatureId fid="{./@fid}"/>

    </ogc:Filter>

    <xsl:for-each select="./*">

      <wfs:Property>

        <wfs:Name>

          <xsl:value-of select="name()"/>

        </wfs:Name>

        <wfs:Value>

          <xsl:if test="./*">

            <xsl:copy-of select="./*"/>

          </xsl:if>

          <xsl:if test="not(./*)">

            <xsl:value-of select="."/>

          </xsl:if>

        </wfs:Value>

      </wfs:Property>

    </xsl:for-each>

  </xsl:template>



  <xsl:template match="text()|@*"/>

</xsl:stylesheet>

