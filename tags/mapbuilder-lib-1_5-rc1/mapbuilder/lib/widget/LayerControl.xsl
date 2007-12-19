<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet 
    xmlns:wmc="http://www.opengis.net/context" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:gml='http://www.opengis.net/gml' 
    xmlns:wfs='http://www.opengis.net/wfs'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    version="1.0">
    
    

    
    
<!--
Description: provides a list of layers and controls for them (delete/visibility/move up/move down/show metadata
Author:      Mike Adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html 

$Id: LayerControl.xsl 2677 2007-04-06 08:37:01Z oterral $
$Name:  $
-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang"/>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="skinDir"/>
  <xsl:param name="moveUpImage"/>
  <xsl:param name="moveDownImage"/>
  <xsl:param name="deleteImage"/>
  <xsl:param name="legendImageEnable"/>
  <xsl:param name="legendImageDisable"/>
   <xsl:param name="opacity"/>
  
  <!-- Text params for this widget -->
  <xsl:param name="zoomImage"/>
  <xsl:param name="metadataImage"/>
  <xsl:param name="title"/>
  <xsl:param name="layerIndexTip"/>
  <xsl:param name="toggleVisTip"/>
  <xsl:param name="moveLayerUpTip"/>
  <xsl:param name="moveLayerDownTip"/>
  <xsl:param name="deleteLayerTip"/>
  <xsl:param name="legendTip"/>
  <xsl:param name="nameLayerTip"/>
  <xsl:param name="opacityTip"/>
  
  
<!-- The name of the javascript context object to call -->
  <xsl:param name="featureName"/>
  <xsl:param name="hidden"/>
  <xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/></xsl:param>
  <xsl:variable name="numLayers" select="count(//wmc:Layer | //wmc:FeatureType)"/>
  
<!-- Main html -->
  <xsl:template match="/wmc:ViewContext">
    <div>
      <div class="layerControl">
        <xsl:if test="wmc:General/wmc:Extension"> 
		      <xsl:apply-templates select="wmc:General/wmc:Extension/wmc:GroupList/wmc:Group">
				<xsl:sort select="position()" order="ascending" data-type="number"/>
			  </xsl:apply-templates>
		</xsl:if>
        <xsl:if test="not(wmc:General/wmc:Extension)"> 					 
			  <xsl:apply-templates select="wmc:LayerList/wmc:Layer">
					  <xsl:sort select="position()" order="descending" data-type="number"/>
			  </xsl:apply-templates>
		</xsl:if> 
      </div>
    </div>
  </xsl:template>
  
  <!-- Main html -->
 <xsl:template match="/wmc:OWSContext">
      <div class="layerControl">
         <xsl:if test="wmc:General/wmc:Extension"> 
            <xsl:apply-templates select="wmc:General/wmc:Extension/wmc:GroupList/wmc:Group">
          <xsl:sort select="position()" order="ascending" data-type="number"/>
          </xsl:apply-templates>
         </xsl:if>
         <xsl:if test="not(wmc:General/wmc:Extension)"> 
          <xsl:apply-templates select="wmc:ResourceList/wmc:Layer | wmc:ResourceList/wmc:FeatureType">
          <xsl:sort select="position()" order="descending" data-type="number"/>
          </xsl:apply-templates>
          </xsl:if> 	
      </div>
</xsl:template>
  
  <!---->
  

  
 <xsl:template match="wmc:General/wmc:Extension/wmc:GroupList/wmc:Group">
		<xsl:variable name="GroupName" select="./@name"/>
		<xsl:variable name="GroupFold" select="./@folded"/>
		<xsl:variable name="numberOfLayerByGroup" select="count(//wmc:Layer[wmc:Extension/wmc:Group/@name=$GroupName] | //wmc:FeatureType[wmc:Extension/wmc:Group/@name=$GroupName])"/>
		<xsl:variable name="numberOfLayerByGroupOther" >
            <xsl:value-of select="  $numLayers - $numberOfLayerByGroup "/>
        </xsl:variable>
		<xsl:if test=" ( $numberOfLayerByGroup != 0) or ( ($numberOfLayerByGroupOther != 0 ) and ( $GroupName = 'Other') ) "> 
			<div id="{$GroupName}_Header" style="cursor:pointer" class="GroupHeader" title="click to (un)fold" onmouseover="style.background='pink';" onMouseOut="style.background='#556655';"
			onclick="config.objects.{$widgetId}.switchVisibilityById('{$GroupName}');config.objects.{$widgetId}.foldUnfoldGroup('{$GroupName}','{$GroupName}_fold');">
				<!-- display "+" or "-" -->
				<input type="button" class="GroupHeaderFold" id="{$GroupName}_fold" style="width:35px;">
				<xsl:attribute name="value">
				<xsl:choose>
						<xsl:when test="@folded=1">+ </xsl:when>
						<xsl:otherwise>-</xsl:otherwise>
					</xsl:choose> 
				</xsl:attribute>
				</input>
				
				<div id="{$GroupName}_Title" class="GroupHeaderTitle">
					<xsl:value-of select="$GroupName"/>
				</div>
			</div><!-- end of div GroupHeader -->
			
			<div id="{$GroupName}" class="GroupLayers" >
			    <xsl:attribute name="style">
					<xsl:choose>
						<xsl:when test="@folded=1">display:none </xsl:when>
						<xsl:otherwise>display:block</xsl:otherwise>
					</xsl:choose> 
				</xsl:attribute>
				<xsl:if test="//wmc:ResourceList"> 
					<xsl:apply-templates select="//wmc:ResourceList/wmc:Layer[wmc:Extension/wmc:Group/@name=$GroupName] | //wmc:ResourceList/wmc:FeatureType[wmc:Extension/wmc:Group/@name=$GroupName]" >
						<xsl:sort select="position()" order="descending" data-type="number"/>
					</xsl:apply-templates>
				</xsl:if>	
				<xsl:if test="//wmc:LayerList"> 
					<xsl:apply-templates select="//wmc:LayerList/wmc:Layer[wmc:Extension/wmc:Group/@name=$GroupName]">
						<xsl:sort select="position()" order="descending" data-type="number"/>
					</xsl:apply-templates>
				</xsl:if>
                <xsl:if test="$GroupName='Other' ">
					<xsl:if test="//wmc:ResourceList"> 
					    <xsl:apply-templates select="//wmc:ResourceList/wmc:Layer[not(wmc:Extension/wmc:Group)] | //wmc:ResourceList/wmc:FeatureType[not(wmc:Extension/wmc:Group)]" >
                            <xsl:sort select="position()" order="descending" data-type="number"/>
					    </xsl:apply-templates>
                    </xsl:if>	
                    <xsl:if test="//wmc:LayerList"> 
					    <xsl:apply-templates select="//wmc:LayerList/wmc:Layer[not(wmc:Extension/wmc:Group)]">
                            <xsl:sort select="position()" order="descending" data-type="number"/>
					    </xsl:apply-templates>
				    </xsl:if>	
				</xsl:if>
			</div><!-- end of div {$GroupName} -->
		</xsl:if>	
</xsl:template>
	
	
	
	
	
<xsl:template match="wmc:Layer|wmc:FeatureType">
	<xsl:variable name="GroupName" select="wmc:Extension/wmc:Group/@name"/>
	<xsl:variable name="layerName" select="wmc:Name"/>
	<xsl:variable name="LayerTitle" select="wmc:Title"/>
	<xsl:variable name="layerTitle">
	    <xsl:choose>
		    <xsl:when test="wmc:Title/@xml:lang">
			    <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="wmc:Title"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

  <!-- Use unique layer id. Fallback to layer name if non-existent -->
	<xsl:variable name="layerId">
    <xsl:choose>
      <xsl:when test="@id">
        <xsl:value-of select="@id"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$layerName"/>
      </xsl:otherwise>
    </xsl:choose>
	</xsl:variable>

    <!-- variable -->
    <xsl:variable name="rowClass">altRow_<xsl:value-of select="position() mod 2"/></xsl:variable>
     <!-- end of variable -->
     
     
     <div id="{$widgetId}_{$layerId}_Row" class="{$rowClass}" onmouseover="config.objects.{$widgetId}.highlightLayer('{$layerId}')">
					<!-- div necessary with IE 6 because if not, float makes bugs when display or fold legend -->
				<div style="position:relative;">
					<div id="{$widgetId}_{$layerId}_Header " class="LayerHeader">
			
						  <!-- layer's index --> 
						  <div class="indexLayerHeader" title="{$layerIndexTip}">
								<xsl:value-of select="$numLayers - count(preceding::wmc:Layer) - count(preceding::wmc:FeatureType)"/>
						  </div>
						  
						  <div class="inputLayerHeader">
								<!-- checkbox -->
								  <div class="checkboxLayerHeader">
									  <input type="checkbox" id="vis_{$widgetId}_{$layerId}" title="{$toggleVisTip}" onclick="{$context}.setHidden('{$layerId}',!document.getElementById('vis_{$widgetId}_{$layerId}').checked)">
									      <xsl:if test="@hidden='0' or @hidden='false'"><xsl:attribute name="checked"/></xsl:if>
									  </input>
								  </div>
								  <!-- movelayerup--> 
								  <xsl:if test="($numLayers - count(preceding::wmc:Layer) - count(preceding::wmc:FeatureType))!=1">  
										  <div class="buttonLayerHeader">
										      <a href="javascript:{$context}.setParam('moveLayerUp','{$layerId}')" class="mbButton">
											      <img title="{$moveLayerUpTip}" src="{$skinDir}{$moveUpImage}" />
										      </a>
										  </div>
								   </xsl:if>
								   <!-- movelayerdonw -->
								   <xsl:if test="($numLayers - count(preceding::wmc:Layer) - count(preceding::wmc:FeatureType)) != $numLayers">
										  <div class="buttonLayerHeader">
										      <a href="javascript:{$context}.setParam('moveLayerDown','{$layerId}')" class="mbButton">
											      <img title="{$moveLayerDownTip}" src="{$skinDir}{$moveDownImage}" />
										      </a>
										  </div>
								    </xsl:if>
								   <!-- deletelayer -->
								  <div class="buttonLayerHeader">
								      <a href="javascript:{$context}.setParam('deleteLayer','{$layerId}')" class="mbButton">
										<img title="{$deleteLayerTip}" src="{$skinDir}{$deleteImage}" />
									   </a>
									   </div>
									 <!-- displayLegend -->   
								   <xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL"> 
									   <div class="buttonLayerHeader"  > 
											<a href="#" 
											onclick="config.objects.{$widgetId}.switchVisibilityById('{$layerId}_legend');config.objects.{$widgetId}.ChangeImage('image_{$layerId}','{$legendImageEnable}','{$legendImageDisable}');"
											 class="mbButton">
											 	
												    <img id="image_{$layerId}" title="{$legendTip}" >
														<xsl:attribute name="SRC">
															<xsl:choose>
																<xsl:when test="@hidden='1' or @hidden='true'">
																	<xsl:value-of select="$skinDir"/>
																	<xsl:value-of select="$legendImageDisable"/>
																</xsl:when>
																<xsl:otherwise>
																	<xsl:value-of select="$skinDir"/>
																	<xsl:value-of select="$legendImageEnable"/>
																</xsl:otherwise>
															</xsl:choose> 
														</xsl:attribute>
													</img>
										   </a>
									   </div> 
									 </xsl:if>
							</div> <!-- end inputLayerHeader --> 	 
						    <!-- name of layer --> 
						    <div class="nameLayerHeader" title="{$nameLayerTip}" onclick="config.objects.{$widgetId}.showLayerMetadata('{$layerId}')">
							    <xsl:choose>
							       <xsl:when test="wmc:Title/@xml:lang">              
								       <xsl:value-of select="wmc:Title[@xml:lang=$lang]"/>
							       </xsl:when>
							       <xsl:otherwise>
								       <xsl:value-of select="wmc:Title"/>
							       </xsl:otherwise>
							    </xsl:choose>
						    </div>
					        <!-- opacity -->  
					        <xsl:if test="$opacity='true'"> 
								<div id="transptitle" class="transpLayerHeader" >
										<form title="{$opacityTip}" >
											<select name="opacity" onchange="config.objects.{$modelId}.setOpacity('{$layerId}',value)">
													<xsl:if test="@opacity">
														<option value="@opacity">
														<xsl:value-of select="@opacity"/></option>
													</xsl:if>
													<option value="1">1</option>
													<option value="0.8">0.8</option>
													<option value="0.6">0.6</option>
													<option value="0.4">0.4</option>
													<option value="0.2">0.2</option>
													<option value="0">0</option>
											</select>
										</form>
								 </div>
					         </xsl:if>
					</div> <!--end of {$widgetId}_{$layerId}_Header -->	
				</div>	<!--end of hack ie 5.5 -->	
				<!-- legend -->
			    <xsl:if test="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL"> 
			    			
			    				
							<div class="legend" id="{$layerId}_legend" >
								<xsl:attribute name="style">
									<xsl:choose>
										<xsl:when test="@hidden='1' or @hidden='true'">display:none </xsl:when>
										<xsl:otherwise>display:block</xsl:otherwise>
									</xsl:choose> 
								</xsl:attribute>
							    <xsl:element name="IMG"  >
									<xsl:attribute name="SRC">
										<xsl:value-of select="wmc:StyleList/wmc:Style[@current='1']/wmc:LegendURL/wmc:OnlineResource/@xlink:href"/> 
									</xsl:attribute>
								</xsl:element>
							</div>
				</xsl:if>		 
    </div> <!--end of "{$widgetId}_{$layerId}_Row" --> 
</xsl:template>
<xsl:template match="text()|@*"/>
</xsl:stylesheet>
