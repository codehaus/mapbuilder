<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>

<%
  String pageRequest = request.getParameter("page");
  if ( null == pageRequest ) pageRequest = "intro";
%>

<head>
<title>Mapbuilder User Guide</title>
<link rel='StyleSheet' type='text/css' href='/mapbuilder/docs/userGuide.css'>

<SCRIPT>
  function doLoad() {//defaults to a no-op}
</script>

<%
  if ( pageRequest.startsWith("samples/tutorial") ) {
%>
<SCRIPT>
//<!-- hide script from old browsers

<script>
  // URL of Mapbuilder configuration file.
  var mbConfigUrl='<%= pageRequest %>.xml';
  var mapbuilder;
  var config;
  var mbTimerId;

  /**
   * Initialise Mapbuilder if script has been loaded, else wait to be called
   * again.
   */
  function mapbuilderInit(){
    if(mapbuilder && mapbuilder.loadState==MB_LOADED){
      clearInterval(mbTimerId);
      config.init();
    }
  }

  function doLoad() {
    mbTimerId = setInterval('mapbuilderInit()',100);
  }

//-->
</script>
<% } %>

<script type="text/javascript" src="/mapbuilder/lib/Mapbuilder.js"></script>
</SCRIPT>

</head>

<BODY ONLOAD='doLoad()'>  

<table width="800" border="0" cellspacing="0" cellpadding="0" summary="Table used for page layout">

  <tr>
    <td colspan="3">
        <h1>site banner here</h1>
    </td>  
  </tr>

  <tr>
    <td width="160" valign="top">
      <jsp:include page="sidebar.html" flush="true" />
    </td>

    <td width="10"><img src="/mapbuilder/lib/skin/default/images/Spacer.gif"></td>  <!-- gutter -->

    <td width="630" valign="top">
      <a name="snav"></a>

      <div > 
        <H1>Mapbuilder User Guide</H1>

        <%
          if ( pageRequest.startsWith("samples/tutorial") ) {
        %>
        <span style="font-size: 80%; float: left">
          view source | <a href="<%= pageRequest %>.xml" target="ConfigSrcWin">config file</a>
        </span>
        <% } %>
        <span style="font-size: 80%; float: right">Prototype</span>
      </div>

      <jsp:include page="<%= pageRequest %>" flush="true" />

      <jsp:include page="footer.html" flush="true"/>

    </td>

  </tr>
</table>

</BODY>
</HTML>