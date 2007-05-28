<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xls="http://www.opengis.net/xls" xmlns:gml="http://www.opengis.net/gml" version="1.0">

<!--
Description:Parse the Geocoder Response to html
Author:      Steven Ottens AT geodan.nl
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OpenLSResponse.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- Common params for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="targetModelId"/>
	<xsl:param name="puntModelId"/>
	<xsl:param name="widgetId"/>
	<xsl:param name="title">Click to zoom in</xsl:param>

  <!-- Main html - It matches only non-empty results -->
  <xsl:template match="/">
		<div class="olsRespons">
			<form>	
				<xsl:apply-templates/>
			</form>
		</div>
	</xsl:template>

  <!-- All nodes -->
  <xsl:template match="xls:GeocodeResponse/xls:GeocodeResponseList">
		<xsl:choose>    
			<!--No geocoder result-->
			<xsl:when test="@numberOfGeocodedAddresses=0">
				<div class="respons"><p>No result has been found</p></div>
			</xsl:when>
			<!-- 1 geocoder result-->
			<xsl:when test="@numberOfGeocodedAddresses=1">
				<div class="respons"><p>There is <xsl:value-of select="@numberOfGeocodedAddresses"/> result found</p>
					<div class="responses">        
						<xsl:for-each select="*">
							<xsl:variable name="position" select="gml:Point/gml:pos"/>
							<xsl:variable name="space" select="' '"/>
							<xsl:variable name="x" select="substring-before($position, ' ')"/>
							<xsl:variable name="y" select="substring-after($position, ' ')"/>
							<xsl:variable name="res">
							<!--Depending on the results a different zoomlevel is chosen-->
								<xsl:choose>
									<xsl:when test="xls:Address/xls:StreetAddress/xls:Street">   
										0.9 <!--emperical value-->
									</xsl:when>
									<xsl:when test="xls:Address/xls:Place[@type='MunicipalitySubdivision']">
										10 <!--emperical value-->
									</xsl:when>
									<xsl:otherwise>
										40 <!--emperical value-->
									</xsl:otherwise>
								</xsl:choose>
							</xsl:variable>
							<!--This is the script executed when clicked on a result-->
							<xsl:variable name="javascriptje">
										config.objects.<xsl:value-of select="$targetModelId"/>.extent.centerAt(new Array(<xsl:value-of select="$x"/>,<xsl:value-of select="$y"/>),<xsl:value-of select="$res"/>)
							</xsl:variable>
							
							<!--Depending on the results different elements are shown in the result-->
							<xsl:choose>
								<!--street level-->
								<xsl:when test="xls:Address/xls:StreetAddress/xls:Street">
									<div class="title">
										<b style="cursor:pointer" title="{$title}" onClick="javascript:{$javascriptje}"><xsl:value-of select="xls:Address/xls:StreetAddress/xls:Street"/>
											<xsl:if test="xls:Address/xls:StreetAddress/xls:Building/@number">
												no: <xsl:value-of select="xls:Address/xls:StreetAddress/xls:Building/@number"/>
											</xsl:if>
										</b>
									</div>	
									<!--Since there is only one result, immediately zoom to it-->
									<script type="text/javascript" defer="true"><xsl:value-of select="$javascriptje"/></script>
									<xsl:if test="xls:Address/xls:PostalCode">
										<div class="postcode">
											<xsl:value-of select="xls:Address/xls:PostalCode"/>
										</div>
									 </xsl:if>
									<xsl:if test="xls:Address/xls:Place[@type='MunicipalitySubdivision']">
										<div class="plaats">
											<xsl:value-of select="xls:Address/xls:Place[@type='MunicipalitySubdivision']"/>
										</div>
									 </xsl:if>
								</xsl:when>
								<!--city level-->
								<xsl:when test="xls:Address/xls:Place[@type='MunicipalitySubdivision']">
									<div class="title">
										<b style="cursor:pointer" title="{$title}" onclick="javascript:{$javascriptje}"><xsl:value-of select="xls:Address/xls:Place[@type='MunicipalitySubdivision']"/></b>
										<!--Since there is only one result, immediately zoom to it-->
										<script type="text/javascript" defer="true"><xsl:value-of select="$javascriptje"/></script>
									</div>
								</xsl:when>
								<!--other level-->
								<xsl:otherwise>
									<div class="title">
										<b style="cursor:pointer"  title="{$title}" onclick="javascript:{$javascriptje}"><xsl:value-of select="xls:Address/xls:Place[@type='Municipality']"/></b>
										<!--Since there is only one result, immediately zoom to it-->
										<script type="text/javascript" defer="true"><xsl:value-of select="$javascriptje"/></script>
									</div>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:for-each>
					</div>
				</div>
			</xsl:when>
			<!-- multiple geocoder result-->
			<xsl:otherwise>
				<div class="respons"><p>There are <xsl:value-of select="@numberOfGeocodedAddresses"/> results found.</p>
					<div class="responses">
						<xsl:for-each select="*">
							<xsl:variable name="position" select="gml:Point/gml:pos"/>
							<xsl:variable name="space" select="' '"/>
							<xsl:variable name="x" select="substring-before($position, ' ')"/>
							<xsl:variable name="y" select="substring-after($position, ' ')"/>
								<xsl:variable name="res">
							<!--Depending on the results a different zoomlevel is chosen-->
								<xsl:choose>
									<xsl:when test="xls:Address/xls:StreetAddress/xls:Street">   
										0.9 <!--emperical value-->
									</xsl:when>
									<xsl:when test="xls:Address/xls:Place[@type='MunicipalitySubdivision']">
										10 <!--emperical value-->
									</xsl:when>
									<xsl:otherwise>
										40 <!--emperical value-->
									</xsl:otherwise>
								</xsl:choose>
							</xsl:variable>
							<!--This is the script executed when clicked on a result-->
							<xsl:variable name="javascriptje">
										config.objects.<xsl:value-of select="$targetModelId"/>.extent.centerAt(new Array(<xsl:value-of select="$x"/>,<xsl:value-of select="$y"/>),<xsl:value-of select="$res"/>)
							</xsl:variable>
							
							<!--Depending on the results different elements are shown in the result-->
							<xsl:choose>
								<!--street level-->
								<xsl:when test="xls:Address/xls:StreetAddress/xls:Street">
									<div class="title">
										<b style="cursor:pointer"  title="{$title}" onClick="javascript:{$javascriptje}"><xsl:value-of select="xls:Address/xls:StreetAddress/xls:Street"/></b>
										<xsl:if test="xls:Address/xls:StreetAddress/xls:Building/@number">
											no: <xsl:value-of select="xls:Address/xls:StreetAddress/xls:Building/@number"/>
										</xsl:if>
									</div>
									<xsl:if test="xls:Address/xls:PostalCode">
										<div class="postcode">
											<xsl:value-of select="xls:Address/xls:PostalCode"/>
										</div>
									</xsl:if>
									<xsl:if test="xls:Address/xls:Place[@type='MunicipalitySubdivision']">
										<div class="plaats">
											<xsl:value-of select="xls:Address/xls:Place[@type='MunicipalitySubdivision']"/>
										</div>
									</xsl:if>
								</xsl:when>
								<!--city level-->
								<xsl:when test="xls:Address/xls:Place[@type='MunicipalitySubdivision']">
									<div class="title">
										<b style="cursor:pointer" title="{$title}" onclick="javascript:{$javascriptje}"><xsl:value-of select="xls:Address/xls:Place[@type='MunicipalitySubdivision']"/></b>
									</div>
								</xsl:when>
								<!--other level-->
								<xsl:otherwise>
									<div class="title">
										<b style="cursor:pointer"  title="{$title}" onclick="javascript:{$javascriptje}"><xsl:value-of select="xls:Address/xls:Place[@type='Municipality']"/></b>
									</div>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:for-each>
					</div>
				</div>
			</xsl:otherwise>  
		</xsl:choose>    
	</xsl:template>

  <!-- Remove documentation, text, comments -->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>
</xsl:stylesheet>
