/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Listener class that is instanciated by all objects which provide
 * event listeners.
 * @constructor
 * @author Cameron Shorter
 */
function Listener() {
  /** An array [variables] of (listener, target). */
  this.listeners=new Array();

  /**
   * An array [variables] of values. These values might not be used if the set/get
   * functions are overwritten.
   */
  this.values=new Array();

  /**
   * Add a listener function which will be called when variable is updated;  The
   * listener function should be of the form: function listener(target) {..}
   * @param listener The function to call when the Area Of Interest changes.
   * @param target The object which owns the listener function.
   * @param variable Variable name; if this variable changes then an event is
   * sent to all interested listeners.
   */
  this.addListener(variable, listener, target) {
    this.listeners[variable].push(new Array(listener,target));
  }

  /**
   * Update variable and call all interested listeners.  This function may
   * be overloaded to store the variable in a elsewhere (eg in an XML
   * document).
   */
  this.setVariable(variable,value) {
    this.variables[variable] = value;

  // Call all the interested listeners
  if (this.listeners[variable]){
    for(var i=0;i<this.listeners[variable].length;i++){
      this.listeners[variable][i][0](this.listeners[i][1]);
    }
  }

  /**
   * Return the variable value, or return null if it does not exist.  This
   * function may be overloaded to store the variable elsewhere (eg in
   * an XML document).
   */
  this.getVariable(variable) {
    return this.variables[variable][0];
  }
}
