<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
xmlns:gml="http://www.opengis.net/gml" 
version="1.0">

<!--
Description: Convert a GML Feature or FeatureCollection into a HTML form.
Author:      Cameron Shorter cameron ATshorter.net
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureList.xsl 3256 2007-09-14 00:39:54Z mvivian $
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <!--xsl:param name="targetModelId"/-->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
      <h3>Feature List</h3>
      <input type="button" value="Save" onclick="config.objects.insertFeature.doSelect(config.objects.insertFeature,true);" />
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- don't print boundedBy -->
  <xsl:template match="gml:boundedBy"/>

  <!-- featureMember -->
  <xsl:template match="gml:featureMember">
    <div>
      <table border="1" cellpadding="0" cellspacing="0">
        <xsl:apply-templates/>
      </table>
      <br/>
    </div>
  </xsl:template>

  <!-- All nodes -->
  <xsl:template match="*">
    <xsl:variable name="xlink">
      <xsl:call-template name="getXpath">
        <xsl:with-param name="node" select="."/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:if test="not(./*)">
	  <xsl:choose>
<!-- 
    	<xsl:when test="name(.)='category'">
          <tr>
            <td>
              <xsl:value-of select="@scheme"/>
            </td>
            <td>
              <xsl:value-of select="@term"/>
            </td>
          </tr>
    	</xsl:when>
-->
    	<xsl:when test="name(.)='category'">
          <tr>
            <td>
              <xsl:value-of select="@scheme"/>
            </td>
            <td>
                <xsl:choose>
		            <xsl:when test="@scheme='http://www.geobase.ca/scheme/domain'">
						<select id="{$widgetId}{generate-id()}"
			                onchange="config.objects.{$widgetId}.setAttribValue(config.objects.{$widgetId},'{$xlink}[@scheme=\'{@scheme}\']','term',document.getElementById('{$widgetId}{generate-id()}').value);">
			                <option value="">---Please Select---</option>
			                <xsl:choose><xsl:when test="@term='AB'">   <option value="AB" selected="true">Alberta</option>                  </xsl:when><xsl:otherwise>   <option value="AB">Alberta</option>                  </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='BC'">   <option value="BC" selected="true">British Columbia</option>         </xsl:when><xsl:otherwise>   <option value="BC">British Columbia</option>         </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='MB'">   <option value="MB" selected="true">Manitoba</option>                 </xsl:when><xsl:otherwise>   <option value="MB">Manitoba</option>                 </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='NB'">   <option value="NB" selected="true">New Brunswick</option>            </xsl:when><xsl:otherwise>   <option value="NB">New Brunswick</option>            </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='NL'">   <option value="NL" selected="true">Newfoundland and Labrador</option></xsl:when><xsl:otherwise>   <option value="NL">Newfoundland and Labrador</option></xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='NT'">   <option value="NT" selected="true">Northwest Territories</option>    </xsl:when><xsl:otherwise>   <option value="NT">Northwest Territories</option>    </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='NS'">   <option value="NS" selected="true">Nova Scotia</option>              </xsl:when><xsl:otherwise>   <option value="NS">Nova Scotia</option>              </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='NU'">   <option value="NU" selected="true">Nunavut</option>                  </xsl:when><xsl:otherwise>   <option value="NU">Nunavut</option>                  </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='ON'">   <option value="ON" selected="true">Ontario</option>                  </xsl:when><xsl:otherwise>   <option value="ON">Ontario</option>                  </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='PE'">   <option value="PE" selected="true">Prince Edward Island</option>     </xsl:when><xsl:otherwise>   <option value="PE">Prince Edward Island</option>     </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='QC'">   <option value="QC" selected="true">Quebec</option>                   </xsl:when><xsl:otherwise>   <option value="QC">Quebec</option>                   </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='SK'">   <option value="SK" selected="true">Saskatchewan</option>             </xsl:when><xsl:otherwise>   <option value="SK">Saskatchewan</option>             </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='YT'">   <option value="YT" selected="true">Yukon</option>                    </xsl:when><xsl:otherwise>   <option value="YT">Yukon</option>                    </xsl:otherwise></xsl:choose>
			            </select>
	    			</xsl:when>
	    			<xsl:when test="@scheme='http://www.geobase.ca/scheme/featuretype'">
						<select id="{$widgetId}{generate-id()}"
			                onchange="config.objects.{$widgetId}.setAttribValue(config.objects.{$widgetId},'{$xlink}[@scheme=\'{@scheme}\']','term',document.getElementById('{$widgetId}{generate-id()}').value);">
			                <option value="">---Please Select---</option>
			                <xsl:choose><xsl:when test="@term='PlaceName'">          <option value="PlaceName" selected="true">Place Name</option>                    </xsl:when><xsl:otherwise>  <option value="PlaceName">Place Name</option>                    </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='RoadSegment'">        <option value="RoadSegment" selected="true">Road Segment</option>                </xsl:when><xsl:otherwise>  <option value="RoadSegment">Road Segment</option>                </xsl:otherwise></xsl:choose>
			                <xsl:choose><xsl:when test="@term='AdministrativeArea'"> <option value="AdministrativeArea" selected="true">Administrative Area</option>  </xsl:when><xsl:otherwise>  <option value="AdministrativeArea">Administrative Area</option>  </xsl:otherwise></xsl:choose>
			            </select>
	    			</xsl:when>
	    			<xsl:otherwise>
		              	<input
		              		disabled="true"
			                type="text"
			                id="{$widgetId}{generate-id()}"
			                size="40"
			                value="{@term}"
			                onchange="config.objects.{$widgetId}.setAttribValue(config.objects.{$widgetId},'{$xlink}[@scheme=\'{@scheme}\']','term',document.getElementById('{$widgetId}{generate-id()}').value);"/>
		        	</xsl:otherwise>
	        	</xsl:choose>
            </td>
          </tr>
        
        </xsl:when>
        <xsl:otherwise>
          <tr>
            <td>
              <xsl:value-of select="name(.)"/>
            </td>
            <td>
              <input
                type="text"
                id="{$widgetId}{generate-id()}"
                size="40"
                value="{text()}"
                onchange="config.objects.{$widgetId}.setNodeValue(config.objects.{$widgetId},'{$xlink}',document.getElementById('{$widgetId}{generate-id()}').value);"/>
            </td>
          </tr>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
    <xsl:if test="./*">
      <xsl:apply-templates>
      </xsl:apply-templates>
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

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
