/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Functions to render a Predefined Locations select box from a GML document
 * with locations and their coordinates 
 * @constructor
 * @author Tom Kralidis tom.kralidis_at_ec.gc.ca
 * @constructor
 * @requires Sarissa
 * @requires Util
 * @requires Context
 * @param context The Web Map Context which contains the state of this legend.
 * @param name Variable name referencing this Legend object
 * @param node Node from the HTML DOM to insert legend HTML into.
 */

function Locations(context, name, node) {
  this.context=context;
  this.name=name;
  if(node==null){
    node=makeElt("DIV");
    node.style.position="absolute";
    node.style.overflow="auto";
  }
  this.node=node;
  this.locations2Select = new XslProcessor(baseDir+"/widget/locations/Locations2Select.xsl");

  /**
   * Render the predefined locations into select box.
   * This function should be called at startup.
   */
  this.paint=function(){
    s=this.locations2Select.transformNode(this.context.context);
    this.node.innerHTML=s;
  }


  /**
   * Called when the select box selectedIndex changes
   * @param e The event sent to the listener.
   */
  this.hiddenListener=function(e){
    //context.setBoundingBox("40 40 40 40bbox);
  }

  this.context.addHiddenListener(this.hiddenListener);
}


/*
 *
 * $Log$
 * Revision 1.4  2004/04/03 11:15:50  camerons
 * Use global baseDir variable
 *
 * Revision 1.3  2004/04/03 10:29:49  camerons
 * WidgetBase.js now loaded when Widget scripts are loaded
 *
 * Revision 1.2  2004/02/27 14:06:00  tomkralidis
 * Updates to handle Locations object
 *
 * Revision 1.1  2004/02/26 19:02:53  tomkralidis
 * Initial add
 *
 *
*/
