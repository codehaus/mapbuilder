/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) Collection document as defined by the Open 
 * GIS Consortium http://opengis.org and extensions the the WMC.  
 * @constructor
 * @author Mike Adair
 * @requires Sarissa
 * @param url Url of context collection document
 */
function ContextCollection(url) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(url);
  for (sProperty in modelBase) { 
    this[sProperty] = modelBase[sProperty]; 
  }

  /** Insert a new context.
    * @param context An XML node which describes the context.
    * @param zindex The position to insert this context in the contextList, if set
    * to null this context will be inserted at the end.
    * @return The identifier string used to reference this context.
    */
  this.insertContext=function(context,zindex){
    //TBD Fill this in.
  }

  /** Delete this context.
   * @param id The context identifier.
   */
  this.deleteContext=function(id){
    //TBD Fill this in.
  }

  /** Move this context to a new position in the contextList.
    * @param context The context id to move.
    * @param zindex The position to move this context to in the contextList, if set
    * to null this context will be inserted at the end.
    */
  this.reorderContext=function(context,zindex){
    //TBD Fill this in.
  }

  /** Select this context for further operations 
    * @param context The context id to select.
    * @param selected Set to true/false.
    */
  this.selectContext=function(context,selected){
    for(var i=0;i<this.listeners["select"].length;i++) {
      this.listeners["select"][i][0](context,this.listeners["select"][i][1]);
    }
  }

}
