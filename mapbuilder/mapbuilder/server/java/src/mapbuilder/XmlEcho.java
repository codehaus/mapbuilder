/******************************************************************

Filename: XmlSerializer.java

Document Type: Java servlet

Purpose: This servlet will write the body content of a request to a file.

 *        The file name is returned as the response.

 *        Set the output directory as servlet init-param in web.xml

 

License: GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$

**************************************************************************/

package mapbuilder;



import java.io.*;

import javax.servlet.*;

import javax.servlet.http.*;



public class XmlEcho extends HttpServlet

{



//---------------------------------------------------------------------------

// Public Methods

//----------------------------------------------------------------------------

  public static final String XML_DECLARATION = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" standalone=\"yes\" ?>";



 /***************************************************************************

  * Initialize variables called when context is initialized

  *

  */

  public void init( ServletConfig config ) throws ServletException

  {

  }



 /***************************************************************************

  * Process the HTTP Get request

  */

  public void doGet( HttpServletRequest request, HttpServletResponse response )

            throws ServletException

  {

    throw new ServletException("XmlSerializer: HTTP GET not supported");

  }// doGet



 /***************************************************************************

  * Process the HTTP Post request

  */

  public void doPost( HttpServletRequest request,

                      HttpServletResponse response ) 

                        throws ServletException

  {

    try {

      BufferedReader in = request.getReader();

      PrintWriter resp = response.getWriter();

      response.setContentType("text/xml");



      // Transfer bytes from in to out

      System.err.println("transfering...");

      char[] buf = new char[1 * 1024];

      int len;

      while ((len = in.read(buf, 0, buf.length)) != -1) {

        System.err.println("line:"+new String(buf));

        resp.print(buf);

      }

      System.err.println("...done.");

      

    } catch (IOException e) {

      throw new ServletException(e);

    }    

  } // doPost



}

