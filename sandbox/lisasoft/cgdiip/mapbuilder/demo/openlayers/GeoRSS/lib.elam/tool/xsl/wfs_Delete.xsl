<?xml version="1.0" encoding="ISO-8859-1"?>



<!--

Description: Extract FeatureMembers from a FeatureCollection and build

  into a WFS Insert transaction.

Author:      Cameron Shorter

Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .



$Id: wfs_Delete.xsl 2546 2007-01-23 12:07:39Z gjvoosten $

-->



<xsl:stylesheet version="1.0" 

    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

    xmlns:wfs="http://www.opengis.net/wfs"

    xmlns:ogc="http://www.opengis.net/ogc"

    xmlns:gml="http://www.opengis.net/gml">



  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>



  <!-- Match root -->

  <xsl:template match="/">

    <wfs:Transaction service="WFS" version="1.0.0">

      <xsl:apply-templates/>

    </wfs:Transaction>

  </xsl:template>



  <!-- Match featureMember -->

  <xsl:template match="gml:featureMember/*[@fid]">

    <wfs:Delete typeName="{name()}">

      <ogc:Filter>

        <ogc:FeatureId fid="{./@fid}"/>

      </ogc:Filter>

    </wfs:Delete>

  </xsl:template>



  <xsl:template match="text()|@*"/>

</xsl:stylesheet>

