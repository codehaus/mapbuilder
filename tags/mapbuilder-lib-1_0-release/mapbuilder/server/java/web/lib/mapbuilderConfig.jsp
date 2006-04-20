<%@ page contentType="text/xml" %>



<MapbuilderConfig 

    xmlns="http://mapbuilder.sourceforge.net/mapbuilder" 

    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 

    xsi:schemaLocation="http://mapbuilder.sourceforge.net/mapbuilder ..//mapbuilder/lib/schemas/config.xsd"

    version="0.2.1" id="referenceTemplate" >

  <!--

    Description: This configuration file sets server level configuration parameters

                 for the proxyUrl and the serailizeUrl

    Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html 



    $Id$

  -->

  <!-- Url of LOCAL redirection script, required to access external URLs -->

  <proxyUrl><%= request.getContextPath() %>/proxy</proxyUrl>

  <serializeUrl><%= request.getContextPath() %>/writeXml</serializeUrl>

</MapbuilderConfig>

