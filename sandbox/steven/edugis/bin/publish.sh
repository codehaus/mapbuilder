#!/bin/sh
# Build the mapbuilder documentation.
# Note, this is still a bit of a hack, and has hard coded directories which point
# to Cameron's directory structure which need to be changed before it can be used.
#
# Requires: jsdoc from http://jsdoc.sourceforge.net
#           xsltproc
#
# $Id: publish.sh 3243 2007-09-11 11:36:41Z gjvoosten $
# $Name$

mapbuilderDir=`dirname $0`/..;
targetDir="${mapbuilderDir}/staging";

# Set variables
jsdoc="${mapbuilderDir}/build/jsdoc/jsdoc.pl";
jsdocTarget="${targetDir}/docs/jsdoc";

# Directories and files that need to have jsdocs built from them
jsdocSource=" \
  ${mapbuilderDir}/lib/Mapbuilder.js \
  ${mapbuilderDir}/lib/model \
  ${mapbuilderDir}/lib/widget \
  ${mapbuilderDir}/lib/tool \
  ${mapbuilderDir}/lib/util \
  ${mapbuilderDir}/lib/util/sarissa/Sarissa.js"

docDirectories=" \
  ${targetDir} \
  ${targetDir}/docs \
  ${targetDir}/docs/jsdoc"


# Create docs directories
for dir in ${docDirectories} ; do
  if [ ! -d ${dir} ]
  then
    mkdir ${dir};
  fi;
done

# Execute jsdoc with HTML output
${jsdoc} -d ${jsdocTarget} --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a> `date +'%d %b %G'`" --logo lib/skin/default/images/Icon.gif ${jsdocSource}

# Execute jsdoc with XMI output
${jsdoc} --format xmi -d ${jsdocTarget} --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a> `date +'%d %b %G'`" --logo lib/skin/default/images/Icon.gif ${jsdocSource}
