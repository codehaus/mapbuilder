<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: Build a HTML register of components from a Mapbuilder
             Config file.
             Descriptions for the components are extracted from the
             config.xsd schema document.
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xsl:output method="html"/>

  <!-- Root node.  -->
  <xsl:template match="/">
    <html>
      <head>
        <title>Mapbuilder Components Register</title>

        <link rel="stylesheet" href="../../lib/skin/default/html.css" type="text/css"/>

        <script>
          // URL of Mapbuilder configuration file.
          var mbConfigUrl='config.xml';
        </script>
        <script type="text/javascript" src="../../lib/Mapbuilder.js"></script>
      </head>

      <body onload="mbDoLoad()">
        <h1>Mapbuilder Components Register</h1>
        <xsl:apply-templates select="//mb:widgets/*"/>
      </body>
    </html>
  </xsl:template>

  <!-- Widget -->
  <xsl:template match="mb:widgets/*">
    <xsl:variable
      name="widgetName"
      select="name(.)"/>
    <xsl:variable
      name="componentType"
      select="substring-after(document('../../lib/schemas/config.xsd')//xs:element[@name=$widgetName]/@type,':')"/>

    <h2><xsl:value-of select="name(.)"/> Widget</h2>
    <ul>
      <table border="1">
        <tr>
          <th>Description</th>
          <td>
            <p>
              <!-- Print component description -->
              <xsl:apply-templates select="document('../../lib/schemas/config.xsd')//xs:complexType[@name=$componentType]/xs:annotation/xs:documentation"/>
            </p>

          </td>
        </tr>
        <xsl:if test="mb:stylesheet">
          <tr>
            <th>Stylesheet</th>
            <td><xsl:value-of select="mb:stylesheet"/></td>
          </tr>
        </xsl:if>
        <tr>
          <th>Example</th>
          <td>
            <div>
              <xsl:attribute name="id">
                <xsl:choose>
                  <xsl:when test="mb:htmlTagId">
                    <xsl:value-of select="mb:htmlTagId"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="@id"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
            </div>
          </td>
        </tr>
      </table>
    </ul>
  </xsl:template>
  <!-- Example -->
  <xsl:template match="mb:Example">
    <tr>
      <td>
        <h3><xsl:value-of select="mb:title"/></h3>
        <p><xsl:value-of select="mb:description"/></p>
      </td>
      <td>
        <div>
          <xsl:attribute name="id">
            <xsl:value-of select="mb:divId"/>
          </xsl:attribute>
        </div>
      </td>
      <td><xsl:value-of select="mb:html"/></td>
      <td><xsl:value-of select="mb:configSnippet"/></td>
    </tr>
  </xsl:template>

  <!-- complex type-->
  <xsl:template match="xs:complexType">
    <i>ComplexType:<xsl:value-of select="."/></i>
  </xsl:template>

  <!-- Schema documentation -->
  <xsl:template match="xs:documentation">
    <i><xsl:value-of select="."/></i>
  </xsl:template>

 
</xsl:stylesheet>
