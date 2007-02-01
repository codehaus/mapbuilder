/*
JavaScript Scalebar for MapServer (scalebar.js)

Copyright (c) 2005 Tim Schaub of CommEn Space (http://www.commenspace.org)

This is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the
Free Software Foundation; either version 2.1 of the License, or (at
your option) any later version.

This software is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this software; if not, write to the Free Software Foundation,
Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

v1.3 - scalebar is now centered on .sbWrapper div by default, more css control
     - reduced likelihood of displaying very large numbers
     - added condition to deal with @import styles (thanks dokai)

*/
/*
adapted from http://mapserver.commenspace.org/tools/scalebar/

$Id: MapScaleBar.js 2511 2007-01-05 11:55:23Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display the scale of a map as a graphical bar.  The model of this widget
 * must have an extent object associated with it which is the case when the 
 * model has a MapContanier widget.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function MapScaleBar(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

	// default properties
	// may be modified after construction
	// if modified after ScaleBar.place(), use ScaleBar.update()
	this.scaleDenominator = 1;    //this will get updated on the first paint

	this.displaySystem = 'metric'; // metric or english supported
  var displaySystem = widgetNode.selectSingleNode("mb:displaySystem");
  if (displaySystem) this.displaySystem = displaySystem.firstChild.nodeValue;

	this.minWidth = 100; // pixels
  var minWidth = widgetNode.selectSingleNode("mb:minWidth");
  if (minWidth) this.minWidth = minWidth.firstChild.nodeValue;

	this.maxWidth = 200; // pixels
  var maxWidth = widgetNode.selectSingleNode("mb:maxWidth");
  if (maxWidth) this.maxWidth = maxWidth.firstChild.nodeValue;

	this.divisions = 2;
  var divisions = widgetNode.selectSingleNode("mb:divisions");
  if (divisions) this.divisions = divisions.firstChild.nodeValue;

	this.subdivisions = 2;
  var subdivisions = widgetNode.selectSingleNode("mb:subdivisions");
  if (subdivisions) this.subdivisions = subdivisions.firstChild.nodeValue;

	this.showMinorMeasures = false;
  var showMinorMeasures = widgetNode.selectSingleNode("mb:showMinorMeasures");
  if (showMinorMeasures && showMinorMeasures.firstChild.nodeValue=="true") this.showMinorMeasures = true;

	this.abbreviateLabel = false;
  var abbreviateLabel = widgetNode.selectSingleNode("mb:abbreviateLabel");
  if (abbreviateLabel && abbreviateLabel.firstChild.nodeValue=="true") this.abbreviateLabel = true;

	this.singleLine = false;
  var singleLine = widgetNode.selectSingleNode("mb:singleLine");
  if (singleLine && singleLine.firstChild.nodeValue=="true") this.singleLine = true;

	this.align = 'center'; // left, center, or right supported
  var align = widgetNode.selectSingleNode("mb:align");
  if (align) this.align = align.firstChild.nodeValue;

	this.resolution = 72; // dpi

	// create scalebar elements
	this.container = document.createElement('div');
	this.container.className = 'sbWrapper';
	this.container.style.position = 'relative';
	this.container.setAttribute("id",this.outputNodeId);
	this.labelContainer = document.createElement('div');
	this.labelContainer.className = 'sbUnitsContainer';
	this.labelContainer.style.position = 'absolute';
	this.graphicsContainer = document.createElement('div');
	this.graphicsContainer.style.position = 'absolute';
	this.graphicsContainer.className = 'sbGraphicsContainer';
	this.numbersContainer = document.createElement('div');
	this.numbersContainer.style.position = 'absolute';
	this.numbersContainer.className = 'sbNumbersContainer';

	// private functions
	// put in some markers and bar pieces so style attributes can be grabbed
	// this is a solution for Safari support
	var markerMajor = document.createElement('div');
	markerMajor.className = 'sbMarkerMajor';
	this.graphicsContainer.appendChild(markerMajor);
	var markerMinor = document.createElement('div');
	markerMinor.className = 'sbMarkerMinor';
	this.graphicsContainer.appendChild(markerMinor);
	var barPiece = document.createElement('div');
	barPiece.className = 'sbBar';
	this.graphicsContainer.appendChild(barPiece);
	var barPieceAlt = document.createElement('div');
	barPieceAlt.className = 'sbBarAlt';
	this.graphicsContainer.appendChild(barPieceAlt);

  /**
   * adds a bbox listener on the model 
   */
  this.model.addListener("bbox", this.update, this);
  this.model.addListener("refresh", this.update, this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapScaleBar.prototype.update = function(objRef) {

  //create the output node the first time this is called
  var outputNode = document.getElementById( objRef.outputNodeId );
  if (!outputNode) objRef.node.appendChild(objRef.container);

  var scaleDenominator = objRef.model.extent.getScale()
	if(scaleDenominator != null) {
		objRef.scaleDenominator = scaleDenominator;
	}
	// local functions (and object constructors)
	function HandsomeNumber(smallUglyNumber, bigUglyNumber, sigFigs) {
		var sigFigs = (sigFigs == null) ? 10 : sigFigs;
		var bestScore = Number.POSITIVE_INFINITY;
		var bestTieBreaker = Number.POSITIVE_INFINITY;
		// if all else fails, return a small ugly number
		var handsomeValue = smallUglyNumber;
		var handsomeNumDec = 3;
		// try the first three comely multiplicands (in order of comliness)
		for(var halvingExp = 0; halvingExp < 3; ++halvingExp) {
			var comelyMultiplicand = Math.pow(2, (-1 * halvingExp));
			var maxTensExp = Math.floor(Math.log(bigUglyNumber / comelyMultiplicand) / Math.LN10)
			for(var tensExp = maxTensExp; tensExp > (maxTensExp - sigFigs + 1); --tensExp) {
				var numDec = Math.max(halvingExp - tensExp, 0);
				var testMultiplicand = comelyMultiplicand * Math.pow(10, tensExp);
				// check if there is an integer multiple of testMultiplicand between smallUglyNumber and bigUglyNumber
				if((testMultiplicand * Math.floor(bigUglyNumber / testMultiplicand)) >= smallUglyNumber) {
					// check if smallUglyNumber is an integer multiple of testMultiplicand
					if(smallUglyNumber % testMultiplicand == 0) {
						var testMultiplier = smallUglyNumber / testMultiplicand;
					}
					// otherwise go for the smallest integer multiple between small and big
					else {
						var testMultiplier = Math.floor(smallUglyNumber / testMultiplicand) + 1;
					}
					// test against the best (lower == better)
					var testScore = testMultiplier + (2 * halvingExp);
					var testTieBreaker = (tensExp < 0) ? (Math.abs(tensExp) + 1) : tensExp;
					if((testScore < bestScore) || ((testScore == bestScore) && (testTieBreaker < bestTieBreaker))) {
						bestScore = testScore;
						bestTieBreaker = testTieBreaker;
						handsomeValue = (testMultiplicand * testMultiplier).toFixed(numDec);
						handsomeNumDec = numDec;
					}
				}
			}
		}
		this.value = handsomeValue;
		this.score = bestScore;
		this.tieBreaker = bestTieBreaker;
		this.numDec = handsomeNumDec;
	}
	HandsomeNumber.prototype.toString = function() {
		return this.value.toString();
	}
	HandsomeNumber.prototype.valueOf = function() {
		return this.value;
	}
	function styleValue(aSelector, styleKey) {
		// returns an integer value associated with a particular selector and key
		// given a stylesheet with .someSelector {border: 2px solid red}
		// styleValue('.someSelector', 'borderWidth') returns 2
		var aValue = 0;
		if(document.styleSheets) {
			for(var sheetIndex = document.styleSheets.length - 1; sheetIndex >= 0; --sheetIndex) {
				var aSheet = document.styleSheets[sheetIndex];
				if(!aSheet.disabled) {
					var allRules;
					if(typeof(aSheet.cssRules) == 'undefined') {
						if(typeof(aSheet.rules) == 'undefined') {
							// can't get rules, assume zero
							return 0;
						}
						else {
							allRules = aSheet.rules;
						}
					}
					else {
						allRules = aSheet.cssRules;
					}
					for(var ruleIndex = 0; ruleIndex < allRules.length; ++ruleIndex) {
						var aRule = allRules[ruleIndex];
						if(aRule.selectorText && (aRule.selectorText.toLowerCase() == aSelector.toLowerCase())) {
							if(aRule.style[styleKey] != '') {
								aValue = parseInt(aRule.style[styleKey]);
							}
						}
					}
				}
			}
		}
		// if the styleKey was not found, the equivalent value is zero
		return aValue ? aValue : 0;
	}
	function formatNumber(aNumber, numDecimals) {
		numDecimals = (numDecimals) ? numDecimals : 0;
		var formattedInteger = '' + Math.round(aNumber);
		var thousandsPattern = /(-?[0-9]+)([0-9]{3})/;
		while(thousandsPattern.test(formattedInteger)) {
			formattedInteger = formattedInteger.replace(thousandsPattern, '$1,$2');
		}
		if(numDecimals > 0) {
			var formattedDecimal = Math.floor(Math.pow(10, numDecimals) * (aNumber - Math.round(aNumber)));
			if(formattedDecimal == 0) {
				return formattedInteger;
			}
			else {
				return formattedInteger + '.' + formattedDecimal;
			}
		}
		else {
			return formattedInteger;
		}
	}
	// update the container title (for displaying scale as a tooltip)
	objRef.container.title = mbGetMessage("scale", formatNumber(objRef.scaleDenominator));
	// measurementProperties holds display units, abbreviations,
	// and conversion to inches (since we're using dpi) - per measurement sytem
	var measurementProperties = new Object();
	measurementProperties.english = {
		units: [mbGetMessage("unitMiles"), mbGetMessage("unitFeet"), mbGetMessage("unitInches")],
		abbr: [mbGetMessage("unitMilesAbbr"), mbGetMessage("unitFeetAbbr"), mbGetMessage("unitInchesAbbr")],
		inches: [63360, 12, 1]
	}
	measurementProperties.metric = {
		units: [mbGetMessage("unitKilometers"), mbGetMessage("unitMeters"), mbGetMessage("unitCentimeters")],
		abbr: [mbGetMessage("unitKilometersAbbr"), mbGetMessage("unitMetersAbbr"), mbGetMessage("unitCentimetersAbbr")],
		inches: [39370.07874, 39.370079, 0.393701]
	}
	// check each measurement unit in the display system
	var comparisonArray = new Array();
	for(var unitIndex = 0; unitIndex < measurementProperties[objRef.displaySystem].units.length; ++unitIndex) {
		comparisonArray[unitIndex] = new Object();
		var pixelsPerDisplayUnit = objRef.resolution * measurementProperties[objRef.displaySystem].inches[unitIndex] / objRef.scaleDenominator;
		var minSDDisplayLength = (objRef.minWidth / pixelsPerDisplayUnit) / (objRef.divisions * objRef.subdivisions);
		var maxSDDisplayLength = (objRef.maxWidth / pixelsPerDisplayUnit) / (objRef.divisions * objRef.subdivisions);
		// add up scores for each marker (even if numbers aren't displayed)
		for(var valueIndex = 0; valueIndex < (objRef.divisions * objRef.subdivisions); ++valueIndex) {
			var minNumber = minSDDisplayLength * (valueIndex + 1);
			var maxNumber = maxSDDisplayLength * (valueIndex + 1);
			var niceNumber = new HandsomeNumber(minNumber, maxNumber);
			comparisonArray[unitIndex][valueIndex] = {value: (niceNumber.value / (valueIndex + 1)), score: 0, tieBreaker: 0, numDec: 0, displayed: 0};
			// now tally up scores for all values given this subdivision length
			for(var valueIndex2 = 0; valueIndex2 < (objRef.divisions * objRef.subdivisions); ++valueIndex2) {
				displayedValuePosition = niceNumber.value * (valueIndex2 + 1) / (valueIndex + 1);
				niceNumber2 = new HandsomeNumber(displayedValuePosition, displayedValuePosition);
				var isMajorMeasurement = ((valueIndex2 + 1) % objRef.subdivisions == 0);
				var isLastMeasurement = ((valueIndex2 + 1) == (objRef.divisions * objRef.subdivisions));
				if((objRef.singleLine && isLastMeasurement) || (!objRef.singleLine && (isMajorMeasurement || objRef.showMinorMeasures))) {
					// count scores for displayed marker measurements
					comparisonArray[unitIndex][valueIndex].score += niceNumber2.score;
					comparisonArray[unitIndex][valueIndex].tieBreaker += niceNumber2.tieBreaker;
					comparisonArray[unitIndex][valueIndex].numDec = Math.max(comparisonArray[unitIndex][valueIndex].numDec, niceNumber2.numDec);
					comparisonArray[unitIndex][valueIndex].displayed += 1;
				}
				else {
					// count scores for non-displayed marker measurements
					comparisonArray[unitIndex][valueIndex].score += niceNumber2.score / objRef.subdivisions;
					comparisonArray[unitIndex][valueIndex].tieBreaker += niceNumber2.tieBreaker / objRef.subdivisions;
				}
			}
			// adjust scores so numbers closer to 1 are preferred for display
			var scoreAdjustment = (unitIndex + 1) * comparisonArray[unitIndex][valueIndex].tieBreaker / comparisonArray[unitIndex][valueIndex].displayed;
			comparisonArray[unitIndex][valueIndex].score *= scoreAdjustment;
		}
	}
	// get the value (subdivision length) with the lowest cumulative score
	var subdivisionDisplayLength = null;
	var displayUnits = null;
	var displayUnitsAbbr = null;
	var subdivisionPixelLength = null;
	var bestScore = Number.POSITIVE_INFINITY;
	var bestTieBreaker = Number.POSITIVE_INFINITY;
	var numDec = 0;
	for(var unitIndex = 0; unitIndex < comparisonArray.length; ++unitIndex) {
		for(valueIndex in comparisonArray[unitIndex]) {
			if((comparisonArray[unitIndex][valueIndex].score < bestScore) || ((comparisonArray[unitIndex][valueIndex].score == bestScore) && (comparisonArray[unitIndex][valueIndex].tieBreaker < bestTieBreaker))) {
				bestScore = comparisonArray[unitIndex][valueIndex].score;
				bestTieBreaker = comparisonArray[unitIndex][valueIndex].tieBreaker;
				subdivisionDisplayLength = comparisonArray[unitIndex][valueIndex].value;
				numDec = comparisonArray[unitIndex][valueIndex].numDec;
				displayUnits = measurementProperties[objRef.displaySystem].units[unitIndex];
				displayUnitsAbbr = measurementProperties[objRef.displaySystem].abbr[unitIndex];
				pixelsPerDisplayUnit = objRef.resolution * measurementProperties[objRef.displaySystem].inches[unitIndex] / objRef.scaleDenominator;
				subdivisionPixelLength = pixelsPerDisplayUnit * subdivisionDisplayLength; // round before use in style
			}
		}
	}
	// determine offsets for graphic elements
	var xOffsetMarkerMajor = (styleValue('.sbMarkerMajor', 'borderLeftWidth') + styleValue('.sbMarkerMajor', 'width') + styleValue('.sbMarkerMajor', 'borderRightWidth')) / 2;
	var xOffsetMarkerMinor = (styleValue('.sbMarkerMinor', 'borderLeftWidth') + styleValue('.sbMarkerMinor', 'width') + styleValue('.sbMarkerMinor', 'borderRightWidth')) / 2;
	var xOffsetBar = (styleValue('.sbBar', 'borderLeftWidth') + styleValue('.sbBar', 'border-right-width')) / 2;
	var xOffsetBarAlt = (styleValue('.sbBarAlt', 'borderLeftWidth') + styleValue('.sbBarAlt', 'borderRightWidth')) / 2;
	// support for browsers without the Document.styleSheets property (Opera)
	if(!document.styleSheets) {
		// this is a two part hack, one for the offsets here and one for the css below
		xOffsetMarkerMajor = 0.5;
		xOffsetMarkerMinor = 0.5;
	}
	// clean out any old content from containers
	while(objRef.labelContainer.hasChildNodes()) {
		objRef.labelContainer.removeChild(objRef.labelContainer.firstChild);
	}
	while(objRef.graphicsContainer.hasChildNodes()) {
		objRef.graphicsContainer.removeChild(objRef.graphicsContainer.firstChild);
	}
	while(objRef.numbersContainer.hasChildNodes()) {
		objRef.numbersContainer.removeChild(objRef.numbersContainer.firstChild);
	}
	// create all divisions
	var aMarker, aBarPiece, numbersBox, xOffset;
	var alignmentOffset = {
		left: 0,
		center: (-1 * objRef.divisions * objRef.subdivisions * subdivisionPixelLength / 2),
		right: (-1 * objRef.divisions * objRef.subdivisions * subdivisionPixelLength)
	}
	var xPosition = 0 + alignmentOffset[objRef.align];
	var markerMeasure = 0;
	for(var divisionIndex = 0; divisionIndex < objRef.divisions; ++divisionIndex) {
		// set xPosition and markerMeasure to start of division
		xPosition = divisionIndex * objRef.subdivisions * subdivisionPixelLength;
		xPosition += alignmentOffset[objRef.align];
		markerMeasure = (divisionIndex == 0) ? 0 : ((divisionIndex * objRef.subdivisions) * subdivisionDisplayLength).toFixed(numDec);
		// add major marker
		aMarker = document.createElement('div');
		aMarker.className = 'sbMarkerMajor';
		aMarker.style.position = 'absolute';
		aMarker.style.overflow = 'hidden';
		aMarker.style.left = Math.round(xPosition - xOffsetMarkerMajor) + 'px';
		aMarker.appendChild(document.createTextNode(' '));
		objRef.graphicsContainer.appendChild(aMarker);
		// add initial measure
		if(!objRef.singleLine) {
			numbersBox = document.createElement('div');
			numbersBox.className = 'sbNumbersBox';
			numbersBox.style.position = 'absolute';
			numbersBox.style.overflow = 'hidden';
			numbersBox.style.textAlign = 'center';
			if(objRef.showMinorMeasures) {
				numbersBox.style.width = Math.round(subdivisionPixelLength * 2) + 'px';
				numbersBox.style.left = Math.round(xPosition - subdivisionPixelLength) + 'px';
			}
			else {
				numbersBox.style.width = Math.round(objRef.subdivisions * subdivisionPixelLength * 2) + 'px';
				numbersBox.style.left = Math.round(xPosition - (objRef.subdivisions * subdivisionPixelLength)) + 'px';
			}
			numbersBox.appendChild(document.createTextNode(markerMeasure));
			objRef.numbersContainer.appendChild(numbersBox);
		}
		// create all subdivisions
		for(var subdivisionIndex = 0; subdivisionIndex < objRef.subdivisions; ++subdivisionIndex) {
			aBarPiece = document.createElement('div');
			aBarPiece.style.position = 'absolute';
			aBarPiece.style.overflow = 'hidden';
			aBarPiece.style.width = Math.round(subdivisionPixelLength) + 'px';
			if((subdivisionIndex % 2) == 0) {
				aBarPiece.className = 'sbBar';
				aBarPiece.style.left = Math.round(xPosition - xOffsetBar) + 'px';
			}
			else {
				aBarPiece.className = 'sbBarAlt';
				aBarPiece.style.left = Math.round(xPosition - xOffsetBarAlt) + 'px';
			}
			aBarPiece.appendChild(document.createTextNode(' '));
			objRef.graphicsContainer.appendChild(aBarPiece);
			// add minor marker if not the last subdivision
			if(subdivisionIndex < (objRef.subdivisions - 1)) {
				// set xPosition and markerMeasure to end of subdivision
				xPosition = ((divisionIndex * objRef.subdivisions) + (subdivisionIndex + 1)) * subdivisionPixelLength;
				xPosition += alignmentOffset[objRef.align];
				markerMeasure = (divisionIndex * objRef.subdivisions + subdivisionIndex + 1) * subdivisionDisplayLength;
				aMarker = document.createElement('div');
				aMarker.className = 'sbMarkerMinor';
				aMarker.style.position = 'absolute';
				aMarker.style.overflow = 'hidden';
				aMarker.style.left = Math.round(xPosition - xOffsetMarkerMinor) + 'px';
				aMarker.appendChild(document.createTextNode(' '));
				objRef.graphicsContainer.appendChild(aMarker);
				if(objRef.showMinorMeasures && !objRef.singleLine) {
					// add corresponding measure
					numbersBox = document.createElement('div');
					numbersBox.className = 'sbNumbersBox';
					numbersBox.style.position = 'absolute';
					numbersBox.style.overflow = 'hidden';
					numbersBox.style.textAlign = 'center';
					numbersBox.style.width = Math.round(subdivisionPixelLength * 2) + 'px';
					numbersBox.style.left = Math.round(xPosition - subdivisionPixelLength) + 'px';
					numbersBox.appendChild(document.createTextNode(markerMeasure));
					objRef.numbersContainer.appendChild(numbersBox);
				}
			}
		}
	}
	// set xPosition and markerMeasure to end of divisions
	xPosition = (objRef.divisions * objRef.subdivisions) * subdivisionPixelLength;
	xPosition += alignmentOffset[objRef.align];
	markerMeasure = ((objRef.divisions * objRef.subdivisions) * subdivisionDisplayLength).toFixed(numDec);
	// add the final major marker
	aMarker = document.createElement('div');
	aMarker.className = 'sbMarkerMajor';
	aMarker.style.position = 'absolute';
	aMarker.style.overflow = 'hidden';
	aMarker.style.left = Math.round(xPosition - xOffsetMarkerMajor) + 'px';
	aMarker.appendChild(document.createTextNode(' '));
	objRef.graphicsContainer.appendChild(aMarker);
	// add final measure
	if(!objRef.singleLine) {
		numbersBox = document.createElement('div');
		numbersBox.className = 'sbNumbersBox';
		numbersBox.style.position = 'absolute';
		numbersBox.style.overflow = 'hidden';
		numbersBox.style.textAlign = 'center';
		if(objRef.showMinorMeasures) {
			numbersBox.style.width = Math.round(subdivisionPixelLength * 2) + 'px';
			numbersBox.style.left = Math.round(xPosition - subdivisionPixelLength) + 'px';
		}
		else {
			numbersBox.style.width = Math.round(objRef.subdivisions * subdivisionPixelLength * 2) + 'px';
			numbersBox.style.left = Math.round(xPosition - (objRef.subdivisions * subdivisionPixelLength)) + 'px';
		}
		numbersBox.appendChild(document.createTextNode(markerMeasure));
		objRef.numbersContainer.appendChild(numbersBox);
	}
	// add content to the label container
	var labelBox = document.createElement('div');
	labelBox.style.position = 'absolute';
	var labelText;
	if(objRef.singleLine) {
		labelText = markerMeasure;
		labelBox.className = 'sbLabelBoxSingleLine';
		labelBox.style.top = '-0.6em';
		labelBox.style.left = (xPosition + 10) + 'px';
	}
	else {
		labelText = '';
		labelBox.className = 'sbLabelBox';
		labelBox.style.textAlign = 'center';
		labelBox.style.width = Math.round(objRef.divisions * objRef.subdivisions * subdivisionPixelLength) + 'px'
		labelBox.style.left = Math.round(alignmentOffset[objRef.align]) + 'px';
		labelBox.style.overflow = 'hidden';
	}
	if(objRef.abbreviateLabel) {
		labelText += ' ' + displayUnitsAbbr;
	}
	else {
		labelText += ' ' + displayUnits;
	}
	labelBox.appendChild(document.createTextNode(labelText));
	objRef.labelContainer.appendChild(labelBox);
	// support for browsers without the Document.styleSheets property (Opera)
	if(!document.styleSheets) {
		// override custom css with default
		var defaultStyle = document.createElement('style');
		defaultStyle.type = 'text/css';
		var styleText = '.sbBar {top: 0px; background: #666666; height: 1px; border: 0;}';
		styleText += '.sbBarAlt {top: 0px; background: #666666; height: 1px; border: 0;}';
		styleText += '.sbMarkerMajor {height: 7px; width: 1px; background: #666666; border: 0;}';
		styleText += '.sbMarkerMinor {height: 5px; width: 1px; background: #666666; border: 0;}';
		styleText += '.sbLabelBox {top: -16px;}';
		styleText += '.sbNumbersBox {top: 7px;}';
		defaultStyle.appendChild(document.createTextNode(styleText));
		document.getElementsByTagName('head').item(0).appendChild(defaultStyle);
	}
	// append the child containers to the parent container
	objRef.container.appendChild(objRef.graphicsContainer);
	objRef.container.appendChild(objRef.labelContainer);
	objRef.container.appendChild(objRef.numbersContainer);
}
