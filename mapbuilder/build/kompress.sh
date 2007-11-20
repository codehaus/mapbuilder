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
outputFile=${targetDir}/lib/MapbuilderCompressedFixed.js

# Compress javascript files
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/RELEASE.js > ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/Mapbuilder.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/javeline_xpath.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/javeline_xslt.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/Sarissa.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa_dhtml.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa_ieemu_xpath.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/cscs/lib/cscs.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/cscs/lib/geocent.js >> ${originalFile} 2>&1


java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Util.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Listener.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/ModelBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Config.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ButtonBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Back.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Forward.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ZoomIn.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ZoomOut.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/DragPan.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/Reset.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapPaneOL.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/CursorTrack.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/MapScaleText.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Proj.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Model.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Context.js >> ${originalFile} 2>&1


java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/util/openlayers/OpenLayers.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WidgetBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/WidgetBaseXSL.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/ToolBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/Extent.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/tool/History.js >> ${originalFile} 2>&1


#Add in XSL
path=http://api.communitymapbuilder.org/dbf/

echo "var inlineXSL = new Array();" >> ${originalFile} 2>&1

find . -name 'lib/widget/CursorTrack.xsl'

#for file in `find ${targetDir}/lib -name "*.xsl"` ; do
for file in `find lib -name "*.xsl"` ; do
  # xsltproc ${mapbuilderDir}/build/compressXsl.xsl ${file} > ${tmp};
  # mv ${tmp} ${file};
  echo "inlineXSL[\"${path}${file}\"] = " >> ${originalFile} 2>&1
  cat ${file} | sed -e 's/\"/DOUBLE_QUOTE/g' -e 's/^/\"/g'  -e 's///' -e 's/$/\" +/g'  >> ${originalFile} 2>&1
  echo "\"\";" >> ${originalFile} 2>&1
done;
cp ${originalFile} ${mapbuilderDir}/lib

cp ${mapbuilderDir}/lib/MapbuilderCompressed.js ~/apisite/dbf/lib
