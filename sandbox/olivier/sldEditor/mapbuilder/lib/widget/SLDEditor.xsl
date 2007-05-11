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
$Id$
$Name$
-->

  	<xsl:output method="xml" encoding="utf-8"/>

  	<!-- Common params for all widgets -->
  	<!--xsl:param name="targetModelId"/-->
  	<xsl:param name="modelId"/>
  	<xsl:param name="widgetId"/>
  	<xsl:param name="toolId"/>
	<xsl:param name="layerName"/>
  	<xsl:param name="model">config.objects.<xsl:value-of select="$modelId"/></xsl:param>
	<xsl:param name="widget">config.objects.<xsl:value-of select="$widgetId"/></xsl:param>
<!--	<xsl:param name="tool">config.objects.<xsl:value-of select="$toolId"/></xsl:param>-->
	
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
	    
	    
	     <div id="editFile">
       <div class="editFile" >name of file</div>
            
             
              
              <input class="colorpics"
						            type="text"
						            id="newEditInput"
						            size="40" />
				<div id="buttonsEdit">
	      		<input type="button" name="buttonsEdit" value="add a file"  onclick="javascript:config.loadModel('mySLD','data/'+document.getElementById('newEditInput').value);javascript:config.paintWidget({$widget});"/> 
	  			<input type="button" name="buttonsEdit2" value="inter"  onclick="interpolation(0,1,'#CCFF00','#660000',0.1);"/>
	  			</div>
       
       </div>
			
   
      <div id="LegendType">
          <div class="LegendType">Type of legende:</div>
          <form class="LegendType" title="can define legende type">
              <select id="choilegend" onchange="javascript:{$tool}.LegendTypepics2(document.getElementById('choilegend').value);javascript:config.paintWidget({$widget});" style="width: 100px; font-size: 10px; line-height: 10px;" name="selecttype">
                    <option value="80">Symbole Unique</option>
                    <option value="100">Couleur Continue</option>
                    <option value="60">Symbole Gradu�</option>
                    <option value="40">valeur unique</option>
              </select>
          </form>
       </div><!-- end of div type of legend -->
       
       <div id="choixFeature">
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
       
       <div id="bordurestyle">
            <div class="bordurestyle">stroke-linejoin :</div>
               <button onclick="javascript:{$tool}.changeFill('0');javascript:config.paintWidget({$widget});">continue</button>
               <button onclick="javascript:{$tool}.changeFill('1');javascript:config.paintWidget({$widget});" >mitre</button>
               <button onclick="javascript:{$tool}.changeFill('2');javascript:config.paintWidget({$widget});" >Stroke</button>
               <button onclick="javascript:{$tool}.changeFill('3');javascript:config.paintWidget({$widget});" >bevel</button>
              
       </div><!-- end of div bordurestyle -->
       <div id="newrule">
       <div class="newruleclass" >name of rule </div>
            
             
              
              <input class="colorpics"
						            type="text"
						            id="newruleclassinput"
						            size="40" />
				<div id="buttonsRule">
	      		<input type="button" name="buttonrule" value="add rule"  onclick="javascript:{$tool}.createRule(document.getElementById('newruleclassinput').value,document.getElementById('choixFeatureSlect').value);javascript:config.paintWidget({$widget});"/> 
	  			</div>
       
       </div>
       <div id="color">
            <div class="color" onclick="javascript:{$widget}.openColorWindow('couleurchoix');">couleur de bordure externe:</div>
             <input class="colorpics"
						            type="text"
						            id="couleurchoix"
						            size="40"																		
						            
						            onfocus="javascript:{$tool}.upadteNode2(document.getElementById('idNameOfRule').value,document.getElementById('choixFeatureSlect').value+'/Stroke/CssParameter[@name=\'stroke\']',document.getElementById('couleurchoix').value);"
						             />
              
            <div class="color">largeur de bordure externe:</div>
            <form class="colorpics" title="can define size">
                  <select  onchange="javascript:{$tool}.upadteNode2(document.getElementById('idNameOfRule').value,'/Stroke/CssParameter[@name=\'stroke-width\']',document.getElementById('couleurchoix2').value)" style="width: 10px; font-size: 10px; line-height: 10px;" name="selecttype">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                  </select>
              </form>
            <div class="color" onclick="javascript:{$widget}.openColorWindow('couleurchoix2');">couleur de remplissage:</div><input class="colorpics"
						            type="text"
						            id="couleurchoix2"
						            size="40"
						            onfocus="javascript:{$tool}.upadteNode2(document.getElementById('idNameOfRule').value,'/Fill/CssParameter',document.getElementById('couleurchoix2').value);"
						             />
       
       </div><!-- end of div color -->
     <!--  <div id="modelderemplissage">
            <div class="modelderemplissage">modele de remplissage : </div>
               <button >continue</button>
               <button >pointille serre</button>
               <button >pontille changeant</button>
               <button >large pontille</button>
               <button >pointille ultra</button>
          
       </div> --><!-- end of div modelderemplissage -->
      
       
	</div>
	</div>
     
       
	
	<!-- fin du sld editor --> 
      		
      		<div id="table">
					<select id="idNameOfRule" name="nameOfRule" size="5" >
        			<xsl:apply-templates select="NamedLayer/UserStyle/FeatureTypeStyle/Rule" />
        			</select>
			</div>

     		<div id="buttons">
	      		<input type="button" name="vivaSld" value="Insert SLD in WMC"  onclick="javascript:{$tool}.insertSldToWmc('{$layerName}');alert('Don t forget to save WMC with save button in ButtonBar')"/> 
	  			<input type="button" name="vivaSld2" value="Create SLD file"  onclick="javascript:{$model}.saveModel({$model});"/> 
	  			
	  			
	  			
 	  		</div>
      		<br/>
      		
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