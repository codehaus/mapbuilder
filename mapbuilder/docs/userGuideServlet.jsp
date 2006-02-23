<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<%@ page contentType="text/html" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>

<%
  String pageRequest = request.getParameter("page");
  if ( null == pageRequest ) pageRequest = "intro";
  request.setAttribute("page", pageRequest);
  request.setAttribute("mbConfigUrl", "/mapbuilder/docs/" + pageRequest + ".xml");
%>

<head>
<title>Mapbuilder User Guide</title>
<link rel='StyleSheet' type='text/css' href='/mapbuilder/docs/userGuide.css'>

<%
  if ( pageRequest.startsWith("samples/tutorial") ) {
%>
    <script>
      // URL of Mapbuilder configuration file.
      var mbConfigUrl='<%= request.getAttribute("mbConfigUrl") %>';
      //var language="fr";
    </script>
    <script type="text/javascript" src="/mapbuilder/lib/Mapbuilder.js"></script>
</head>
<body onload='mbDoLoad()'>  
<% } else { %>

</head>
<body>
<% } %>

<table width="800" border="0" cellspacing="0" cellpadding="0" summary="Table used for page layout">

  <tr>
    <td colspan="3">
        <h1>Mapbuilder User Guide</h1>
    </td>  
  </tr>

  <tr>
    <td width="160" valign="top">
      <c:import url="/docs/sidebar.html"/>
    </td>

    <td width="10"><img src="/mapbuilder/lib/skin/default/images/Spacer.gif"></td>  <!-- gutter -->

    <td width="630" valign="top">
      <a name="snav"></a>

      <div > 

        <c:set var="pageBody" value="/docs/${requestScope.page}.html"/>

        <c:if test="${fn:startsWith(requestScope.page, 'samples/tutorial')}">        
          <div style="width:100%; font-size:80%; text-align:right; margin:0">
            <a href='view-source:http://localhost:8080/mapbuilder/docs/<c:out value="${requestScope.page}"/>.html' target="HtmlSrcWin">view source</a> | <a href='<c:out value="${requestScope.mbConfigUrl}"/>' target="ConfigSrcWin">config file</a>
          </div>
        </c:if>
      </div>

      <c:import url="${pageBody}"/>

      <c:import url="/docs/footer.html"/>

    </td>

  </tr>
</table>

</body>
</html>
