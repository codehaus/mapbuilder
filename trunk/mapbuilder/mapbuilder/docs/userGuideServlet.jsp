<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

<html>

<%
  String pageBaseUrl = "http://localhost:8080/mapbuilder/docs/";
  String pageRequest = request.getParameter("page");
  if ( null == pageRequest ) pageRequest = "intro";
  String pageBody = pageBaseUrl + pageRequest + ".html";
  String pageSidebar = pageBaseUrl + "sidebar.html";
  String pageBanner = pageBaseUrl + "banner.html";
  String pageFooter = pageBaseUrl + "footer.html";
  String pageConfig = "/mapbuilder/docs/" + pageRequest + ".xml";
%>

<head>
<title>Mapbuilder User Guide</title>
<link rel='StyleSheet' type='text/css' href='/mapbuilder/docs/userGuide.css'>

<%
  if ( pageRequest.startsWith("samples/tutorial") ) {
%>
    <script>
      // URL of Mapbuilder configuration file.
      var mbConfigUrl='<%= pageConfig %>';
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
      <c:import url="<%= pageSidebar %>"/>
    </td>

    <td width="10"><img src="/mapbuilder/lib/skin/default/images/Spacer.gif"></td>  <!-- gutter -->

    <td width="630" valign="top">
      <a name="snav"></a>

      <div > 

        <%
          if ( pageRequest.startsWith("samples/tutorial") ) {
        %>
        <div style="width:100%; font-size:80%; text-align:right; margin:0">
          <a href="view-source:<%= pageBody %>" target="HtmlSrcWin">view source</a> | <a href="<%= pageConfig %>" target="ConfigSrcWin">config file</a>
        </div>
        <% } %>
      </div>

      <c:import url="<%= pageBody %>"/>

      <c:import url="<%= pageFooter %>"/>

    </td>

  </tr>
</table>

</body>
</html>
