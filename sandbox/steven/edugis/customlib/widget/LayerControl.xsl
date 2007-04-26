<?xml version="1.0"?>
<xsl:stylesheet xmlns:wmc="http://www.opengis.net/context" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="xml" encoding="utf-8"/>
<xsl:param name="lang">en</xsl:param>
<xsl:param name="modelId"/>
<xsl:param name="widgetId"/>
<xsl:param name="skinDir"/>
<xsl:param name="moveUpImage"/>
<xsl:param name="moveDownImage"/>
<xsl:param name="deleteImage"/>
<xsl:param name="title"/>
<xsl:param name="toggleVisTip">Klik om de laag te verbergen/zichtbaar te maken</xsl:param>
<xsl:param name="moveLayerUpTip"/>
<xsl:param name="moveLayerDownTip"/>
<xsl:param name="deleteLayerTip"/>
<xsl:param name="featureName"/>
<xsl:param name="hidden"/>
<xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/>
</xsl:param>
<xsl:template match="/wmc:OWSContext">
<div id="layerControl">
<div id="layerOverview">
<xsl:apply-templates select="wmc:ResourceList/wmc:Layer">
<xsl:sort select="position()" order="descending" data-type="number"/>
</xsl:apply-templates>
</div>
</div>
</xsl:template>
<xsl:template match="wmc:Layer">
<xsl:variable name="layerName" select="wmc:Name"/>
<xsl:variable name="nodeIndex" select="position()-1"/>
<xsl:variable name="moveLayerUpTip">Kaartlaag omhoog verplaatsen</xsl:variable>
<xsl:variable name="moveLayerDownTip">Kaartlaag omlaag verplaatsen</xsl:variable>
<xsl:variable name="deleteLayerTip">Kaartlaag verwijderen</xsl:variable>
<xsl:variable name="queryTip">
<xsl:choose>
<xsl:when test="@queryable='1'">Deze laag is bevraagbaar</xsl:when>
<xsl:otherwise>Deze laag is niet bevraagbaar</xsl:otherwise>
</xsl:choose>
</xsl:variable>
<xsl:variable name="color">
<xsl:choose>
<xsl:when test="@queryable='1'">#f90</xsl:when>
<xsl:otherwise>#069</xsl:otherwise>
</xsl:choose>
</xsl:variable>
<div class="singleLayer">
<div class="layerTop">
<div class="layerTitle" title="{$queryTip}" style="color:{$color}">
<xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL">
<b style="cursor:pointer" id="{$layerName}uit" onClick="toggleBox('leg_{$layerName}',0);toggleBox('{$layerName}uit',0);toggleBox('{$layerName}aan',1);">-</b>
<b id="{$layerName}aan" style="display:none;cursor:pointer" onClick="toggleBox('leg_{$layerName}',1);toggleBox('{$layerName}aan',0);toggleBox('{$layerName}uit',1);">+</b>
</xsl:if>
<xsl:choose>
<xsl:when test="wmc:Title/@xml:lang">
<xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
</xsl:when>
<xsl:otherwise>
<xsl:value-of select="wmc:Title"/>
</xsl:otherwise>
</xsl:choose>
</div>
<div class="buttons">
<a href="javascript:{$context}.setParam('moveLayerUp','{$layerName}')" class="mbButton">
<img title="{$moveLayerUpTip}" src="{$skinDir}{$moveUpImage}"/>
</a>
<a href="javascript:{$context}.setParam('moveLayerDown','{$layerName}')" class="mbButton">
<img title="{$moveLayerDownTip}" src="{$skinDir}{$moveDownImage}"/>
</a>
<a href="javascript:{$context}.setParam('deleteLayer','{$layerName}')" class="mbButton">
<img title="{$deleteLayerTip}" src="{$skinDir}{$deleteImage}"/>
</a>
<input type="checkbox" id="vis_{$layerName}" title="{$toggleVisTip}" onclick="{$context}.setHidden('{$layerName}',!document.getElementById('vis_{$layerName}').checked)">
<xsl:if test="@hidden='0'">
<xsl:attribute name="checked"/>
</xsl:if>
</input>
</div>
<div id="sld">
<form>
<input type="button" value="Negeer" onClick="{$context}.setParam('clearSld','{$layerName}')"/><input type="button" value="Genereer" onClick="{$context}.setParam('generateSld','{$layerName}')"/>
</form>
</div>
<div id="transptitle">ondoorzichtigheid:</div>
<div id="transpbox">
<form title="Zet de transparantie van de laag">
<select name="transparency" onchange="{$context}.setTransparancy('{$layerName}',value)">
<xsl:if test="@transparancy">
<option value="{@transparancy}">
<xsl:value-of select="@transparancy"/>%</option>
</xsl:if>
<option value="100">100%</option>
<option value="90">90%</option>
<option value="80">80%</option>
<option value="70">70%</option>
<option value="60">60%</option>
<option value="50">50%</option>
<option value="40">40%</option>
<option value="30">30%</option>
<option value="20">20%</option>
<option value="10">10%</option>
<option value="0">0%</option>
</select>
</form>
</div>
</div>
<xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL">
<div class="layerImg">
<div id="leg_{$layerName}" style="">
<xsl:element name="IMG">
<xsl:attribute name="SRC">
<xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/>
</xsl:attribute>
</xsl:element>
</div>
</div>
</xsl:if>
</div>
</xsl:template>
<xsl:template match="text()|@*"/>
</xsl:stylesheet>
