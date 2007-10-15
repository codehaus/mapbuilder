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
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/Mapbuilder.js > ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/RELEASE.js >> ${originalFile} 2>&1

java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/ButtonBase.js >> ${originalFile} 2>&1
java -jar lib/util/custom_rhino.jar -c ${targetDir}/lib/widget/EditLine.js >> ${originalFile} 2>&1


for file in `find ${targetDir}/lib -name "*.js" | \
	 egrep -v "overlib" \
	| egrep -v "/lib/Mapbuilder.js" \
	| egrep -v "/lib/RELEASE.js" \
	| egrep -v "/lib/widget/ButtonBase.js" \
	| egrep -v "/lib/widget/EditLine.js" \
	| egrep -v "/lib/MapbuilderServerLoad.js" \
	| egrep -v "/lib/MapbuilderCompressed.js"`; do

#  ${mapbuilderDir}/build/jsjam.pl ${file} -i -g -n > ${tmp};
  echo "Compressing ${file}";
  java -jar lib/util/custom_rhino.jar -c ${file} >> ${originalFile} 2>&1
done;

# Step 1
# change "stylesheet.setParameter("objref","objRef") to "stylesheet.setParameter(_var,"objRef")"
# in GmlRendererWZ.js

cat ${originalFile}  | sed 's/\(_[0-9]\)\(.stylesheet.setParameter(\"objRef\",\)\(\"objRef\"\)/\1\2\1/' > ${outputFile}


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

cat ${originalFile} | tr '\n' '\t' | sed  's/\(_[0-9]\)\(\=document.createElement(\"script");\).*\(this.loadingScripts.push\)/\1\2\t\1.readyState=="complete";\t\3/' | tr '\t' '\n' > ${outputFile}

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


cat ${originalFile}  | sed '/function ButtonBase/,/function EditLine/ {s/_5/disabledImage/}' > ${outputFile} 

mv ${outputFile} ${originalFile}

cp ${originalFile} ${mapbuilderDir}/lib
