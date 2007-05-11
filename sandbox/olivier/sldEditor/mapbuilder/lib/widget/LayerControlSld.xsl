<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:gml='http://www.opengis.net/gml' 
    xmlns:wfs='http://www.opengis.net/wfs'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    version="1.0">
<!--
Description: provides a list of layers and controls for them (sldEditor/legend/delete/visibility/move up/move down/show metadata
Author:      Olivier Terral
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
$Name:  $
-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">fr</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="skinDir"/>
	<xsl:param name="sldEditorImage">/images/sld.jpeg</xsl:param>
  <xsl:param name="legendDisableImage">/images/LegendDisable.png</xsl:param>
  <xsl:param name="moveUpImage"/>
  <xsl:param name="moveDownImage"/>
  <xsl:param name="deleteImage"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  <xsl:param name="toggleVisTip"/>
  <xsl:param name="legendDisableTip"/>
  <xsl:param name="moveLayerUpTip"/>
  <xsl:param name="moveLayerDownTip"/>
  <xsl:param name="deleteLayerTip"/>
  
<!-- The name of the javascript context object to call -->
  <xsl:param name="featureName"/>
  <xsl:param name="hidden"/>
  <xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/></xsl:param>
  
<!-- Main html -->
  <xsl:template match="/wmc:ViewContext">
    <div id="ya">
      <table id="layers" class="layerControl" cellspacing="0" width="300px" >
        <!--tr>
          <td colspan="5">Layer Control | Layer metadata | Map metadata</td>
        </tr-->
        <xsl:apply-templates select="wmc:LayerList/wmc:Layer">
          <xsl:sort select="position()" order="descending" data-type="number"/>
        </xsl:apply-templates>
	
      </table>
    </div>
  </xsl:template>
  
<!-- Layer -->
  <xsl:template match="wmc:Layer">
    <xsl:variable name="layerName" select="wmc:Name"/>
    <xsl:variable name="rowClass">altRow_<xsl:value-of select="position() mod 2"/></xsl:variable>
    
    <tr class="{$rowClass}" ><xsl:variable name= "nb"><xsl:number value="position()" format="1" /></xsl:variable>
<!-- Visiblity --> 
      <td  cellspacing="0" align="left" onmouseover="javascript:eyeOfTiger('mainMap_mainMapWidget_{$layerName}','{$nb}'); ">
        <input type="checkbox" id="vis_{$layerName}" title="{$toggleVisTip}" onclick="{$context}.setHidden('{$layerName}',!document.getElementById('vis_{$layerName}').checked)">
          <xsl:if test="@hidden='0'"><xsl:attribute name="checked"/></xsl:if>
<!--	 	<xsl:value-of select='$context'/>-->
        </input>
	</td>
	<td onmouseover="javascript:eyeOfTiger('mainMap_mainMapWidget_{$layerName}','{$nb}'); ">
 <a  href="javascript:config.objects.mySLD.setParam('SLDChange','{$layerName}');">
<!-- href="javascript:config.loadModel('mySLD','http://localhost:8080/mapbuilder/MyDataLoc/sld/polygon.sld');">-->
<!-- javascript:config.objects.mySLD.setParam('layer',{$layerName});">-->

	<img src="{$skinDir}{$sldEditorImage}" id="sldButton{$layerName}" style="width:23px;height:23px" />
	</a>   
      </td>
	<td>
	<a href="javascript:show('{$layerName}');" >
<!--<a  href="javascript:config.objects.mainMap.paint('contextLegend',refresh);">-->
	<img src="{$skinDir}{$legendDisableImage}" id="lButton{$layerName}" /><!--popUp('legend.html?{$layerName}=')"/-->
	</a>
	<!--/td-->
      <!--td-->
       <a  id ="a" href="javascript:{$context}.setParam('moveLayerUp','{$layerName}')" class="mbButton">
        <img title="{$moveLayerUpTip}" src="{$skinDir}{$moveUpImage}" />
       </a>
      <!--/td-->
      <!--td-->
       <a href="javascript:{$context}.setParam('moveLayerDown','{$layerName}')" class="mbButton">
        <img title="{$moveLayerDownTip}" src="{$skinDir}{$moveDownImage}" />
       </a>
      <!--/td-->
    <!--td-->
       <a href="javascript:{$context}.setParam('deleteLayer','{$layerName}')" class="mbButton">
<img title="{$deleteLayerTip}" src="{$skinDir}{$deleteImage}"/></a>
      
       
      </td>
      <td onclick="config.objects.{$widgetId}.showLayerMetadata('{$layerName}')" onmouseover="javascript:eyeOfTiger('mainMap_mainMapWidget_{$layerName}','{$nb}'); "> 
        <xsl:choose>
          <xsl:when test="wmc:Title/@xml:lang">              
            <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="wmc:Title"/>
          </xsl:otherwise>
        </xsl:choose>
      </td>
      <td onmouseover="javascript:eyeOfTiger('mainMap_mainMapWidget_{$layerName}','{$nb}'); ">
      
      <a  href="javascript:eyeOfTiger('mainMap_mainMapWidget_{$layerName}','{$nb}'); " class="mbButton">
        <img src="../lib/skin/default/images/eye.gif" width="25"  >
		<xsl:attribute name="id">previewImage<xsl:number value="position()" format="1" /></xsl:attribute>
	</img>
       </a>
       <script>javascript:eyeOfTiger("mainMap_mainMapWidget_<xsl:value-of select='$layerName'/>","<xsl:number value='position()'/>");</script>
      </td>
    </tr>
    <tr>
     <td colspan="10" rowspan="1">
	

  <xsl:choose>
  <xsl:when test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource">
       

	<div >

		<xsl:attribute name="id">div<xsl:value-of select="wmc:Name"/></xsl:attribute>
		<xsl:attribute name="name">div<xsl:value-of select="wmc:Name"/></xsl:attribute>
		<xsl:attribute name="style">width:40px; height:40px; visibility:visible; </xsl:attribute>

		<img>
			<xsl:attribute name="id">legend<xsl:value-of select="wmc:Name"/></xsl:attribute>
			<xsl:attribute name="name">legend<xsl:value-of select="wmc:Name"/></xsl:attribute>
			<xsl:attribute name="src"><xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/></xsl:attribute>		</img>
        </div>
	
</xsl:when>

</xsl:choose>
     </td>
    </tr>


  </xsl:template>
  
  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
