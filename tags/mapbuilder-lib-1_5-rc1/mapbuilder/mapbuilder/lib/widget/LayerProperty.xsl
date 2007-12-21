<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parse DescribeFeatureType response 
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: LayerProperty.xsl 2798 2007-05-11 18:16:33Z oterral $
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:camgis="http://www.geomatys.fr/camgis" 
xmlns:gml="http://www.opengis.net/gml" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:citef="http://www.opengis.net/cite/functions" >
  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="widget">config.objects.<xsl:value-of select="$widgetId"/></xsl:param>
  
  <xsl:param name="elementName">
    <xsl:value-of select="/xs:schema/xs:element/@name"/>
  </xsl:param>
  <xsl:param name="elementType">
    <xsl:value-of select="/xs:schema/xs:element/@type"/>
  </xsl:param>
  <xsl:param name="elementTypeNoNs">
    <xsl:value-of select="substring-after($elementType,':')"/>
  </xsl:param>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/xs:schema">
  <xsl:variable name="id">'choixFeatureProperty'</xsl:variable>
   <div id="choixchamp3" >
  <div class="choixchamp2">field of classification</div>
  <div class="choixchamp2pics">
   	 <select name="featureProperty" id="choixfeatureProperty"  size="1" onchange="">
   		<option selected="the_geom">Choose feature property</option> 
      	<xsl:apply-templates select="//xs:element"/>
    </select>
    </div>
    <div class="choixchamp2">Rule's Name : <input id="namerule" class="choixchamp3pics" value="rulename"/> </div>
    
    <div class="choixchamp2">number of class:</div>
    <div class="choixchamp2pics">
    <select id="nbclass" class="choixchamp" style="width: 80px; font-size: 10px; line-height: 10px;" name="selecttype">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    </select></div>
    
    <div class="choixchamp2">mode : </div>
    <div class="choixchamp2pics">
    
    <select  id="nbmode2" class="choixchamp"  style="width: 80px; font-size: 10px; line-height: 10px;" name="selecttype2">
    <option value="1">equal interval</option>
    <option value="2">normal</option>
    <option value="3">color continous</option>
    </select>
    </div>
    
    <div id="value" class="choixchamp2" >value from :  <input type="text"
						            id="valuedown"
						            size="10"
						            value=""/> to <input type="text"
						            id="valueup"
						            size="10"
						            value=""/>
						            </div>
				<div class="colorbox">		            
					<div class="colorBoxName"> color </div>	            
	<div class="colorNameInput">lower value : <input id="firtColor" class="colorinput" value="" onclick="javascript:config.objects.editor.openColorWindow('firtColor');"/> </div>
	<div class="colorNameInput">upper value : <input id="lastColor" class="colorInput" value="" onclick="javascript:config.objects.editor.openColorWindow('lastColor');"/> </div>					          
						 </div>         
	
   
	 <div id="buttonsnew2" class="buttonValid">
	      		<input type="button" name="validation" value="valid interpolation"  onclick="javascript:config.objects.editSLD.mode(document.getElementById('choixfeatureProperty').value,document.getElementById('valueup').value,document.getElementById('valuedown').value,document.getElementById('namerule').value,document.getElementById('nbclass').value,document.getElementById('nbmode2').value,document.getElementById('firtColor').value,document.getElementById('lastColor').value);javascript:config.paintWidget(config.objects.editor);"/> 
	 </div>
    </div>
    
    
   
    
    
  </xsl:template>

  <!-- template rule matching source root element -->
  <xsl:template match="//xs:element">
    <xsl:variable name="name"><xsl:value-of select="@name"/></xsl:variable>
    <xsl:variable name="type"><xsl:value-of select="@type"/></xsl:variable>   
       <option value="{$name}"> name : <xsl:value-of select="$name"/> type :<xsl:value-of select="$type"/></option>
  		
  </xsl:template>

 

</xsl:stylesheet>



