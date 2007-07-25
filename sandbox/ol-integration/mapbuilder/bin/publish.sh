#!/bin/sh
# Build the mapbuilder documentation.
# Note, this is still a bit of a hack, and has hard coded directories which point
# to Cameron's directory structure which need to be changed before it can be used.
#
# Requires: jsdoc from http://jsdoc.sourceforge.net
#           xsltproc
#
# $Id$
# $Name$

mapbuilderDir=`dirname $0`/..;
targetDir="${mapbuilderDir}/build";

# Set variables
jsdoc="${mapbuilderDir}/bin/jsdoc/jsdoc.pl";
jsdocTarget="${targetDir}/docs/jsdoc";

# Directories and files that need to have jsdocs built from them
jsdocSource=" \
  ${mapbuilderDir}/lib/Mapbuilder.js \
  ${mapbuilderDir}/lib/model \
  ${mapbuilderDir}/lib/widget \
  ${mapbuilderDir}/lib/tool \
  ${mapbuilderDir}/lib/util \
  ${mapbuilderDir}/lib/util/sarissa/Sarissa.js"

docbookXsl=${mapbuilderDir}/bin/docbook-xsl-1.72.0/html/docbook.xsl

docDirectories=" \
  ${targetDir} \
  ${targetDir}/docs \
  ${targetDir}/docs/jsdoc \
  ${targetDir}/docs/design \
  ${targetDir}/docs/design/images"


# Create docs directories
for dir in ${docDirectories} ; do
  if [ ! -d ${dir} ]
  then
    mkdir ${dir};
  fi;
done

# Execute jsdoc with HTML output
${jsdoc} -d ${jsdocTarget} --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a> `date +'%d %b %G'`" ${jsdocSource}

# Execute jsdoc with XMI output
${jsdoc} --format xmi -d ${jsdocTarget} --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a> `date +'%d %b %G'`" ${jsdocSource}

# publish design
xsltproc --novalid --param section.autolabel 1 --param toc.section.depth 5 -o ${targetDir}/docs/design/index.html ${docbookXsl} ${mapbuilderDir}/design/mapbuilder-lib.xml

# copy the design images
cp -pr ${mapbuilderDir}/design/images/* ${targetDir}/docs/design/images/