#!/bin/sh
# Compress all javascript files using jsjam.pl
# Use xsltproc to compress XSL files
# This script expects files to be located in ../build/lib/*
# 
# $Id: compress.sh 1373 2005-03-23 21:13:35Z camerons $

# Set variables
mapbuilderDir=`dirname $0`/..;
targetDir=${mapbuilderDir}/compressBuild
tmp="jsjam.tmp";

rm lib/MapbuilderCompressed.js

# Compress javascript files
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/Mapbuilder.js >> lib/MapbuilderCompressed.js 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/RELEASE.js >> lib/MapbuilderCompressed.js 2>&1

for file in `find ${targetDir}/lib -name "*.js" | \
	 egrep -v "overlib" \
	| egrep -v "/lib/Mapbuilder.js" \
	| egrep -v "/lib/RELEASE.js" \
	| egrep -v "/lib/MapbuilderServerLoad.js" \
	| egrep -v "/lib/MapbuilderCompressed.js"`; do

#  ${mapbuilderDir}/bin/jsjam.pl ${file} -i -g -n > ${tmp};
  echo "Compressing ${file}";
  java -jar lib/util/custom_rhino.jar -c ${file} >> lib/MapbuilderCompressed.js 2>&1
done;
originalFile=lib/MapbuilderCompressed.js
outputFile=lib/MapbuilderCompressedFixed.js

# Step 1
# change "stylesheet.setParameter("objref","objRef") to "stylesheet.setParameter(_var,"objRef")"
# in GmlRendererWZ.js

cat lib/MapbuilderCompressed.js  | sed 's/\(_[0-9]\)\(.stylesheet.setParameter(\"objRef\",\)\(\"objRef\"\)/\1\2\1/' > ${outputFile}


# Step 2
# block the loadscript function
# Original Code:
#  var _3=document.createElement("script");
# _3.defer=false;
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

cat ${outputFile} | tr '\n' '\t' | sed  's/\(_[0-9]\)\(\=document.createElement(\"script");\).*\(this.loadingScripts.push\)/\1\2\t\1.readyState=="complete";\t\3/' | tr '\t' '\n' > ${outputFile}


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


cat ${outputFile}  | sed 's/\(this.loadingScripts\[0\].readyState==\"loaded\"\)/\1||this.loadingScripts[0].readyState=="uninitialized"/' > ${outputFile}

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
cat ${outputFile}  | sed '/function ButtonBase/,/function FeatureInfo/ {s/_5/disabledImage/}' > ${outputFile}

mv ${outputFile} ${originalFile}
