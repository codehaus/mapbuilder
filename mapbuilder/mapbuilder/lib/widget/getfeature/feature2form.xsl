<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" version="1.0">

<!--==============================================================================-->
<!--
Description: Convert a GML Feature or FeatureCollection into a HTML form.

Author:      Cameron Shorter cameron @shorter.net

Licence:     This library is free software; you can redistribute it and/or
             modify it under the terms of the GNU Lesser General Public
             License as published by the Free Software Foundation;
             version 2.1 of the License.

             This library is distributed in the hope that it will be useful,
             but WITHOUT ANY WARRANTY; without even the implied warranty of
             MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
             Lesser General Public License for more details.

$Id$
$Name$
==================================================================================-->

  <xsl:output method="html" encoding="utf-8"/>


  <!--============================================================================-->
  <!-- Parameters passed into this xsl                                            -->
  <!--============================================================================-->
  <xsl:param name="space" select='""'/>
  <xsl:param name="tabwidth" select='"_ "'/>

  <!--============================================================================-->
  <!-- Main html                                                                  -->
  <!--============================================================================-->
  <xsl:template match="/">
    <html>
      <head>
        <title>Feature Entry - Community Map Builder</title>
      </head>
      <body>
        <h1>Feature Entry - Community Map Builder</h1>
        <form>
          <table border="1" cellpadding="0" cellspacing="0">
            <xsl:apply-templates/>
          </table>
        </form>
      </body>
    </html>
  </xsl:template>

  <!--============================================================================-->
  <!-- All nodes                                                                  -->
  <!--============================================================================-->
  <xsl:template match="*">
    <xsl:param name="tab"/>

    <tr>
      <xsl:if test="text()">
        <td>
          <xsl:value-of select="$tab"/>
          <xsl:value-of select="name(.)"/>
        </td>
        <td>
          <input
            type="text"
            name="_href_"
            onchange="updateAttribute(
              '/generconfig/nodeset/node',
              'href',
              document.data._href_.value)"
            size="40"
            value="{text()}"/>
        </td>
        <xsl:apply-templates>
          <xsl:with-param name="tab">
            <xsl:value-of select="$tab"/>
            <xsl:value-of select="$tabwidth"/>
          </xsl:with-param>
        </xsl:apply-templates>
      </xsl:if>
      <xsl:if test="not(text())">
        <td>
          <xsl:value-of select="$tab"/>
          <b><xsl:value-of select="name(.)"/></b>
        </td>
        <td><xsl:value-of select="$space"/></td>
        <xsl:apply-templates>
          <xsl:with-param name="tab">
            <xsl:value-of select="$tab"/>
            <xsl:value-of select="$tabwidth"/>
          </xsl:with-param>
        </xsl:apply-templates>
      </xsl:if>
    </tr>
  </xsl:template>

  <!--============================================================================-->
  <!-- Remove documentation, text, comments                                       -->
  <!--============================================================================-->
  <xsl:template match="comment()|text()|processing-instruction()">
  </xsl:template>

</xsl:stylesheet>

