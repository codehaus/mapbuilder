/*

Netscape 4 Cursor Position Template

Captures the cursor position for Netscape 4 when a mouse event fires and creates an IE 4-style window.event object to store the position.

Source: Webmonkey Code Library
(http://www.hotwired.com/webmonkey/javascript/code_library/)

Author: Nadav Savio
Author Email: nadav@wired.com

Usage: Copy and paste the code into your document.

*/

if(!window.event && window.captureEvents) {
  // set up event capturing for mouse events (add or subtract as desired)
  window.captureEvents(Event.MOUSEOVER|Event.MOUSEOUT|Event.CLICK|Event.DBLCLICK);
  // set window event handlers (add or subtract as desired)
  window.onmouseover = WM_getCursorHandler;
  window.onmouseout = WM_getCursorHandler;
  window.onclick = WM_getCursorHandler;
  window.ondblclick = WM_getCursorHandler;
  // create an object to store the event properties 
  window.event = new Object;
}


function WM_getCursorHandler(e) {
  // set event properties to global vars (add or subtract as desired)
  window.event.clientX = e.pageX;
  window.event.clientY = e.pageY;
  window.event.x = e.layerX;
  window.event.y = e.layerY;
  window.event.screenX = e.screenX;
  window.event.screenY = e.screenY;
  // route the event back to the intended function
  if ( routeEvent(e) == false ) {
    return false;
  } else {
    return true;
  }
}
