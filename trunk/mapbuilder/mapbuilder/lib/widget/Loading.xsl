<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:wmc="http://www.opengis.net/context"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Produce an empty output.
Author:      Cameron Shorter cameron ATshorter.net
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
$Name$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <xsl:param name="lang">en</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <i/>
  </xsl:template>
  
  <xsl:template match="text()|@*"/>

</xsl:stylesheet>

