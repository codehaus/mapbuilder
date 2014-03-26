rem Compress all javascript files using custom_rhino.jar
rem This script expects files to be located in ../lib/*
rem $Id: $

rem Set variables
set mapbuilderDir=.
set targetDir=%mapbuilderDir%\compressBuild
set tmp=jsjam.tmp

set originalFile=%targetDir%\lib\MapbuilderCompressed.js

del %originalFile%

rem Compress javascript files
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\RELEASE.js > %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\Mapbuilder.js >> %originalFile%

type %targetDir%\lib\util\openlayers\OpenLayers-compressed.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\sarissa\Sarissa.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\sarissa\javeline_xpath.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\sarissa\javeline_xslt.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\sarissa\sarissa_dhtml.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\sarissa\sarissa_ieemu_xpath.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\proj4js\proj4js-compressed.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\Util.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\util\Listener.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\ModelBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\Config.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\ButtonBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Button.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Back.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Forward.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\ZoomIn.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\ZoomOut.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\DragPan.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Reset.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\MapPaneOL.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\CursorTrack.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\MapScaleText.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Loading2.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\PanZoomBar.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\EditButtonBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\EditLine.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\EditPoint.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\EditPolygon.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\InsertFeature.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\DeleteFeature.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\WfsGetFeature.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Legend.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Version.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\OverviewMap.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\TransactionResponse.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\Model.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\Context.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\OwsContext.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\Transaction.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\FeatureCollection.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\StyledLayerDescriptor.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\WfsCapabilities.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\model\WmsCapabilities.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Loading.js >> %originalFile%


java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\WidgetBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\WidgetBaseXSL.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\TipWidgetBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\TipWidgetConfig.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\TipWidgetOL.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\GmlRendererBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\GmlRendererConfig.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\GmlRendererOL.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\FeatureList.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\Caps2Context.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\ToolBase.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\EditContext.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\Extent.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\History.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\FeatureSelectHandler.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\MergeModels.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\MovieLoop.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\WebServiceRequest.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\tool\ZoomToAoi.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\GetFeatureInfoWSR.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Graticule.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\MapScaleBar.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\LegendGraphic.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Abstract.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\FeatureInfo.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\MapTitle.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\SetAoi.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\ModelUrlInput.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\CollectionList.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\SelectMapLayers.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Timestamp.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Save.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\LayerControl.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\FilterAttributes.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\SelectFeatureType.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\AoiForm.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Widget.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\WebServiceForm.js >> %originalFile%

java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\GetFeatureInfo.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Locations.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\Measurement.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\ModelStatus.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\ShowDistance.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\SelectAllMapLayers.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\SelectFromAtomFeed.js >> %originalFile%
java -jar %mapbuilderDir%\lib\util\custom_rhino.jar -c %targetDir%\lib\widget\AoiBoxOL.js >> %originalFile%

copy %originalFile% %mapbuilderDir%\lib

