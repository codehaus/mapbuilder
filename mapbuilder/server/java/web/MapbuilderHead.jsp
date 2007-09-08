<%@ page contentType="text/html" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>



<script>

  var mbTimerStart = new Date();

</script>



<c:set var="baseDir" value="/mapbuilder/lib"/>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/MapbuilderServerLoad.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/util/sarissa/Sarissa.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/util/Util.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/util/Listener.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/model/ModelBase.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/model/Config.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/widget/WidgetBase.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/tool/ToolBase.js"></script>



<script type="text/javascript" src="<c:out value='${baseDir}'/>/util/wz_jsgraphics/wz_jsgraphics.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/widget/MapContainerBase.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/widget/ButtonBase.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/widget/EditButtonBase.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/tool/Extent.js"></script>

<script type="text/javascript" src="<c:out value='${baseDir}'/>/model/Proj.js"></script>



<c:import url="${requestScope.mbConfigUrl}" var="xmlDoc"/>

<c:import url="/lib/LoadScripts.xsl" var="xslDoc"/>



<x:transform doc="${xmlDoc}" xslt="${xslDoc}" />



<script>

  // URL of Mapbuilder configuration file.

  var mbConfigUrl='/mapbuilder<c:out value="${requestScope.mbConfigUrl}"/>';

  var language='<c:out value="${param.language}" default="en"/>';



  /// the global config object

  var config = new Config(mbConfigUrl);

</script>



