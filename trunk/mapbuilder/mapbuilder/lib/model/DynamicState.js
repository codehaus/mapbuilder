/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores variables that change dynamically, like the mouse position on a map, and
 * notifies listeners when it changes.
 * This object extends Listener.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @requires Listener
 */
function DynamicState() {

  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 

}
