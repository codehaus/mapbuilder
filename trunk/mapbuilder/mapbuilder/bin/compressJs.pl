#!/usr/bin/perl -w

# Description: Strips white space and comments from javascript.
#   Assumes js lines are terminated with a semicolin rather
#   than <return> char.
# Author: Not sure.
# $Id$

use strict;

@ARGV == 1 or die "Usage: $0 <file>\n";

my $file = $ARGV[0];

my $comment = '';
my $content = '';

open(FILE, "<$file");
undef $/;
$content = <FILE>;
close(FILE);

if ($content =~ s#^\s*(/\*.*?\*/)##s or $content =~ s#^\s*(//.*?)\n\s*[^/]##s) {
  $comment = "$1\n";
}

# removing C/C++ - style comments:
$content =~ s#/\*[^*]*\*+([^/*][^*]*\*+)*/|//[^\n]*|("(\\.|[^"\\])*"|'(\\.|[^'\\])*'|.[^/"'\\]*)#$2#gs;

# save string literals
my @strings = ();
$content =~ s/("(\\.|[^"\\])*"|'(\\.|[^'\\])*')/push(@strings, "$1");'__CMPRSTR_'.$#strings.'__';/egs;

# remove C-style comments
$content =~ s#/\*.*?\*/##gs;
# remove C++-style comments
$content =~ s#//.*?\n##gs;
# removing leading/trailing whitespace:
$content =~ s#(?:(?:^|\n)\s+|\s+(?:$|\n))##gs;
# removing newlines:
$content =~ s#\r?\n##gs;

# removing other whitespace (between operators, etc.) (regexp-s stolen from Mike Hall's JS Crunchinator)
$content =~ s/\s+/ /gs;         # condensing whitespace
$content =~ s/\s([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])/$1/gs;
$content =~ s/([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])\s/$1/gs;

# restore string literals
$content =~ s/__CMPRSTR_([0-9]+)__/$strings[$1]/egs;

print $comment, $content;

