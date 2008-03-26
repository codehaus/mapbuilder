var id;
var model;

var outputNode;
 var movedNode;
 
function initSortableList(widgetId,targetId)
{
/////////////////////////////////variable a initialiser
	 id=widgetId;
  model=targetId;
 ///////////////////////// 
  var LIs = document.getElementById(id).getElementsByTagName("li");

  for (var i = 0; i < LIs.length; i++)
  {
    attachEventListener(LIs[i], "mousedown", mousedownSortableList, false);
    LIs[i].style.cursor = "move";
  }
}

function mousedownSortableList(event)
{

  if (typeof event == "undefined")
  {
    event = window.event;
  }
  
  if (typeof event.pageY == "undefined")
  {
    event.pageY = event.clientY + getScrollingPosition()[1];
  }

  var target = getEventTarget(event);

  while (target.nodeName.toLowerCase() != "li")
  {
    target = target.parentNode;
  }

  document.currentTarget = target;

  target.clickOriginY = event.pageY;

  attachEventListener(document, "mousemove", mousemoveCheckThresholdList, false);
  attachEventListener(document, "mouseup", mouseupCancelThresholdList, false);

  stopDefaultAction(event);

  return true;
}

function mousemoveCheckThresholdList(event)
{
  if (typeof event == "undefined")
  {
    event = window.event;
  }
  
  if (typeof event.pageY == "undefined")
  {
    event.pageY = event.clientY + getScrollingPosition()[1];
  }

  var target = document.currentTarget;

  if (Math.abs(target.clickOriginY - event.pageY) > 3)
  
  {
    if (typeof document.selection != "undefined")
    {
      var textRange = document.selection.createRange();
      textRange.collapse();
      textRange.select();
    }

    detachEventListener(document, "mousemove", mousemoveCheckThresholdList, false);
    detachEventListener(document, "mouseup", mouseupCancelThresholdList, false);

    attachEventListener(document, "mousemove", mousemoveSortableList, false);
    attachEventListener(document, "mouseup", mouseupSortableList, false);

    var cloneItem = target.cloneNode(true);
    cloneItem.setAttribute("class", "clone");
    cloneItem.style.position = "absolute";
      ///////////////////////////////retrait de -26 car bug dans la fonction getPosition
    cloneItem.style.top = target.offsetTop + "px";
    //alert(cloneItem.style.top);
    cloneItem.differenceY = parseInt(cloneItem.style.top) - event.pageY ;
	///alert(event.pageY);
    cloneItem = target.parentNode.appendChild(cloneItem);
	//cloneItem = target.parentNode.parentNode.appendChild(cloneItem);
	
    target.clone = cloneItem;
    target.style.visibility = "hidden";
  }

  stopDefaultAction(event);

  return true;
}

function mouseupCancelThresholdList()
{
  detachEventListener(document, "mousemove", mousemoveCheckThresholdList, false);
  detachEventListener(document, "mouseup", mouseupCancelThresholdList, false);
  return true;
}

function mousemoveSortableList(event)
{
	outputNode=document.getElementById(config.objects.mainMapWidget.outputNodeId)
 
  if (typeof event == "undefined")
  {
    event = window.event;
  }
  
  if (typeof event.pageY == "undefined")
  {
    event.pageY = event.clientY + getScrollingPosition()[1];

  }

  var target = document.currentTarget;
  var clone = target.clone;
 //  movedNode=document.getElementById("locator_mainMapWidget_"+clone.id);
  var plannedCloneTop = (event.pageY) + clone.differenceY;
  //alert(plannedCloneTop+" "+event.pageY-clone.differenceY);
  var listItems = clone.parentNode.getElementsByTagName("li");
  
    ///////////////////////////////retrait de -26 car bug dans la fonction getPosition
  var firstItemPosition =listItems[0].offsetTop;
  //[getPosition(listItems[0])[0],getPosition(listItems[0])[1]];////////permet de bloquer le drag and drop a la taile de la liste

  //var lastItemPosition = getPosition(listItems[listItems.length - 2]);

var lastItemPosition =listItems[listItems.length - 2].offsetTop;
//[getPosition(listItems[listItems.length - 2])[0],getPosition(listItems[listItems.length - 2])[1]];////////permet de bloquer le drag and drop a la taile de la liste

  if (plannedCloneTop < firstItemPosition)
  {
    plannedCloneTop = firstItemPosition;
  }
  else if (plannedCloneTop > lastItemPosition)
  {
    plannedCloneTop = lastItemPosition;
  }

  clone.style.top = plannedCloneTop + "px";
	
  var LIs = target.parentNode.getElementsByTagName("li");
  //////////////////////////////////modif pour bouger les layer du mappane
 
  //////////////////////////
  var currentItemHigher = true;

  for (var i = 0; i < LIs.length; i++)
  {
    if (LIs[i] != target && LIs[i] != target.clone)
    {
      if (event.pageY < getPosition(LIs[i])[1] + LIs[i].offsetHeight && currentItemHigher)
      {
      
      //	 outputNode.insertBefore(movedNode.nextSibling,movedNode);
        target.parentNode.insertBefore(target, LIs[i]);
       
        if(id=="layerControl"){
        /*config.objects.mainMap.setParam('LayerUp',LIs[i].getAttribute("id"));*/
        //layerUp(LIs[i].getAttribute("id"));
//        alert(movedNode.nextSibling.id+" "+movedNode.id);
       
        
        }
        
      }
      else if (event.pageY > getPosition(LIs[i])[1] && !currentItemHigher)
      {
      
    //  outputNode.insertBefore(movedNode,movedNode.previousSibling);
        target.parentNode.insertBefore(LIs[i], target);
        if(id=="layerControl"){
       // config.objects.mainMap.setParam('LayerDown',LIs[i].getAttribute("id"));
        
      }
      }
    }
    else
    {
      currentItemHigher = false;
    }
  }

  stopDefaultAction(event);

  return true;
}

function mouseupSortableList()
{
  var target = document.currentTarget;
  var clone = target.clone;

  clone.parentNode.removeChild(clone);

  target.style.visibility = "visible";

  detachEventListener(document, "mousemove", mousemoveSortableList, false);
  detachEventListener(document, "mouseup", mouseupSortableList, false);

  return true;
}

function addLoadListener(fn)
{
  if (typeof window.addEventListener != 'undefined')
  {
    window.addEventListener('load', fn, false);
  }
  else if (typeof document.addEventListener != 'undefined')
  {
    document.addEventListener('load', fn, false);
  }
  else if (typeof window.attachEvent != 'undefined')
  {
    window.attachEvent('onload', fn);
  }
  else
  {
    var oldfn = window.onload;
    if (typeof window.onload != 'function')
    {
      window.onload = fn;
    }
    else
    {
      window.onload = function()
      {
        oldfn();
        fn();
      };
    }
  }
}

function attachEventListener(target, eventType, functionRef, capture)
{
  if (typeof target.addEventListener != "undefined")
  {
    target.addEventListener(eventType, functionRef, capture);
  }
  else if (typeof target.attachEvent != "undefined")
  {
    target.attachEvent("on" + eventType, functionRef);
  }
  else
  {
    eventType = "on" + eventType;

    if (typeof target[eventType] == "function")
    {
      var oldListener = target[eventType];

      target[eventType] = function()
      {
        oldListener();

        return functionRef();
      }
    }
    else
    {
      target[eventType] = functionRef;
    }
  }

  return true;
}

function detachEventListener(target, eventType, functionRef, capture)
{
  if (typeof target.removeEventListener != "undefined")
  {
    target.removeEventListener(eventType, functionRef, capture)
  }
  else if (typeof target.detachEvent != "undefined")
  {
    target.detachEvent("on" + eventType, functionRef);
  }
  else
  {
    target["on" + eventType] = null;
  }

  return true;
}

function getEventTarget(event)
{
  var targetElement = null;

  if (typeof event.target != "undefined")
  {
    targetElement = event.target;
  }
  else
  {
    targetElement = event.srcElement;
  }

  while (targetElement.nodeType == 3 && targetElement.parentNode != null)
  {
    targetElement = targetElement.parentNode;
  }

  return targetElement;
}

function stopDefaultAction(event)
{
  event.returnValue = false;

  if (typeof event.preventDefault != "undefined")
  {
    event.preventDefault();
  }

  return true;
}

function getScrollingPosition()
{
  //array for X and Y scroll position
  var position = [0, 0];

  //if the window.pageYOffset property is supported
  if (typeof window.pageYOffset != 'undefined')
  {
    //store position values
    position = [
      window.pageXOffset,
      window.pageYOffset
      ];
  }

  //if the documentElement.scrollTop property is supported
  //and the value is greater than zero
  if (typeof document.documentElement.scrollTop != 'undefined'
    && document.documentElement.scrollTop > 0)
  {
    //store position values
    position = [
      document.documentElement.scrollLeft,
      document.documentElement.scrollTop
      ];
  }

  //if the body.scrollTop property is supported
  else if (typeof document.body.scrollTop != 'undefined')
  {
    //store position values
    position = [
      document.body.scrollLeft,
      document.body.scrollTop
      ];
  }

  //return the array
  return position;
}

function getPosition(theElement)
{
  var positionX = 0;
  var positionY = 0;

  while (theElement != null)
  {
    positionX += theElement.offsetLeft;
    positionY += theElement.offsetTop;
    
    theElement = theElement.offsetParent;
   
  }
//positionY +=-26; ////////////ajouut pour enlever le decalage pendant le drag and drop !!!!!!!!!!!!!!!!!!corriger cette fonction
  return [positionX, positionY];
}

function identifyBrowser()
{
  var agent = navigator.userAgent.toLowerCase();

  if (typeof navigator.vendor != "undefined" && navigator.vendor == "KDE" && typeof window.sidebar != "undefined")
  {
    return "kde";
  }
  else if (typeof window.opera != "undefined")
  {
    var version = parseFloat(agent.replace(/.*opera[\/ ]([^ $]+).*/, "$1"));

    if (version >= 7)
    {
      return "opera7";
    }
    else if (version >= 5)
    {
      return "opera5";
    }

    return false;
  }
  else if (typeof document.all != "undefined")
  {
    if (typeof document.getElementById != "undefined")
    {
      var browser = agent.replace(/.*ms(ie[\/ ][^ $]+).*/, "$1").replace(/ /, "");

      if (typeof document.uniqueID != "undefined")
      {
        if (browser.indexOf("5.5") != -1)
        {
          return browser.replace(/(.*5\.5).*/, "$1");
        }
        else
        {
          return browser.replace(/(.*)\..*/, "$1");
        }
      }
      else
      {
        return "ie5mac";
      }
    }

    return false;
  }
  else if (typeof document.getElementById != "undefined")
  {
    if (navigator.vendor.indexOf("Apple Computer, Inc.") != -1)
    {
      if (typeof window.XMLHttpRequest != "undefined")
      {
        return "safari1.2";
      }

      return "safari1";
    }
    else if (agent.indexOf("gecko") != -1)
    {
      return "mozilla";
    }
  }

  return false;
}

function identifyOS()
{
  var agent = navigator.userAgent.toLowerCase();

  if (agent.indexOf("win") != -1)
  {
    return "win";
  }
  else if (agent.indexOf("mac"))
  {
    return "mac";
  }
  else
  {
    return "unix";
  }

  return false;
}