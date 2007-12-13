<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" xmlns:pmb="http://nsuri.notld/poweredByMapbuilder" version="1.0">

<!--
$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <!--xsl:param name="targetModelId"/-->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="this">config.objects.<xsl:value-of select="$widgetId"/></xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
      <h3><xsl:value-of select="*/gml:name"/></h3>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template name="featureMember" match="gml:featureMember">
    <xsl:param name="fid" select="*/@fid"/>
    <div id="{$widgetId}_{$fid}" class="listitem" onmouseover="{$this}.highlight(this, '{$fid}')" onmouseout="{$this}.dehighlight(this, '{$fid}')">
      <xsl:value-of select="*/pmb:date"/><br/>
      <b><xsl:value-of select="*/pmb:name"/></b>
    </div>
  </xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
