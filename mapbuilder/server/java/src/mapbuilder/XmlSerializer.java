/******************************************************************

Filename: XmlSerializer.java

Document Type: Java servlet

Purpose: This servlet will write the body content of a request to a file.

 *        The file name is returned as the response.

 *        Set the output directory as servlet init-param in web.xml

 

License: LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$

**************************************************************************/

package mapbuilder;



import java.io.*;

import java.util.*;

import javax.servlet.*;

import javax.servlet.http.*;



// import log4j packages

import org.apache.log4j.Logger;

import org.apache.log4j.PropertyConfigurator;



public class XmlSerializer extends HttpServlet

{



	private final static Logger log =	Logger.getLogger(XmlSerializer.class);

  

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

    context_ = config.getServletContext();

    log.info("mapbuilder.XmlSerializer: context initialized to:" + context_.getServletContextName());

    outputDir_ = config.getInitParameter( "outputDir" );

    log.info("mapbuilder.XmlSerializer: outputDir initialized to:" + context_.getRealPath( outputDir_) );

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

      File dstDir = new File( context_.getRealPath( outputDir_ ) );

      File dst = File.createTempFile("cmb", ".xml", dstDir);

      //System.err.println("absolutePath:"+dst.getName());



      BufferedWriter out = new BufferedWriter(new FileWriter(dst));



      if (log.isDebugEnabled()) {

        Enumeration e = request.getHeaderNames();

        while (e.hasMoreElements()) {

          String name = (String)e.nextElement();

          String value = request.getHeader(name);

          log.debug("request header:" + name + ":" + value);

        }

      }

        

      // Transfer bytes from in to out

      log.debug("xmlSerializer transfering...");

      BufferedReader in = request.getReader();

      // Read and write 4K chars at a time

      // (Far more efficient than reading and writing a line at a time)

      //also, for some reason the above code does not work in some cases (buffer too small?)

      char[] buf = new char[1 * 1024];  // 1Kchar buffer

      int len;

      while ((len = in.read(buf, 0, buf.length)) != -1) {

        log.debug("line:"+new String(buf));

        out.write(buf, 0, len);

        out.flush();

      }

      in.close();  

      out.close();  

      log.debug("...done.");

      

      PrintWriter resp = response.getWriter();

      response.setContentType("text/xml");

      resp.println(XML_DECLARATION);

      resp.println("<XmlSerializer xmlns:xlink=\"http://www.w3.org/1999/xlink\">");

      resp.print("  <OnlineResource xlink:type=\"simple\" xlink:href=\"");

      resp.print( request.getContextPath() + outputDir_ + "/" + dst.getName() );

      resp.println("\"/>");

      resp.println("</XmlSerializer>");

      

    } catch (IOException e) {

      throw new ServletException(e);

    }    

  } // doPost



}

