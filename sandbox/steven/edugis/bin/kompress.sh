#!/bin/sh
# Compress all javascript files using jsjam.pl
# Use xsltproc to compress XSL files
# This script expects files to be located in ../[custom]lib/*
# 
# $Id: kompress.sh 2546 2007-01-23 12:07:39Z gjvoosten $

# Set variables
mapbuilderDir=`dirname $0`/..;
targetDir=${mapbuilderDir}/compressBuild
tmp="jsjam.tmp";

# remove the targetDir and its subdirs and create an empty one

rm -rf ${targetDir};
mkdir ${targetDir};

# copy all the files of /lib and /customlib into the targetDir

cp -r ${mapbuilderDir}/lib ${targetDir}/lib;
cp -r ${mapbuilderDir}/customlib ${targetDir}/customlib;

# pack the xsl files
# in /lib
for file in `find ${targetDir}/lib -name "*.xsl"` ; do
  xsltproc ${mapbuilderDir}/bin/compressXsl.xsl ${file} > ${tmp};
  mv ${tmp} ${file};
done;
# and /customlib
for file in `find ${targetDir}/customlib -name "*.xsl"` ; do
  xsltproc ${mapbuilderDir}/bin/compressXsl.xsl ${file} > ${tmp};
  mv ${tmp} ${file};
done;

originalFile=${targetDir}/lib/MapbuilderCompressed.js
outputFile=${targetDir}/lib/MapbuilderCompressedFixed.js


# Compress javascript files
java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/Mapbuilder.js > ${originalFile} 2>&1
#java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/RELEASE.js >> ${originalFile} 2>&1

java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/Sarissa.js >> ${originalFile} 2>&1
java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/util/sarissa/sarissa_ieemu_xpath.js >> ${originalFile} 2>&1

java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Util.js >> ${originalFile} 2>&1
java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/util/Listener.js >> ${originalFile} 2>&1

java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/model/ModelBase.js >> ${originalFile} 2>&1
java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${targetDir}/lib/model/Config.js >> ${originalFile} 2>&1



# compress all js file in /lib excluding those also in customlib
#
# TODO: this is a manual list and should be replaced by a nifty search/compare routine

for file in `find ${targetDir}/lib -name "*.js" | \
	 egrep -v "overlib" \
	| egrep -v "/lib/Mapbuilder.js" \
	| egrep -v "/lib/RELEASE.js" \
	| egrep -v "/lib/util/sarissa/Sarissa.js" \
	| egrep -v "/lib/util/sarissa/sarissa_ieemu_xpath.js" \
	| egrep -v "/lib/util/Util.js" \
	| egrep -v "/lib/util/Listener.js" \
	| egrep -v "/lib/model/ModelBase.js" \
	| egrep -v "/lib/model/Config.js" \
	| egrep -v "/lib/MapbuilderServerLoad.js" \
	| egrep -v "/lib/MapbuilderCompressed.js" \
	| egrep -v "/lib/model/ModelBase.js" \
	| egrep -v "/lib/model/OlsRespons.js" \
	| egrep -v "/lib/tool/EditContext.js" \
	| egrep -v "/lib/util/wz_jsgraphics/wz_jsgraphics.js" \
	| egrep -v "/lib/widget/AddLayer.js" \
	| egrep -v "/lib/graphics/TiledWmsLayer2.js" \
	| egrep -v "/lib/widget/ButtonBase.js" \
	| egrep -v "/lib/widget/Geocoder.js" \
	| egrep -v "/lib/widget/GeocoderForm.js" \
	| egrep -v "/lib/widget/GetFeatureInfo.js" \
	| egrep -v "/lib/widget/Help.js" \
	| egrep -v "/lib/widget/Legenda.js" \
	| egrep -v "/lib/widget/Measurement.js" \
	| egrep -v "/lib/widget/MeasurementTrack.js" \
	| egrep -v "/lib/widget/MouseRenderer.js" \
	| egrep -v "/lib/widget/OlsResponsView.js" \
	| egrep -v "/lib/widget/Print.js" \
	| egrep -v "/lib/widget/ShowDistance.js" \
	| egrep -v "/lib/widget/VerwijderPunten.js" \
	| egrep -v "/lib/widget/ZoomIn.js"`; do
  echo "Compressing ${file}";
  java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${file} >> ${originalFile} 2>&1
done;

# compress the js files in /customlib
for file in `find ${targetDir}/customlib -name "*.js" | \
	egrep -v "/customlib/widget/EditButtonBase.js" \
	| egrep -v "/customlib/model/ModelBase.js" `; do
  echo "Compressing ${file}";
  java -jar ${targetDir}/lib/util/custom_rhino.jar -c ${file} >> ${originalFile} 2>&1
done;

# remove all js files, they are not needed anymore
for file in `find ${targetDir}/ -name "*.js" | \
	 egrep -v "/lib/MapbuilderCompressed.js" `; do
	 rm ${file}
done;
	 
# Step 1
# change "stylesheet.setParameter("objref","objRef") to "stylesheet.setParameter(_var,"objRef")"
# in GmlRendererWZ.js

echo "step 1";

cat ${originalFile}  | sed 's/\(_[0-9]\)\(.stylesheet.setParameter(\"objRef\",\)\(\"objRef\"\)/\1\2\1/' > ${outputFile}


# Step 2
# block the loadscript function
# Original Code:
#  var _3=document.createElement("script");
# _3.defer=false;#
# _3.type="text/javascript";
# _3.src=_2;
# _3.id=_2;
# document.getElementsByTagName("head")[0].appendChild(_3);
# this.loadingScripts.push(_3);
# }

# Revised Code:
#  var _3=document.createElement("script");
#  _3.readyState=="complete";
#  this.loadingScripts.push(_3);
#  }
echo "step 2";
cat ${originalFile} | tr '\n' '\t' | sed  's/\(_[0-9]\)\(\=document.createElement(\"script");\).*\(this.loadingScripts.push\)/\1\2\1.readyState=="complete";\3/' | tr '\t' '\n' > ${outputFile}

mv ${outputFile} ${originalFile}

# Step 3
# 
# Loadscript has been blocked, but IE is still stupid
#
# Add: ||this.loadingScripts[0].readyState=="uninitialized" (to mapbuilder load state loop)
# 
# Original Code: 
#  while(this.loadingScripts.length>0&&(this.loadingScripts[0].readyState=="loaded"||this.loadingScripts[0].read yState=="complete"||this.loadingScripts[0].readyState==null)){
#
# Revised Code:
# while(this.loadingScripts.length>0&&(this.loadingScripts[0].readyState=="loaded"||this.loadingScripts[0].read
# yState=="uninitialized"||this.loadingScripts[0].readyState=="complete"||this.loadingScripts[0].readyState==null)){


echo "step 3";
cat ${originalFile}  | sed 's/\(this.loadingScripts\[0\].readyState==\"loaded\"\)/\1||this.loadingScripts[0].readyState=="uninitialized"/' > ${outputFile}

mv ${outputFile} ${originalFile}

# Step 4
#
# "disabledImage" gets set to some var (often _5)
#
# This will set it back

# cat ${outputFile} | tr '\n' '\t' | \
# sed  '/function ButtonBase/,/function ToolBase/ s/\(var \)\(_[0-9]\)\(\=_[0-9].selectSingleNode(\"mb:disabledSrc\");\)/\1disabledImage\3disabledImage/' \
# | tr '\t' '\n' > ${outputFile}

# TODO - FIX THIS, THIS IS A HACK
# temporarily disabling


echo "step 4";
cat ${originalFile}  | sed '/function ButtonBase/,/function Geocoder/ 's/_4/disabledImage/'' > ${outputFile} 

mv ${outputFile} ${originalFile}

cp ${originalFile} ${mapbuilderDir}/lib
