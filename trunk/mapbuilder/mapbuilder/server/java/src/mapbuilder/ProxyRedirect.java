/******************************************************************

Filename: ProxyRedirect.java

Document Type: Java servlet

Purpose: This servlet will write the body content of a request to a file.

 *        The file name is returned as the response.

 *        Set the output directory as servlet init-param in web.xml

 

License: GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$

**************************************************************************/

package mapbuilder;



import java.io.*;

import java.util.*;

import javax.servlet.*;

import javax.servlet.http.*;

import org.apache.commons.httpclient.*;

import org.apache.commons.httpclient.methods.PostMethod;

import org.apache.commons.httpclient.methods.GetMethod;





public class ProxyRedirect extends HttpServlet

{



//---------------------------------------------------------------------------

// Public Methods

//----------------------------------------------------------------------------

  public String outputDir_ = null;

  public ServletContext context_ = null;

  public static final String XML_DECLARATION = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" standalone=\"yes\" ?>";



 /***************************************************************************

  * Initialize variables called when context is initialized

  *

  */

  public void init( ServletConfig config ) throws ServletException

  {

    super.init( config );

    outputDir_ = config.getInitParameter( "outputDir" );

    context_ = config.getServletContext();

  }



 /***************************************************************************

  * Process the HTTP Get request

  */

  public void doGet( HttpServletRequest request, HttpServletResponse response )

            throws ServletException

  {

    try {

      Enumeration e = request.getHeaderNames();

      while (e.hasMoreElements()) {

          String name = (String)e.nextElement();

          String value = request.getHeader(name);

          System.err.println("request header:" + name + ":" + value);

      }

        

      // Transfer bytes from in to out

      System.err.println("HTTP GET: transferring...");

      

      //execute the GET

      String serverUrl = request.getParameter("url");

      System.err.print("params:" + serverUrl);

      HttpClient client = new HttpClient();

      GetMethod httpget = new GetMethod(serverUrl);

      client.executeMethod(httpget);



      //dump response to out

      if (httpget.getStatusCode() == HttpStatus.SC_OK) {

        String responseBody = httpget.getResponseBodyAsString();

        System.err.println("responseBody:" + responseBody);

        PrintWriter out = response.getWriter();

        out.print( responseBody );

      } else {

        System.err.println("Unexpected failure: " + httpget.getStatusLine().toString());

      }

      httpget.releaseConnection();

      

     

    } catch (IOException e) {

      throw new ServletException(e);

    }    

  }// doGet



 /***************************************************************************

  * Process the HTTP Post request

  */

  public void doPost( HttpServletRequest request,

                      HttpServletResponse response ) 

                        throws ServletException

  {

    try {

      Enumeration e = request.getHeaderNames();

      while (e.hasMoreElements()) {

          String name = (String)e.nextElement();

          String value = request.getHeader(name);

          System.err.println("request header:" + name + ":" + value);

      }

        

      // Transfer bytes from in to out

      System.err.println("transfering...");

      PrintWriter out = response.getWriter();

      ServletInputStream in = request.getInputStream();

      

      HttpClient client = new HttpClient();



      String serverUrl = request.getHeader("serverUrl");

      PostMethod httppost = new PostMethod(serverUrl);



      httppost.setRequestBody(in);

      //httppost.setRequestContentLength(PostMethod.CONTENT_LENGTH_CHUNKED);



      client.executeMethod(httppost);



      if (httppost.getStatusCode() == HttpStatus.SC_OK) {

        String responseBody = httppost.getResponseBodyAsString();

        System.err.println("responseBody:" + responseBody);

        out.print( responseBody );

      } else {

        System.err.println("Unexpected failure: " + httppost.getStatusLine().toString());

      }

      httppost.releaseConnection();

      

     

    } catch (IOException e) {

      throw new ServletException(e);

    }    

  } // doPost



}

