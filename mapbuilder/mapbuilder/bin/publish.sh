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
  ${mapbuilderDir}/lib/widget/buttonbar \
  ${mapbuilderDir}/lib/widget/collectionList \
  ${mapbuilderDir}/lib/widget/locations \
  ${mapbuilderDir}/lib/widget/legend \
  ${mapbuilderDir}/lib/widget/mappane \
  ${mapbuilderDir}/lib/widget/tool \
  ${mapbuilderDir}/lib/util \
  ${mapbuilderDir}/lib/util/sarissa/Sarissa.js"

docbookXsl=/usr/share/sgml/docbook/xsl-stylesheets/html/docbook.xsl


# Create docs directories
if [ ! -d ${mapbuilderDir}/docs ]
then
  mkdir ${mapbuilderDir}/docs;
fi;
if [ ! -d ${mapbuilderDir}/docs/jsdoc ]
then
  mkdir ${mapbuilderDir}/docs/jsdoc;
fi;
if [ ! -d ${mapbuilderDir}/docs/design ]
then
  mkdir ${mapbuilderDir}/docs/design;
fi;
if [ ! -d ${mapbuilderDir}/docs/design/images ]
then
  mkdir ${mapbuilderDir}/docs/design/images;
fi;
if [ ! -d ${mapbuilderDir}/docs/layoutguide ]
then
  mkdir ${mapbuilderDir}/docs/layoutguide;
fi;

# Execute jsdoc
${jsdoc} -d ${jsdocTarget} --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a>" ${jsdocSource}


# publish design
xsltproc --novalid --param section.autolabel 1 --param toc.section.depth 5 -o ${mapbuilderDir}/docs/design/index.html ${docbookXsl} ${mapbuilderDir}/design/design.xml

# copy the design images
cp -pr ${mapbuilderDir}/design/images/* ${mapbuilderDir}/docs/design/images/

# publish LayoutGuide
xsltproc --novalid --param section.autolabel 1 --param toc.section.depth 5 -o ${mapbuilderDir}/docs/layoutguide/index.html ${docbookXsl} ${mapbuilderDir}/design/LayoutGuide.xml

