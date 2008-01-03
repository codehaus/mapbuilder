#!/bin/sh
# Compress all javascript files using jsjam.pl
# Use xsltproc to compress XSL files
# This script expects files to be located in ../build/lib/*
# 
# $Id: compress.sh 3247 2007-09-12 12:00:05Z ahocevar $

# Set variables
mapbuilderDir=`dirname $0`/..;
targetDir=${mapbuilderDir}/compressBuild
tmp="jsjam.tmp";

# Compress javascript files
for file in `find ${targetDir}/lib -name "*.js"` ; do
  ${mapbuilderDir}/build/jsjam.pl ${file} -i -g -n > ${tmp};
  mv ${tmp} ${file};
done;

# Compress xsl files
for file in `find ${targetDir}/lib -name "*.xsl"` ; do
  xsltproc ${mapbuilderDir}/build/compressXsl.xsl ${file} > ${tmp};
  mv ${tmp} ${file};
done;
