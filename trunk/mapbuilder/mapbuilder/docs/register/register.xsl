<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: Build a HTML page from Mapbuilder Components XML.
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
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>

  <!-- Widget -->
  <xsl:template match="mb:Widget">
    <xsl:variable
      name="widgetName"
      select="mb:name"/>
    <xsl:variable
      name="componentType"
      select="substring-after(document('../../lib/schemas/config.xsd')//xs:element[@name=$widgetName]/@type,':')"/>

    <h2>Widget <xsl:value-of select="mb:name"/></h2>
    <ul>
      <p>
        <!-- Print component description -->
        <xsl:apply-templates select="document('../../lib/schemas/config.xsd')//xs:complexType[@name=$componentType]/xs:annotation/xs:documentation"/>
      </p>
      <xsl:apply-templates select="mb:examples"/>
    </ul>
  </xsl:template>

  <!-- complex type-->
  <xsl:template match="xs:complexType">
    <i>ComplexType:<xsl:value-of select="."/></i>
  </xsl:template>

  <!-- Schema documentation -->
  <xsl:template match="xs:documentation">
    <i><xsl:value-of select="."/></i>
  </xsl:template>

  <!-- examples -->
  <xsl:template match="mb:examples">
    <table border="1">
      <caption><b><xsl:value-of select="../mb:name"/> Examples</b></caption>
      <tr>
        <th>Description</th>
        <th>Example</th>
        <th>HTML snippet</th>
        <th>Config snippet</th>
      </tr>
      <xsl:apply-templates select="mb:Example"/>
    </table>
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
 
  <!-- Unmatched XML is not copied -->
  <!--xsl:template match="*|@*|comment()|processing-instruction()|text()"/-->

</xsl:stylesheet>
