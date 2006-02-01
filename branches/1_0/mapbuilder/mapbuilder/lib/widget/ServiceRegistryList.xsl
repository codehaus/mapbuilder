<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an listing of OGC services from the Discovery Portal registry
Author:      adair
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelTitle"/>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="targetModelId"/>
  <xsl:param name="targetModel"/>
  
  <xsl:param name="webServiceUrl">http://geodiscover.cgdi.ca/ceonetWeb/biz</xsl:param>
  <xsl:param name="formName">OGCServiceList</xsl:param>
  <xsl:param name="capabilitiesModel"/>
  <xsl:param name="keywords"/>
  <xsl:param name="serviceType"/>
  
  <!-- template rule matching source root element -->
  <xsl:template match="/searchDetails">
    <xsl:variable name="numPerPage"><xsl:value-of select="searchCriteria/numResultsPerPage"/></xsl:variable>
    <xsl:variable name="numPages"><xsl:value-of select="paging/totalPages"/></xsl:variable>
    <xsl:variable name="pageNum"><xsl:value-of select="paging/currentPage"/></xsl:variable>
    <xsl:variable name="nextPage"><xsl:value-of select="paging/nextPage"/></xsl:variable>
    <xsl:variable name="prevPage"><xsl:value-of select="paging/prevPage"/></xsl:variable>
    <div>
    <h4>Browse for web services</h4>
    <form name="{$formName}" id="{$formName}" method="get" action="{$webServiceUrl}">
      <input type="hidden" name="language" value="en"/>
      <input type="hidden" name="levelOfDetail" value="brief"/>
      <input type="hidden" name="serviceType" value="{$serviceType}"/>
      <input type="hidden" name="request" value="searchForService"/>
      <input type="hidden" name="numResultsPerPage" value="{$numPerPage}"/>
      <input type="hidden" name="page" value="{$pageNum}"/>
      <input type="hidden" name="sortOrder" value="default"/>
      <table width="100%">
        <tr>
          <td align="left">
            Keywords:<input type="text" name="keywords" value="{$keywords}" size="10"/>
          </td>
          <td align="right">
            <xsl:if test="$pageNum &gt; 1">
              <a href="javascript:config.objects.{$widgetId}.webServiceForm.page.value={$prevPage};config.objects.{$widgetId}.submitForm()">previous</a> - 
            </xsl:if>
            page <xsl:value-of select="$pageNum"/> of <xsl:value-of select="$numPages"/>
            <xsl:if test="$pageNum &lt; $numPages">
              - <a href="javascript:config.objects.{$widgetId}.webServiceForm.page.value={$nextPage};config.objects.{$widgetId}.submitForm()">next</a>
            </xsl:if>
          </td>
        </tr>
      </table>
    <dl>
      <xsl:apply-templates select="searchResults/entry"/>
    </dl>
    </form>
    </div>
  </xsl:template>

  <!-- template rule matching source root element -->
  <xsl:template match="entry">
    <xsl:variable name="rowClass">altRow_<xsl:value-of select="position() mod 2"/></xsl:variable>
    <xsl:variable name="capsUrl"><xsl:value-of select="accessUrl"/></xsl:variable>
    <dt class="{$rowClass}">
      <a href="javascript:config.loadModel('{$capabilitiesModel}','{$capsUrl}')">
        <xsl:value-of select="name"/>
      </a>
    </dt>
    <dd class="{$rowClass}"><xsl:value-of select="custodianName"/></dd>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
