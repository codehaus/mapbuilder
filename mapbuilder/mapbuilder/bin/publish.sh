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

# Set variables
jsdoc="/home/cameron/work/jsdoc/jsdoc.pl";
jsdocTarget="${mapbuilderDir}/docs/jsdoc";
jsdocSource=" \
  ${mapbuilderDir}/lib/model \
  ${mapbuilderDir}/lib/widget \
  ${mapbuilderDir}/lib/tool \
  ${mapbuilderDir}/lib/util \
  ${mapbuilderDir}/lib/util/sarissa/Sarissa.js"

docbookXsl=/usr/share/sgml/docbook/xsl-stylesheets/html/docbook.xsl

docDirectories=" \
  ${mapbuilderDir}/docs \
  ${mapbuilderDir}/docs/jsdoc \
  ${mapbuilderDir}/docs/design \
  ${mapbuilderDir}/docs/design/images"


# Create docs directories
for dir in ${docDirectories} ; do
  if [ ! -d ${dir} ]
  then
    mkdir ${dir};
  fi;
done

# Execute jsdoc
${jsdoc} -d ${jsdocTarget} --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a>" ${jsdocSource}

# publish design
xsltproc --novalid --param section.autolabel 1 --param toc.section.depth 5 -o ${mapbuilderDir}/docs/design/index.html ${docbookXsl} ${mapbuilderDir}/design/mapbuilder-lib.xml

# copy the design images
cp -pr ${mapbuilderDir}/design/images/* ${mapbuilderDir}/docs/design/images/
