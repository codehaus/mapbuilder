/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: PlaceNameForm.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/FormBase.js");

/**
 * Widget to display the AOI box coordinates
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function PlaceNameForm(widgetNode, model) {
  FormBase.apply(this,new Array(widgetNode, model));

  //
  var featureTypeName = widgetNode.selectSingleNode("mb:featureTypeName");
  if ( featureTypeName ) {
    this.featureTypeName = featureTypeName.firstChild.nodeValue;
  } else {
    alert("PlaceNameForm: featureTypeName must be specified in config");
  }

}

/**
 * Handles submission of the form (via javascript in an <a> tag)
 */
PlaceNameForm.prototype.submitForm = function() {
  var thisWidget = this.parentWidget;
  var form = document.getElementById(thisWidget.formName);
  switch(thisWidget.featureTypeName) {
    case "topp:gnis":
      thisWidget.setValue('/Filter/And/PropertyIsLike[PropertyName=\'topp:full_name_lc\']/Literal',form.place.value.toLowerCase()+'*');
      thisWidget.setValue('/Filter/And/PropertyIsLike[PropertyName=\'topp:country_name\']/Literal',uppercaseFirstChars(form.country.value)+'*');
      break;
    case "GEONAMES":
      var literal = form.place.value.toUpperCase();
      literal = literal.replace(/[\~\!\@\#\$\%\^\&\*\(\)\_\-\{\}\[\]\=\\\|\;\:\'\"\,\.\<\>\?]/g,"*");
      literal = literal.replace(/[\xc0\xc1\xc2\xc3\xc4\xc5]/g,"A");
      literal = literal.replace(/[\xc8\xc9\xca\xcb]/g,"E");
      literal = literal.replace(/[\xcc\xcd\xce\xcf]/g,"I");
      literal = literal.replace(/[\xd2\xd3\xd4\xd5\xd6\xd7\xd8]/g,"O");
      literal = literal.replace(/[\xc7]/g,"C");
      thisWidget.setValue('/Filter/PropertyIsLike[PropertyName=\'NAME_KEY\']/Literal',literal+'*');
      break;
  }

  thisWidget.targetModel.setParam("wfs_GetFeature",thisWidget.featureTypeName);
  return false;
}

function roundNumber(myNumber, numPlaces) {
   return Math.round(myNumber*Math.pow(10,numPlaces))/Math.pow(10,numPlaces);
}

/**
 *
 * @param
 */
setCoords = function(coords, myForm) {
   coordLong = 0;
   coordLat = 0;
   coordArray = coords.split(',');
   placeType = coordArray[2];
   if ( placeType == 'canadian' ) {
      coordLong = coordArray[0];
      coordLat = coordArray[1]
   } else if ( placeType == 'international' ) {
      coordLong = coordArray[1];
      coordLat = coordArray[0]
   }
   myForm.coordLat.value = roundNumber(coordLat,2);
   myForm.coordLong.value = roundNumber(coordLong,2);
}

/**
 * Capitalizes the first letter in each word of the string passed in and lowercases the rest of the word.
 * Example:
 * fort st john = Fort St John
 * FORT ST JOHN = Fort St John
 */
function uppercaseFirstChars(str)
{
	var strA = str.split(" ");
	var newStr = "";
	for (var i=0; i < strA.length; i++)
	{
		var word = strA[i].charAt(0).toUpperCase() + strA[i].substr(1).toLowerCase();
		newStr = newStr + word + " ";
	}
	return newStr = newStr.substring(0, newStr.length-1);	// remove the end space
}
