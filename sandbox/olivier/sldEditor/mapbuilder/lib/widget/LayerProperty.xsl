<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parse DescribeFeatureType response 
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id$
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
  <div class="choixchamp2">Champ de classification:</div>
  <div class="choixchamp2pics">
   	 <select name="featureProperty" id="choixfeatureProperty"  size="1" onchange="">
   		<option selected="the_geom">Choose feature property</option> 
      	<xsl:apply-templates select="//xs:element"/>
    </select>
    </div>
    <div class="choixchamp2">RuleName : <input id="namerule" class="choixchamp2pics" value="rulename{generate-id()}"/> </div>
    
    <div class="choixchamp2">nombdre de class:</div>
    <div class="choixchamp2pics">
    <select id="nbclass" class="choixchamp" style="width: 10px; font-size: 10px; line-height: 10px;" name="selecttype">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    </select></div>
    
    <div class="choixchamp2">mode : </div>
    <div class="choixchamp2pics">
    
    <select  id="nbmode2" class="choixchamp"  style="width: 10px; font-size: 10px; line-height: 10px;" name="selecttype2">
    <option value="1">valeur automatique</option>
    <option value="2">normal</option>
    <option value="3">couleur continue</option>
    </select>
    </div>
    
    <div id="value" class="choixchamp2" >valeurt comprise entre:  <input type="text"
						            id="valuedown"
						            size="10"
						            value=""/> et <input type="text"
						            id="valueup"
						            size="10"
						            value=""/>
						            </div>
	<div class="choixchamp2">coleur de depart : <input id="firtColor" class="choixchamp2pics" value="" onclick="javascript:openColorWindow('firtColor');"/> </div>
	<div class="choixchamp2">couleur de fin : <input id="lastColor" class="choixchamp2pics" value="" onclick="javascript:openColorWindow('lastColor');"/> </div>					          
						          
	
    <div id="buttonsnew" class="choixchamp2">
	      		<input type="button" name="validation" value="valid"  onclick="javascript:config.objects.editSLD.mode(document.getElementById('choixfeatureProperty').value,document.getElementById('valueup').value,document.getElementById('valuedown').value,document.getElementById('namerule').value,document.getElementById('nbclass').value,document.getElementById('nbmode2').value,'#CCFF00','#CCFF00');javascript:config.paintWidget(config.objects.editor);"/> 
	 </div>
	 <div id="buttonsnew2" class="choixchamp2">
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



