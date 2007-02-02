#!/usr/bin/perl
#
################################################################################
# Description: Build a web page from a Web Map Context based on XslUrl.
#              This package is part of http://mapbuilder.sourceforge.net .
#
# Instalation: Make sure xsltproc is installed
#              Install into a cgi-bin directory of your web server.
#
# Usage:       Call via http://hostname/cgi-bin/wmc.pl?context=url
#
# Author:      Cameron Shorter cameron @shorter.net
# License:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation;
# version 2.1 of the License.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# $Id: wmc.pl 2245 2006-10-15 17:45:52Z tomkralidis $
# $Name$
################################################################################

use strict;
use warnings;
use CGI;

my $q = new CGI;

my $mapbuilderBaseUrl="../html/mapbuilder";

print $q->header("text/html");

print <<END;
<html>
	<head>
		<title>WMC Renderer</title>
	</head>
	<body>
		<h1><a href="http://mapbuilder.sourceforge.net">Mapbuilder</a> Web Map Context Renderer</h1>
		<hr/>
END

system(
    "xsltproc",
    "--novalid",
    "$mapbuilderBaseUrl/widget/mappane/WmcLayer2DhtmlLayer.xml",
    $q->param('context'));

system(
    "xsltproc",
    "--novalid",
    "$mapbuilderBaseUrl/widget/legend/Context2Legend.xml",
    $q->param('context'));

print <<END;
		<hr/>
		<a title="Community Mapbuilder href="http://www.communitymapbuilder.net/">Community Mapbuilder</a>
	</body>
</html>
END

