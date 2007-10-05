<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:wmc="http://www.opengis.net/context" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" >
<!--
Description: Output the context title and abstract
Author:      Mike Adair mike.adairATnrcan.gc.ca
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
Abstract.xsl,v 1.5 2004/06/25 17:59:38 madair1 Exp

-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="widgetNode"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="abstract"/>
  <xsl:param name="moreInfo"/>

  <xsl:variable name="numLayers" select="count(//wmc:Layer | //wmc:FeatureType)"/>

  <xsl:template match="/">
    <div>
      <xsl:value-of select="$numLayers"/>
      <input id="maxFeatures" type="checkbox" DDDonchange="config.objects.catalogSearchResults.setParam(this.id, this.checked);" checked="checked" title="Limit maximum amount of features"/>
      <label for="maxFeatures">maxFeatures</label>
    </div>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>

