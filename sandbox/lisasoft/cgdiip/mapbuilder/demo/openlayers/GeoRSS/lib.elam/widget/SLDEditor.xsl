<?xml version="1.0" encoding="UTF-8"?><!-- DWXMLSource="../../../../../../../Documents and Settings/arsene/Mes documents/Noculture/camgis.xml" -->
<xsl:stylesheet
    version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:sld="http://www.opengis.net/sld" 
	xmlns:wmc="http://www.opengis.net/context" 
    xmlns:wms="http://www.opengis.net/wms" 
    xmlns:wfs="http://www.opengis.net/wfs" 	
    xmlns:owscat="http://www.ec.gc.ca/owscat"
    xmlns:ogc="http://www.opengis.net/ogc" 
	xmlns:xlink="http://www.w3.org/1999/xlink"
>

<!--
Description: Insert SLD properties  in the model.
Author:      Olivier Terral
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SLDEditor.xsl 3014 2007-07-26 11:11:44Z oterral $
$Name$
-->

  	<xsl:output method="xml" encoding="utf-8"/>

  	<!-- Common params for all widgets -->
  	<!--xsl:param name="targetModelId"/-->
  	<xsl:param name="modelId"/>
  	<xsl:param name="widgetId"/>
  	<xsl:param name="toolId"/>
	<xsl:param name="layerName"/>
  	<xsl:param name="context">config.objects.<xsl:value-of select="$modelId"/></xsl:param>
	<xsl:param name="widget">config.objects.<xsl:value-of select="$widgetId"/></xsl:param>

	<xsl:param name="tool">config.objects.editSLD</xsl:param>

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
      		<script>javascript:<xsl:value-of select="$tool"/>.updateNode("/StyledLayerDescriptor/NamedLayer/Name",'<xsl:value-of select="$layerName"/>');</script>
    
      <div id="bodyeditor">
        
	    <div id="general">
	    
	   
   
      <div id="LegendType">
          <div class="LegendType">Type of legende:</div>
          <form class="LegendType" title="can define legende type">
              <select id="choilegend" onchange="javascript:{$tool}.LegendTypepics2(document.getElementById('choilegend').value);" style="width: 100px; font-size: 10px; line-height: 10px;" name="selecttype">
                    <option selected="60">Choose type of legende</option> 
                    <option value="80">Single symbol</option>
                    <option value="100">Continuous Color</option>
                    <option value="60">Graduated Symbol</option>
                    
              </select>
          </form>
       </div><!-- end of div type of legend -->
       
       
       
       <div id="bordurestyle">
            <div class="bordurestyle">stroke-linejoin :</div>
               <button onclick="javascript:{$tool}.styleOfStroke(document.getElementById('idNameOfRule').value,'mitre');" >mitre</button>
               <button onclick="javascript:{$tool}.styleOfStroke(document.getElementById('idNameOfRule').value,'Stroke');" >Stroke</button>
               <button onclick="javascript:{$tool}.styleOfStroke(document.getElementById('idNameOfRule').value,'bevel');" >bevel</button>
              
       </div><!-- end of div bordurestyle -->
       
      
      
       
	</div>
	</div>
     
       
	
	<!-- fin du sld editor --> 
      		
      		<div id="table">
					<div id="managementRule">Rule</div>
					<select id="idNameOfRule" name="nameOfRule" size="5" OnKeypress="if( event.keyCode == 46 )javascript:{$tool}.deleteAllRules();javascript:config.paintWidget(config.objects.editor);" >
					<option value="default"  >default</option>
        			<xsl:apply-templates select="NamedLayer/UserStyle/FeatureTypeStyle/Rule" />
        			</select>
        			<input type="button" name="deleteALL" value="deleteAllRule"  onclick="javascript:{$tool}.deleteAllRules();javascript:config.paintWidget(config.objects.editor);"/> 
       
			</div>
			
			
			
			 <div id="color">
            <div class="color" onclick="javascript:{$widget}.openColorWindow('couleurchoix');">color stoke:</div>
            
             
              
              <input class="colorpics"
						            type="text"
						            id="couleurchoix"
						            size="40"																		
						            
						            onfocus="javascript:{$tool}.upadteNode2(document.getElementById('idNameOfRule').value,'/Stroke/CssParameter[@name=\'stroke\']',document.getElementById('couleurchoix').value);"
						             />
              
            <div class="color">width stroke :</div>
            <form class="colorpics" title="can define size">
               <select  onchange="javascript:{$tool}.upadteNode2(document.getElementById('idNameOfRule').value,'/Stroke/CssParameter[@name=\'stroke-width\']',document.getElementById('selecttype').value)" style="width: 40px; font-size: 10px; line-height: 10px;" id="selecttype">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                  </select>
              </form>
            <div class="color" onclick="javascript:{$widget}.openColorWindow('couleurchoix2');">Fill color:</div><input class="colorpics"
						            type="text"
						            id="couleurchoix2"
						            size="40"
						            onfocus="javascript:{$tool}.upadteNode2(document.getElementById('idNameOfRule').value,'/Fill/CssParameter',document.getElementById('couleurchoix2').value);"
						             />
       
       </div>
			
			
			
			
			
			
			
			<div id="insertSLD" >
     		<div id="buttons">
	      		<input type="button" name="vivaSld" value="Insert SLD in WMC"  onclick="javascript:{$tool}.insertSldToWmc('{$layerName}');javascript:config.paintWidget(config.objects.contextLegend);alert('Don t forget to save WMC with save button in ButtonBar')"/> 
	  			<input type="button" name="vivaSld2" value="Create SLD file"  onclick="javascript:config.objects.{$modelId}.saveModel(config.objects.{$modelId});"/> 
	  			
	  			</div>
	  			
 	  		</div>
 	  		
      		<br/>
      		 <div id="uniqueSymbole" style="display:none">
	   <div id="editFile" >
            <div class="editFile" >enter file's name</div>
				<input class="editFileInput" type="file" id="newEditInput" size="40" />
			<div id="buttonsEdit">
	      		<input type="button" name="buttonsEdit" value="load a file"  onclick="javascript:config.loadModel('mySLD',document.getElementById('newEditInput').value);javascript:config.paintWidget({$widget});"/> 
	  		</div>
       </div>
       <div id="choixFeature" >
          <div class="choixFeature">Type of feature:</div>
          <form class="choixFeature" title="can define legende type">
              <select id="choixFeatureSlect" onchange="" style="width: 100px; font-size: 10px; line-height: 10px;" name="selecttype">
                    <option value="LineSymbolizer">Line</option>
                    <option value="PolygonSymbolizer">polygon</option>
                    <option value="PointSymbolizer">point</option>
                    <option value="TextSymbolizer">text</option>
              </select>
          </form>
       </div><!-- end of div type of choixFeature -->
       <div id="newrule" >
						<div class="newruleclass" >name of rule </div>
								<input class="newruleclassInput" type="text"	id="newruleclassinput"  size="20" />
						<div id="buttonsRule" class="newruleclass">
							<input type="button" name="buttonrule" value="add rule"  onclick="javascript:{$tool}.createRule(document.getElementById('newruleclassinput').value,document.getElementById('choixFeatureSlect').value,'#CCFF66');javascript:config.paintWidget({$widget});"/> 
					</div>
					</div>
			</div>
      		
    	</div>
    	
  	</xsl:template>


	<xsl:template match="NamedLayer/UserStyle/FeatureTypeStyle/Rule">
   		<xsl:variable name="nameRule" select="Title"/>
   		<xsl:variable name="xlink">
      		<xsl:call-template name="getXpath">
        		<xsl:with-param name="node" select="."/>
      		</xsl:call-template>
    	</xsl:variable>
		<xsl:variable name="feature" >
		  <xsl:if test="./LineSymbolizer">
			<xsl:value-of select="name(LineSymbolizer)"/>
		  </xsl:if>
		  <xsl:if test="./PolygonSymbolizer">
		     <xsl:value-of select="name(./PolygonSymbolizer)"/>
		  </xsl:if>
		  <xsl:if test="./PointSymbolizer">
		     <xsl:value-of select="name(./PointSymbolizer)"/>
		  </xsl:if>
		  <xsl:if test="./TextSymbolizer">
				<xsl:value-of select="name(./TextSymbolizer)"/>
		  </xsl:if>
		   
		</xsl:variable>
    	<option value="{$nameRule}" onclick="javascript:{$tool}.updateField('{$xlink}/{$feature}');" ><xsl:value-of select="Title"/> (<xsl:value-of select="$feature"/>)</option>
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
	     <xsl:choose>
	        <xsl:when test="name($node) ='Rule'">
	            
					
	        
	        <xsl:value-of select="name($node)"/><xsl:text>[Title=\'</xsl:text>
	        <xsl:if test="$node/Title">
						<xsl:value-of select="$node/Title"/>
					</xsl:if>
	        <xsl:text>\']</xsl:text>
		    </xsl:when>
		    <xsl:otherwise>
				<xsl:value-of select="name($node)"/>
			</xsl:otherwise>
        </xsl:choose>
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