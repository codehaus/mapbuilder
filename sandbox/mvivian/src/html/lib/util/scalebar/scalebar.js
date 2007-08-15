function ScaleBar(scaleDenominator){
this.scaleDenominator=(scaleDenominator==null)?1:scaleDenominator;
this.displaySystem='metric';this.minWidth=100;this.maxWidth=200;this.divisions=2;
this.subdivisions=2;
this.showMinorMeasures=false;
this.abbreviateLabel=false;
this.singleLine=false;
this.resolution=72;this.align='center';this.container=document.createElement('div');
this.container.className='sbWrapper';
this.labelContainer=document.createElement('div');
this.labelContainer.className='sbUnitsContainer';
this.labelContainer.style.position='absolute';
this.graphicsContainer=document.createElement('div');
this.graphicsContainer.style.position='absolute';
this.graphicsContainer.className='sbGraphicsContainer';
this.numbersContainer=document.createElement('div');
this.numbersContainer.style.position='absolute';
this.numbersContainer.className='sbNumbersContainer';
var markerMajor=document.createElement('div');
markerMajor.className='sbMarkerMajor';
this.graphicsContainer.appendChild(markerMajor);
var markerMinor=document.createElement('div');
markerMinor.className='sbMarkerMinor';
this.graphicsContainer.appendChild(markerMinor);
var barPiece=document.createElement('div');
barPiece.className='sbBar';
this.graphicsContainer.appendChild(barPiece);
var barPieceAlt=document.createElement('div');
barPieceAlt.className='sbBarAlt';
this.graphicsContainer.appendChild(barPieceAlt);
}
ScaleBar.prototype.update=function(scaleDenominator){
if(scaleDenominator!=null){
this.scaleDenominator=scaleDenominator;
}
function HandsomeNumber(smallUglyNumber,bigUglyNumber,sigFigs){
var sigFigs=(sigFigs==null)?10:sigFigs;
var bestScore=Number.POSITIVE_INFINITY;
var bestTieBreaker=Number.POSITIVE_INFINITY;
var handsomeValue=smallUglyNumber;
var handsomeNumDec=3;
for(var halvingExp=0;halvingExp<3;++halvingExp){
var comelyMultiplicand=Math.pow(2,(-1*halvingExp));
var maxTensExp=Math.floor(Math.log(bigUglyNumber/comelyMultiplicand)/Math.LN10)
for(var tensExp=maxTensExp;tensExp>(maxTensExp-sigFigs+1);--tensExp){
var numDec=Math.max(halvingExp-tensExp,0);
var testMultiplicand=comelyMultiplicand*Math.pow(10,tensExp);
if((testMultiplicand*Math.floor(bigUglyNumber/testMultiplicand))>=smallUglyNumber){
if(smallUglyNumber%testMultiplicand==0){
var testMultiplier=smallUglyNumber/testMultiplicand;
}
else{
var testMultiplier=Math.floor(smallUglyNumber/testMultiplicand)+1;
}
var testScore=testMultiplier+(2*halvingExp);
var testTieBreaker=(tensExp<0)?(Math.abs(tensExp)+1):tensExp;
if((testScore<bestScore)||((testScore==bestScore)&&(testTieBreaker<bestTieBreaker))){
bestScore=testScore;
bestTieBreaker=testTieBreaker;
handsomeValue=(testMultiplicand*testMultiplier).toFixed(numDec);
handsomeNumDec=numDec;
}
}
}
}
this.value=handsomeValue;
this.score=bestScore;
this.tieBreaker=bestTieBreaker;
this.numDec=handsomeNumDec;
}
HandsomeNumber.prototype.toString=function(){
return this.value.toString();
}
HandsomeNumber.prototype.valueOf=function(){
return this.value;
}
function styleValue(aSelector,styleKey){
var aValue=0;
if(document.styleSheets){
for(var sheetIndex=document.styleSheets.length-1;sheetIndex>=0;--sheetIndex){
var aSheet=document.styleSheets[sheetIndex];
if(!aSheet.disabled){
var allRules;
if(typeof(aSheet.cssRules)=='undefined'){
if(typeof(aSheet.rules)=='undefined'){
return 0;
}
else{
allRules=aSheet.rules;
}
}
else{
allRules=aSheet.cssRules;
}
for(var ruleIndex=0;ruleIndex<allRules.length;++ruleIndex){
var aRule=allRules[ruleIndex];
if(aRule.selectorText&&(aRule.selectorText.toLowerCase()==aSelector.toLowerCase())){
if(aRule.style[styleKey]!=''){
aValue=parseInt(aRule.style[styleKey]);
}
}
}
}
}
}
return aValue?aValue:0;
}
function formatNumber(aNumber,numDecimals){
numDecimals=(numDecimals)?numDecimals:0;
var formattedInteger=''+Math.round(aNumber);
var thousandsPattern=/(-?[0-9]+)([0-9]{3})/;
while(thousandsPattern.test(formattedInteger)){
formattedInteger=formattedInteger.replace(thousandsPattern,'$1,$2');
}
if(numDecimals>0){
var formattedDecimal=Math.floor(Math.pow(10,numDecimals)*(aNumber-Math.round(aNumber)));
if(formattedDecimal==0){
return formattedInteger;
}
else{
return formattedInteger+'.'+formattedDecimal;
}
}
else{
return formattedInteger;
}
}
this.container.title='scale 1:'+formatNumber(this.scaleDenominator);
var measurementProperties=new Object();
measurementProperties.english={
units:['miles','feet','inches'],
abbr:['mi','ft','in'],
inches:[63360,12,1]
}
measurementProperties.metric={
units:['kilometers','meters','centimeters'],
abbr:['km','m','cm'],
inches:[39370.07874,39.370079,0.393701]
}
var comparisonArray=new Array();
for(var unitIndex=0;unitIndex<measurementProperties[this.displaySystem].units.length;++unitIndex){
comparisonArray[unitIndex]=new Object();
var pixelsPerDisplayUnit=this.resolution*measurementProperties[this.displaySystem].inches[unitIndex]/this.scaleDenominator;
var minSDDisplayLength=(this.minWidth/pixelsPerDisplayUnit)/(this.divisions*this.subdivisions);
var maxSDDisplayLength=(this.maxWidth/pixelsPerDisplayUnit)/(this.divisions*this.subdivisions);
for(var valueIndex=0;valueIndex<(this.divisions*this.subdivisions);++valueIndex){
var minNumber=minSDDisplayLength*(valueIndex+1);
var maxNumber=maxSDDisplayLength*(valueIndex+1);
var niceNumber=new HandsomeNumber(minNumber,maxNumber);
comparisonArray[unitIndex][valueIndex]={value:(niceNumber.value/(valueIndex+1)),score:0,tieBreaker:0,numDec:0,displayed:0};
for(var valueIndex2=0;valueIndex2<(this.divisions*this.subdivisions);++valueIndex2){
displayedValuePosition=niceNumber.value*(valueIndex2+1)/(valueIndex+1);
niceNumber2=new HandsomeNumber(displayedValuePosition,displayedValuePosition);
var isMajorMeasurement=((valueIndex2+1)%this.subdivisions==0);
var isLastMeasurement=((valueIndex2+1)==(this.divisions*this.subdivisions));
if((this.singleLine&&isLastMeasurement)||(!this.singleLine&&(isMajorMeasurement||this.showMinorMeasures))){
comparisonArray[unitIndex][valueIndex].score+=niceNumber2.score;
comparisonArray[unitIndex][valueIndex].tieBreaker+=niceNumber2.tieBreaker;
comparisonArray[unitIndex][valueIndex].numDec=Math.max(comparisonArray[unitIndex][valueIndex].numDec,niceNumber2.numDec);
comparisonArray[unitIndex][valueIndex].displayed+=1;
}
else{
comparisonArray[unitIndex][valueIndex].score+=niceNumber2.score/this.subdivisions;
comparisonArray[unitIndex][valueIndex].tieBreaker+=niceNumber2.tieBreaker/this.subdivisions;
}
}
var scoreAdjustment=(unitIndex+1)*comparisonArray[unitIndex][valueIndex].tieBreaker/comparisonArray[unitIndex][valueIndex].displayed;
comparisonArray[unitIndex][valueIndex].score*=scoreAdjustment;
}
}
var subdivisionDisplayLength=null;
var displayUnits=null;
var displayUnitsAbbr=null;
var subdivisionPixelLength=null;
var bestScore=Number.POSITIVE_INFINITY;
var bestTieBreaker=Number.POSITIVE_INFINITY;
var numDec=0;
for(var unitIndex=0;unitIndex<comparisonArray.length;++unitIndex){
for(valueIndex in comparisonArray[unitIndex]){
if((comparisonArray[unitIndex][valueIndex].score<bestScore)||((comparisonArray[unitIndex][valueIndex].score==bestScore)&&(comparisonArray[unitIndex][valueIndex].tieBreaker<bestTieBreaker))){
bestScore=comparisonArray[unitIndex][valueIndex].score;
bestTieBreaker=comparisonArray[unitIndex][valueIndex].tieBreaker;
subdivisionDisplayLength=comparisonArray[unitIndex][valueIndex].value;
numDec=comparisonArray[unitIndex][valueIndex].numDec;
displayUnits=measurementProperties[this.displaySystem].units[unitIndex];
displayUnitsAbbr=measurementProperties[this.displaySystem].abbr[unitIndex];
pixelsPerDisplayUnit=this.resolution*measurementProperties[this.displaySystem].inches[unitIndex]/this.scaleDenominator;
subdivisionPixelLength=pixelsPerDisplayUnit*subdivisionDisplayLength;}
}
}
var xOffsetMarkerMajor=(styleValue('.sbMarkerMajor','borderLeftWidth')+styleValue('.sbMarkerMajor','width')+styleValue('.sbMarkerMajor','borderRightWidth'))/2;
var xOffsetMarkerMinor=(styleValue('.sbMarkerMinor','borderLeftWidth')+styleValue('.sbMarkerMinor','width')+styleValue('.sbMarkerMinor','borderRightWidth'))/2;
var xOffsetBar=(styleValue('.sbBar','borderLeftWidth')+styleValue('.sbBar','border-right-width'))/2;
var xOffsetBarAlt=(styleValue('.sbBarAlt','borderLeftWidth')+styleValue('.sbBarAlt','borderRightWidth'))/2;
if(!document.styleSheets){
xOffsetMarkerMajor=0.5;
xOffsetMarkerMinor=0.5;
}
while(this.labelContainer.hasChildNodes()){
this.labelContainer.removeChild(this.labelContainer.firstChild);
}
while(this.graphicsContainer.hasChildNodes()){
this.graphicsContainer.removeChild(this.graphicsContainer.firstChild);
}
while(this.numbersContainer.hasChildNodes()){
this.numbersContainer.removeChild(this.numbersContainer.firstChild);
}
var aMarker,aBarPiece,numbersBox,xOffset;
var alignmentOffset={
left:0,
center:(-1*this.divisions*this.subdivisions*subdivisionPixelLength/2),
right:(-1*this.divisions*this.subdivisions*subdivisionPixelLength)
}
var xPosition=0+alignmentOffset[this.align];
var markerMeasure=0;
for(var divisionIndex=0;divisionIndex<this.divisions;++divisionIndex){
xPosition=divisionIndex*this.subdivisions*subdivisionPixelLength;
xPosition+=alignmentOffset[this.align];
markerMeasure=(divisionIndex==0)?0:((divisionIndex*this.subdivisions)*subdivisionDisplayLength).toFixed(numDec);
aMarker=document.createElement('div');
aMarker.className='sbMarkerMajor';
aMarker.style.position='absolute';
aMarker.style.overflow='hidden';
aMarker.style.left=Math.round(xPosition-xOffsetMarkerMajor)+'px';
aMarker.appendChild(document.createTextNode(' '));
this.graphicsContainer.appendChild(aMarker);
if(!this.singleLine){
numbersBox=document.createElement('div');
numbersBox.className='sbNumbersBox';
numbersBox.style.position='absolute';
numbersBox.style.overflow='hidden';
numbersBox.style.textAlign='center';
if(this.showMinorMeasures){
numbersBox.style.width=Math.round(subdivisionPixelLength*2)+'px';
numbersBox.style.left=Math.round(xPosition-subdivisionPixelLength)+'px';
}
else{
numbersBox.style.width=Math.round(this.subdivisions*subdivisionPixelLength*2)+'px';
numbersBox.style.left=Math.round(xPosition-(this.subdivisions*subdivisionPixelLength))+'px';
}
numbersBox.appendChild(document.createTextNode(markerMeasure));
this.numbersContainer.appendChild(numbersBox);
}
for(var subdivisionIndex=0;subdivisionIndex<this.subdivisions;++subdivisionIndex){
aBarPiece=document.createElement('div');
aBarPiece.style.position='absolute';
aBarPiece.style.overflow='hidden';
aBarPiece.style.width=Math.round(subdivisionPixelLength)+'px';
if((subdivisionIndex%2)==0){
aBarPiece.className='sbBar';
aBarPiece.style.left=Math.round(xPosition-xOffsetBar)+'px';
}
else{
aBarPiece.className='sbBarAlt';
aBarPiece.style.left=Math.round(xPosition-xOffsetBarAlt)+'px';
}
aBarPiece.appendChild(document.createTextNode(' '));
this.graphicsContainer.appendChild(aBarPiece);
if(subdivisionIndex<(this.subdivisions-1)){
xPosition=((divisionIndex*this.subdivisions)+(subdivisionIndex+1))*subdivisionPixelLength;
xPosition+=alignmentOffset[this.align];
markerMeasure=(divisionIndex*this.subdivisions+subdivisionIndex+1)*subdivisionDisplayLength;
aMarker=document.createElement('div');
aMarker.className='sbMarkerMinor';
aMarker.style.position='absolute';
aMarker.style.overflow='hidden';
aMarker.style.left=Math.round(xPosition-xOffsetMarkerMinor)+'px';
aMarker.appendChild(document.createTextNode(' '));
this.graphicsContainer.appendChild(aMarker);
if(this.showMinorMeasures&&!this.singleLine){
numbersBox=document.createElement('div');
numbersBox.className='sbNumbersBox';
numbersBox.style.position='absolute';
numbersBox.style.overflow='hidden';
numbersBox.style.textAlign='center';
numbersBox.style.width=Math.round(subdivisionPixelLength*2)+'px';
numbersBox.style.left=Math.round(xPosition-subdivisionPixelLength)+'px';
numbersBox.appendChild(document.createTextNode(markerMeasure));
this.numbersContainer.appendChild(numbersBox);
}
}
}
}
xPosition=(this.divisions*this.subdivisions)*subdivisionPixelLength;
xPosition+=alignmentOffset[this.align];
markerMeasure=((this.divisions*this.subdivisions)*subdivisionDisplayLength).toFixed(numDec);
aMarker=document.createElement('div');
aMarker.className='sbMarkerMajor';
aMarker.style.position='absolute';
aMarker.style.overflow='hidden';
aMarker.style.left=Math.round(xPosition-xOffsetMarkerMajor)+'px';
aMarker.appendChild(document.createTextNode(' '));
this.graphicsContainer.appendChild(aMarker);
if(!this.singleLine){
numbersBox=document.createElement('div');
numbersBox.className='sbNumbersBox';
numbersBox.style.position='absolute';
numbersBox.style.overflow='hidden';
numbersBox.style.textAlign='center';
if(this.showMinorMeasures){
numbersBox.style.width=Math.round(subdivisionPixelLength*2)+'px';
numbersBox.style.left=Math.round(xPosition-subdivisionPixelLength)+'px';
}
else{
numbersBox.style.width=Math.round(this.subdivisions*subdivisionPixelLength*2)+'px';
numbersBox.style.left=Math.round(xPosition-(this.subdivisions*subdivisionPixelLength))+'px';
}
numbersBox.appendChild(document.createTextNode(markerMeasure));
this.numbersContainer.appendChild(numbersBox);
}
var labelBox=document.createElement('div');
labelBox.style.position='absolute';
var labelText;
if(this.singleLine){
labelText=markerMeasure;
labelBox.className='sbLabelBoxSingleLine';
labelBox.style.top='-0.6em';
labelBox.style.left=(xPosition+10)+'px';
}
else{
labelText='';
labelBox.className='sbLabelBox';
labelBox.style.textAlign='center';
labelBox.style.width=Math.round(this.divisions*this.subdivisions*subdivisionPixelLength)+'px'
labelBox.style.left=Math.round(alignmentOffset[this.align])+'px';
labelBox.style.overflow='hidden';
}
if(this.abbreviateLabel){
labelText+=' '+displayUnitsAbbr;
}
else{
labelText+=' '+displayUnits;
}
labelBox.appendChild(document.createTextNode(labelText));
this.labelContainer.appendChild(labelBox);
if(!document.styleSheets){
var defaultStyle=document.createElement('style');
defaultStyle.type='text/css';
var styleText='.sbBar {top: 0px; background: #666666; height: 1px; border: 0;}';
styleText+='.sbBarAlt {top: 0px; background: #666666; height: 1px; border: 0;}';
styleText+='.sbMarkerMajor {height: 7px; width: 1px; background: #666666; border: 0;}';
styleText+='.sbMarkerMinor {height: 5px; width: 1px; background: #666666; border: 0;}';
styleText+='.sbLabelBox {top: -16px;}';
styleText+='.sbNumbersBox {top: 7px;}';
defaultStyle.appendChild(document.createTextNode(styleText));
document.getElementsByTagName('head').item(0).appendChild(defaultStyle);
}
this.container.appendChild(this.graphicsContainer);
this.container.appendChild(this.labelContainer);
this.container.appendChild(this.numbersContainer);
}
ScaleBar.prototype.place=function(elementId){
if(elementId==null){
document.body.appendChild(this.container);
}
else{
var anElement=document.getElementById(elementId);
if(anElement!=null){
anElement.appendChild(this.container);
}
}
this.update();
}
