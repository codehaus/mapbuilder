<?xml version="1.0" encoding="ISO-8859-1"?>
<!--
Description: Build a HTML page from Mapbuilder Components XML.
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id$
$Name$
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder">

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
    <h2>Widget <xsl:value-of select="mb:name"/></h2>
    <ul>
      <p><xsl:value-of select="mb:description"/></p>
      <xsl:apply-templates select="mb:examples"/>
    </ul>
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
