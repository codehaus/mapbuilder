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
  /** An array [params] of (listener, target). */
  this.listeners=new Array();

  /**
   * An array [params] of values. These values might not be used if the set/get
   * functions are overwritten.
   */
  this.values=new Array();

  /**
   * Add a listener function which will be called when param is updated;  The
   * listener function should usually be: paint(target).
   * @param listener The function to call when the parameter changes.
   * @param target The object which owns the listener function.
   * @param param Parameter name; if this parameter changes then an event is
   * sent to all interested listeners.
   */
  this.addListener=function(param, listener, target) {
    if(!this.listeners[param]){
      this.listeners[param]=new Array();
    }
    this.listeners[param].push(new Array(listener,target));
  }

  /**
   * Call all the listeners that have registered interest in this parameter
   * using addListener.
   * @param param The parameter that has changed.
   * @param value The new parameter value.
   */
  this.callListeners=function(param,value) {
    if (this.listeners[param]){
      for(var i=0;i<this.listeners[param].length;i++){
        // listener(target,value);
        this.listeners[param][i][0](this.listeners[param][i][1],value);
      }
    }
  }

  /**
   * Update parameter and call all interested listeners.  This function may
   * be overloaded to store the parameter in a elsewhere (eg in an XML
   * document).
   * @param param The parameter to change.
   * @parma value The new value of the param.
   */
  this.setParam=function(param,value) {
    this.values[param] = value;

    // Call all the interested listeners
    this.callListeners(param,value);
  }

  /**
   * Return the param value, or return null if it does not exist.  This
   * function may be overloaded to store the param elsewhere (eg in
   * an XML document).
   */
  this.getParam=function(param) {
    return this.values[param];
  }
}
