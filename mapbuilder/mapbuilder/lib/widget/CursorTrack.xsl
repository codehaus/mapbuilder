<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the cursor coordinates
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName"/>

  <!-- Main html -->
  <xsl:template match="/">
    <FORM NAME="{$formName}" ID="{$formName}" STYLE="font: 8pt Verdana, geneva, arial, sans-serif;">
      long: <input NAME="longitude" TYPE="text" SIZE="6" STYLE="border: 0px blue none; font: 8pt Verdana, geneva, arial, sans-serif;"/>
         
      lat: <input NAME="latitude" TYPE="text" SIZE="6" STYLE="border: 0px blue none; font: 8pt Verdana, geneva, arial, sans-serif;"/>
    </FORM>
  </xsl:template>

</xsl:stylesheet>
