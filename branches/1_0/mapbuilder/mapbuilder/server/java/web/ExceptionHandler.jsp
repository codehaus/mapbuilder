<%--***************************************************************************

Filename        :   ERR_ExceptionHandler.jsp

Project         :   CEONet Technology (CT)

Document Type   :   JSP

Purpose         :   Handles all thrown exceptions

Thread Usage    :   Contained



(c) Copyright  2003 Canada Centre for Remote Sensing All Rights Reserved



Author       Date            Issue  Description

M. Adair     21-May-2002     319    Initial Release

***************************************************************************--%>



<%@ page contentType="text/xml; charset=ISO-8859-1" isErrorPage="true" %>

<serviceException>

  <message><%= exception.getMessage() %></message>

</serviceException>

