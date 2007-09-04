<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:wmc="http://www.opengis.net/context"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:gml='http://www.opengis.net/gml'
  xmlns:wfs='http://www.opengis.net/wfs'
  xmlns:xlink='http://www.w3.org/1999/xlink' version="1.0">

  <!--
    Description: Select layer from an OWS Context so that it can be inserted into
             another Context.
Author:      Cameron Shorter
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html 
    
    $Id: $
  -->
  <xsl:output method="xml" encoding="utf-8" />

  <!-- The common params set for all widgets -->
  <xsl:param name="lang" />
  <xsl:param name="modelId" />
  <xsl:param name="widgetId" />

  <!-- The name of the javascript context object to call -->

  <!-- Main html: Match OWS Context -->
  <xsl:template match="/wmc:OWSContext">
    <div class="layerControl">
      <xsl:if test="wmc:General/wmc:Extension">
        <xsl:apply-templates
          select="wmc:General/wmc:Extension/wmc:GroupList/wmc:Group">
          <xsl:sort select="position()" order="ascending"
            data-type="number" />
        </xsl:apply-templates>
      </xsl:if>
      <xsl:if test="not(wmc:General/wmc:Extension)">
        <xsl:apply-templates
          select="wmc:ResourceList/wmc:Layer | wmc:ResourceList/wmc:FeatureType">
          <xsl:sort select="position()" order="descending"
            data-type="number" />
        </xsl:apply-templates>
      </xsl:if>
    </div>
  </xsl:template>
  
  <xsl:template match="wmc:Layer|wmc:FeatureType">
    <xsl:variable name="layerName" select="wmc:Name" />
    <xsl:variable name="LayerTitle" select="wmc:Title" />
    <xsl:variable name="layerTitle">
      <xsl:choose>
        <xsl:when test="wmc:Title/@xml:lang">
          <xsl:value-of select="wmc:Title[@xml:lang=$lang]" />
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="wmc:Title" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="rowClass">
      altRow_<xsl:value-of select="position() mod 2" />
    </xsl:variable>
    <xsl:variable name="name_layer">
      <xsl:choose>
        <xsl:when test="wmc:Title/@xml:lang">
          <xsl:value-of select="wmc:Title[@xml:lang=$lang]" />
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="wmc:Title" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <div id="{$layerName}_Row" class="{$rowClass}">
      <!-- div necessary with IE 6 because if not, float makes bugs when display or fold legend -->
      <div style="position:relative;">
        <div id="{$layerName}_Header " class="LayerHeader">

          <!-- name of layer -->
          <div class="nameLayerHeader"
            onclick="config.objects.{$widgetId}.showLayerMetadata('{$layerName}')">
            <xsl:choose>
              <xsl:when test="wmc:Title/@xml:lang">
                <xsl:value-of
                  select="wmc:Title[@xml:lang=$lang]" />
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="wmc:Title" />
              </xsl:otherwise>
            </xsl:choose>
          </div>

          <div class="inputLayerHeader">
            <!-- add layer -->
            <a
              href="javascript:config.objects.{$widgetId}.addLayer('{$layerName}')"
              class="mbButton">add to map
            </a>
          </div><!-- end inputLayerHeader -->
        </div><!--end of {$layerName}_Header -->
      </div>
      <!--end of hack ie 5.5 -->
    </div><!--end of "{$layerName}" -->
  </xsl:template>

  <xsl:template match="text()|@*" />
</xsl:stylesheet>
