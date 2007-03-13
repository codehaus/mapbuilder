<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: presents the list of Layers from a WMS capabilities doc.
            Links provided to preview and add a layer to a Context doc.
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: SelectMapLayers.xsl,v 1.11 2005/08/03 19:07:01 mattdiez Exp $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:wms="http://www.opengis.net/wms"
		xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  
  <!-- template rule matching source root element -->

  <xsl:template match="/WMT_MS_Capabilities | /wms:WMS_Capabilities">
    
      <div class="responses">
      <xsl:apply-templates/>
    </div>
  </xsl:template>
	
	<!--Hele speciefiek code om nota ruimte er uit te filteren. Iets globaler zou zijn de check op economie weg te halen, dan levert deze check de grouped layers op -->
 <!--xsl:template match="Layer[(Layer) and Name='economie']">
  <xsl:variable name="name"><xsl:value-of select="Name"/></xsl:variable>
    <xsl:variable name="title"><xsl:value-of select="Title"/></xsl:variable>
 <div class="title">
    <img src="../customlib/skin/default/images/Layers.png"/><b style="cursor:pointer" title="klik om {$title} toe te voegen" onClick="javascript:config.objects.editContext.addNodeToModel('{$name}')"><xsl:value-of select="Title"/></b>
      </div>
       <xsl:apply-templates/>
 </xsl:template-->

  <!-- template rule matching displayable layers -->

  <xsl:template match="Layer[Name and not (starts-with(Name,'_'))]">
    <xsl:variable name="name"><xsl:value-of select="Name"/></xsl:variable>
    <xsl:variable name="title"><xsl:value-of select="Title"/></xsl:variable>
        
        	<div class="title">
        <img src="../customlib/skin/default/images/Layers.png"/><b style="cursor:pointer" title="klik om {$title} toe te voegen" onClick="javascript:config.objects.editContext.addNodeToModel('{$name}')"><xsl:value-of select="Title"/></b>
      </div><!--/layerTitle-->
     
		
    <xsl:apply-templates/>
  </xsl:template>

  <!-- template rule matching displayable layers for v1.3.x servers-->
  <xsl:template match="wms:Layer[wms:Name and wms:Dimension/@name='time']">
    <xsl:variable name="name"><xsl:value-of select="Name"/></xsl:variable>
    <xsl:variable name="title"><xsl:value-of select="Title"/></xsl:variable>
        
        	<div class="title">
        <img src="../customlib/skin/default/images/Layers.png"/><b style="cursor:pointer" title="klik om {$title} toe te voegen" onClick="javascript:config.objects.editContext.addNodeToModel('{$name}')"><xsl:value-of select="Title"/></b>
      </div><!--/layerTitle-->
     
		
     
		
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
