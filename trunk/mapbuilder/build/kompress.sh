#!/bin/sh
# Compress all javascript files using jsjam.pl
# Use xsltproc to compress XSL files
# This script expects files to be located in ../build/lib/*
# 
# $Id$

# Set variables
mapbuilderDir=`dirname $0`/..;
targetDir=${mapbuilderDir}/compressBuild
tmp="jsjam.tmp";

for file in `find ${targetDir}/lib -name "*.xsl"` ; do
  xsltproc ${mapbuilderDir}/build/compressXsl.xsl ${file} > ${tmp};
  mv ${tmp} ${file};
done;

rm ${targetDir}/MapbuilderCompressed.js

originalFile=${targetDir}/lib/MapbuilderCompressed.js

# Compress javascript files
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/RELEASE.js > ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/Mapbuilder.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/openlayers/OpenLayers.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/Sarissa.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/javeline_xpath.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/javeline_xslt.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa_dhtml.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa_ieemu_xpath.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/proj4js/proj4js-compressed.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Util.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Listener.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/ModelBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Config.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ButtonBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Button.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Back.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Forward.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ZoomIn.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ZoomOut.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/DragPan.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Reset.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapPaneOL.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/CursorTrack.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapScaleText.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Loading2.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/PanZoomBar.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/EditButtonBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/EditLine.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/EditPoint.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/EditPolygon.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/InsertFeature.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/DeleteFeature.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WfsGetFeature.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Legend.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Version.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/OverviewMap.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/TransactionResponse.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Model.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Context.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/OwsContext.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Transaction.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/FeatureCollection.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/StyledLayerDescriptor.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/WfsCapabilities.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/WmsCapabilities.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Loading.js >> ${originalFile} 2>&1


java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WidgetBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WidgetBaseXSL.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/TipWidgetBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/TipWidgetConfig.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/TipWidgetOL.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/GmlRendererBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/GmlRendererConfig.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/GmlRendererOL.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/FeatureList.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/AoiMouseHandler.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/Caps2Context.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/ToolBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/EditContext.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/Extent.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/History.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/FeatureSelectHandler.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/MergeModels.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/MovieLoop.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/WebServiceRequest.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/ZoomToAoi.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/GetFeatureInfoWSR.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Graticule.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapScaleBar.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/LegendGraphic.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Abstract.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/FeatureInfo.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapTitle.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/SetAoi.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ModelUrlInput.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/CollectionList.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/SelectMapLayers.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Timestamp.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Save.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/LayerControl.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/AoiBoxDHTML.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/FilterAttributes.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/SelectFeatureType.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/AoiForm.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Widget.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WebServiceForm.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/GetFeatureInfo.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Locations.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Measurement.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ModelStatus.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/SaveModel.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ShowDistance.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/SelectAllMapLayers.js >> ${originalFile} 2>&1

cp ${originalFile} ${mapbuilderDir}/lib

cp ${mapbuilderDir}/lib/MapbuilderCompressed.js /osgeo/mapbuilder/apisite/1.5-rc1/mapbuilder/lib
