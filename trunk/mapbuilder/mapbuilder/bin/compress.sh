#!/bin/sh
# Compress all javascript files using jsjam.pl
# Use xsltproc to compress XSL files
# 
# $Id$

# Set variables
mapbuilderDir=`dirname $0`/..;
tmp="jsjam.tmp";

# Compress javascript files
for file in `find /home/cameron/work/x/lib -name "*.js"` ; do
  ${mapbuilderDir}/bin/jsjam.pl ${file} -i -g -n > ${tmp};
  mv ${tmp} ${file};
done;

# Compress xsl files
for file in `find /home/cameron/work/x/lib -name "*.xsl"` ; do
  xsltproc ${mapbuilderDir}/bin/compressXsl.xsl ${file} > ${tmp};
  mv ${tmp} ${file};
done;
