@echo off
rem Build the mapbuilder documentation.
rem copied from publish.sh
rem
rem Requires: jsdoc from http://jsdoc.sourceforge.net
rem           perl from http://www.activestate.com/activeperl
rem           xsltproc
rem
rem $Id: $
rem $Name$

set mapbuilderDir=.
set targetDir=%mapbuilderDir%

rem Set variables
set jsdoc="%mapbuilderDir%/build/jsdoc/jsdoc.pl"
set jsdocTarget="%targetDir%/docs/jsdoc"

rem Directories and files that need to have jsdocs built from them (i.e. all sources)
set jsdocSource=%mapbuilderDir%/lib/Mapbuilder.js %mapbuilderDir%/lib/model %mapbuilderDir%/lib/widget %mapbuilderDir%/lib/tool %mapbuilderDir%/lib/util %mapbuilderDir%/lib/util/sarissa/Sarissa.js

rem Execute jsdoc with HTML output
%jsdoc% -d %jsdocTarget% --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a> %date%" --logo lib/skin/default/images/Icon.gif %jsdocSource%

rem Execute jsdoc with XMI output
%jsdoc% --format xmi -d %jsdocTarget% --project-name "<a href='http://mapbuilder.sourceforge.net'>Community Map Builder</a> %date%" --logo lib/skin/default/images/Icon.gif %jsdocSource%

