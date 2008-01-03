#!/bin/sh
# Compress all javascript files using jsjam.pl
# Use xsltproc to compress XSL files
# This script expects files to be located in ../build/lib/*
# 
# $Id: kompress.sh 3752 2007-12-19 21:46:04Z ahocevar $

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
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/Mapbuilder.js > ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa_ieemu_xpath.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Util.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Listener.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/ModelBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Config.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/OwsContext.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Model.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/FeatureCollection.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/WmsCapabilities.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/GetMap.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/StyledLayerDescriptor.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapPane2.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapScaleBar.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/AoiBoxWZ.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/CursorTrack.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/LayerControl.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/AoiBoxDHTML.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Loading2.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/FeatureInfo.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/GmlRendererWZ.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/FeatureList.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapImage.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Widget.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Back.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Forward.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ZoomIn.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ZoomOut.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Reset.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/DragPan.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/AoiMouseHandler.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/DragPanHandler.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/MouseClickHandler.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/History.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/ZoomToAoi.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/WebServiceRequest.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/EditContext.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/tool/GenerateSld.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/ShowDistance.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/MeasurementTrack.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/MouseRenderer.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/model/OlsRespons.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/OlsResponsView.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/Measurement.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/Print.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/Help.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/Legenda.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/GetFeatureInfo.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/Geocoder.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/VerwijderPunten.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/AddLayer.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/GeocoderForm.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/WfsQueryLayer.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WidgetBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapContainerBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/MapLayerMgr.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/wz_jsgraphics/wz_jsgraphics.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WidgetBaseXSL.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ButtonBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Proj.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/ToolBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/util/wz_jsgraphics/wz_jsgraphics.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/EditButtonBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/ButtonBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/customlib/widget/ShowDistance.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/ToggleBox.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/ButtonBase.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/MapLayer.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/StyledLayerDescriptor.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/VectorGraphics.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/TipWidget.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/Extent.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/WmsLayer.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/TiledWmsLayer.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/util/sarissa/Sarissa.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/graphics/SVGGraphics.js >> ${originalFile} 2>&1 
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/TileExtent.js >> ${originalFile} 2>&1

cp ${originalFile} ${mapbuilderDir}/lib
