#!/usr/bin/perl
#
################################################################################
# Description: Build a web page from a Web Map Context based on XslUrl.
#
# Instalation: Make sure xsltproc is installed
#              Install into a cgi-bin directory of your web server.
#
# Usage:       Call via http://hostname/cgi-bin/wmc.pl?context=url
#
# Author:      Cameron Shorter cameron @shorter.net
# License:     GPL as per: http://www.gnu.org/copyleft/gpl.html
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
# $Id$
# $Name$
################################################################################

$mapbuilderBaseUrl="../html/mapbuilder";
%cgiVars=getCgiVars();

print "Content-type: text/html\n\n";
print "<html>\n";
print "  <head><title>WMC Renderer</title></head>\n";
print "  <body>\n";
print '    <h1><a href="http://mapbuilder.sourceforge.net">Mapbuilder</a> Web Map Context Renderer</h1>';
print "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>\n";

system(
    "xsltproc",
    "--novalid",
    "$mapbuilderBaseUrl/widget/mappane/WmcLayer2DhtmlLayer.xml",
    $cgiVars{'context'});

system(
    "xsltproc",
    "--novalid",
    "$mapbuilderBaseUrl/widget/legend/Context2Legend.xml",
    $cgiVars{'context'});

print '  <p><i>A <a href="http://mapbuilder.sourceforge.net">Community Map Builder</a> Project</i></p>';
print "</html></body>\n";


# Read all CGI vars into an associative array.
# If multiple input fields have the same name, they are concatenated into
#   one array element and delimited with the \0 character (which fails if
#   the input has any \0 characters, very unlikely but conceivably possible).
# This is a simple version, that assumes a request method of GET.
sub getCgiVars {
    local(%in) ;
    local($name, $value) ;

    # Resolve and unencode name/value pairs into %in
    foreach (split(/[&;]/, $ENV{'QUERY_STRING'})) {
        s/\+/ /g ;
        ($name, $value)= split('=', $_, 2) ;
        $name=~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/ge ;
        $value=~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/ge ;
        $in{$name}.= "\0" if defined($in{$name}) ;  # concatenate multiple vars
        $in{$name}.= $value ;
    }

    return %in ;

}
