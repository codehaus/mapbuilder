<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:sld="http://www.opengis.net/sld" 
	xmlns:wmc="http://www.opengis.net/context" 
    xmlns:wms="http://www.opengis.net/wms" 
    xmlns:wfs="http://www.opengis.net/wfs" 	
    xmlns:owscat="http://www.ec.gc.ca/owscat"
    xmlns:ogc="http://www.opengis.net/ogc"
    version="1.0"
>

<!--
Description: Insert SLD properties  in the model.
Author:      Olivier Terral
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SLDEditor.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
$Name$
-->

  	<xsl:output method="xml" encoding="utf-8"/>

  	<!-- Common params for all widgets -->
  	<!--xsl:param name="targetModelId"/-->
  	<xsl:param name="modelId"/>
  	<xsl:param name="widgetId"/>
	<xsl:param name="layerName"/>
  	<xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/></xsl:param>
  
  	<xsl:variable name="cssId1" >fill</xsl:variable>
  	<xsl:variable name="cssid2" >stroke</xsl:variable>
	<xsl:variable name="id2" >'fill-opacity'</xsl:variable>
	<xsl:variable name="id3" >'stroke'</xsl:variable>
	<xsl:variable name="id4" >'stroke-opacity'</xsl:variable>
	<xsl:variable name="id5" >'stroke-width'</xsl:variable>


	<xsl:variable name="id6" >'WellKnownName'</xsl:variable>
	<xsl:variable name="id7" >'Size'</xsl:variable>

	<xsl:variable name="id8" >'font-family'</xsl:variable>
	<xsl:variable name="id9" >'font-style'</xsl:variable>
	<xsl:variable name="id10" >'font-size'</xsl:variable>
	<xsl:variable name="id11" >'font-weight'</xsl:variable>
  

  	<!-- featureMember -->
  	<xsl:template match="/StyledLayerDescriptor">
  
    	<div>
      		<h1>SldEditor for <xsl:value-of select="$layerName"/></h1><br/>   	
      		<script>javascript:config.objects.editSLD.updateNode("/StyledLayerDescriptor/NamedLayer/Name",'<xsl:value-of select="$layerName"/>');</script>

      
      
      		<b>Type : </b>
       		<select name="featureType" id="choixFeatureType" size="1" onChange="window.location=document.getElementById('choixFeatureType').value;">
      			<option selected="selected">Choose feature type</option>  
      			<option value="javascript:config.loadModel('mySLD','data/basePolygon.sld');">Polygon</option>     
       			<option value="javascript:config.loadModel('mySLD','data/baseLine.sld');">Line</option>     
      			<option value="javascript:config.loadModel('mySLD','data/basePoint.sld');">Point</option>     
      			<option value="javascript:config.loadModel('mySLD','data/basePointText.sld');">PointText</option>  	
      		</select> 
     		<br/>
      		<br/>
      		<div id="table">
      			<table border="1" cellpadding="0" cellspacing="0">
        			<xsl:apply-templates/>
      			</table>
      		</div>
     		<div id="buttons">
	      		<input type="button" name="vivaSld" value="Insert SLD in WMC"  onclick="javascript:config.objects.editSLD.insertSldToWmc('{$layerName}');javascript:config.paintWidget(config.objects.contextLegend);alert('Don t forget to save WMC with save button in ButtonBar')"/> 
	  			<input type="button" name="vivaSld2" value="Create SLD file"  onclick="javascript:config.objects.{$modelId}.saveModel(config.objects.{$modelId});"/> 
 	  		</div>
      		<br/>
    	</div>
  	</xsl:template>


	<xsl:template match="*">
   		<xsl:variable name="xlink">
      		<xsl:call-template name="getXpath">
        		<xsl:with-param name="node" select="."/>
      		</xsl:call-template>
    	</xsl:variable>
    	<xsl:variable name="attr">
    		<xsl:call-template name="getAttr">
        		<xsl:with-param name="node" select="."/>
      		</xsl:call-template>
    	</xsl:variable>
    
    	<xsl:if test="not(./*)">
	      	<tr>
	        	<xsl:if test=".[@name]">
	        		<xsl:choose>
          				<xsl:when test="@name='fill'">
          				
          					<td class="cssParameter">
            					<a href="javascript:openColorWindow('{$widgetId}{generate-id()}');">
									<xsl:value-of select="name(parent::*)"/>
								</a>
            				</td>
            					
							<td>
						    	<input
						            type="text"
						            id="{$widgetId}{generate-id()}"
						            size="40"
						            value="{text()}"
						            onfocus="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'{$xlink}',document.getElementById('{$widgetId}{generate-id()}').value,'{$attr}');"/>
					        </td>
					        
          				</xsl:when>
          				<xsl:when test="@name='stroke'">
          				
          					<td class="cssParameter">
            					<a href="javascript:openColorWindow('{$widgetId}{generate-id()}');">
									<xsl:value-of select="name(parent::*)"/>
								</a>
            				</td>
            					
							<td>
						    	<input
						            type="text"
						            id="{$widgetId}{generate-id()}"
						            size="40"
						            value="{text()}"
						            onfocus="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'{$xlink}',document.getElementById('{$widgetId}{generate-id()}').value,'{$attr}');"/>
					        </td>
					        
          				</xsl:when>
          				<xsl:otherwise>
	          				<td class="cssParameter">
		          				<xsl:value-of select="@name"/> 
		          			</td>     
            				<td>
			          			<input
					            	type="text"
					            	id="{$widgetId}{generate-id()}"
					            	size="40"
					            	value="{text()}"
					            	onchange="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'{$xlink}',document.getElementById('{$widgetId}{generate-id()}').value,'{$attr}');"/>
		        			</td>
         			 	</xsl:otherwise>
        			</xsl:choose>	     
	        	</xsl:if>
	        	
	        	<xsl:if test="not(.[@name])">
	        		<xsl:if test="name(.)='ogc:PropertyName'">
			        		<td class="PropertyName">
			        			<a href="javascript:config.loadModel('layerTypeTemplate','http://localhost:8080/geoserver/wfs?request=DescribeFeatureType&amp;version=1.0.0&amp;service=WFS&amp;TypeName={$layerName}');">
			        				<xsl:value-of select="name(.)"/>
			        			</a>
			        		</td>
			        		<td id="selectProperty">
					          	<input
					            	type="text"
					            	id="{$widgetId}{generate-id()}"
					            	size="40"
					            	value="{text()}"
					            	onchange="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'{$xlink}',document.getElementById('{$widgetId}{generate-id()}').value,'{$attr}');"/>
				        	</td>
	        		</xsl:if>
		        	<xsl:if test="not(name(.)='ogc:PropertyName')">
		        		
		        		<td class="othersParam">
		        			<xsl:value-of select="name(.)"/>
		        		</td>
		        		<td>
				          	<input
				            	type="text"
				            	id="{$widgetId}{generate-id()}"
				            	size="40"
				            	value="{text()}"
				            	onchange="config.objects.{$widgetId}.setAttr(config.objects.{$widgetId},'{$xlink}',document.getElementById('{$widgetId}{generate-id()}').value,'{$attr}');"/>
			        	</td>
			        	
		        	</xsl:if>
		        </xsl:if>
	      	</tr>  
 		</xsl:if>
  		<xsl:if test="./*">
        	<h1><xsl:value-of select="name(.)"/></h1> 		
      		<xsl:apply-templates/>	
    	</xsl:if>     
 	</xsl:template>
  
  	<!-- Return xpath reference to a node. Calls itself recursively -->
  	<xsl:template name="getXpath">
		<xsl:param name="node"/>
		    <xsl:if test="name($node/..)">
		      	<xsl:call-template name="getXpath">
		        	<xsl:with-param name="node" select="$node/.."/>
		      	</xsl:call-template>
		    </xsl:if>
	    <xsl:text>/</xsl:text>
    	<xsl:value-of select="name($node)"/>
  	</xsl:template>
  
  
  
	<!-- Return attr reference to a node. Calls itself recursively -->
  	<xsl:template name="getAttr">
    	<xsl:param name="node"/>
    	<xsl:if test="name($node/..)">
     		<xsl:call-template name="getAttr">
        		<xsl:with-param name="node" select="$node/.."/>
      		</xsl:call-template>
    	</xsl:if>
    
    	<xsl:if test="$node[@name]">
    		<xsl:value-of select="@name"/>
    	</xsl:if>
  	</xsl:template>
  	
  	<!-- Remove documentation, text, comments -->
  	<xsl:template match="comment()|text()|processing-instruction()">
  	</xsl:template>
  	
</xsl:stylesheet>