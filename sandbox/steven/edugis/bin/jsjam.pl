#!/usr/bin/perl -w

# This was downloaded from:
# http://www.anvilon.com/software/jsjam
#

use strict;
#
# Copyright 1998-2002 Eric Hammond <ehammond@thinksome.com>
#

#---- Setup

BEGIN { # Set envariables for -T tainting.
  $ENV{'PATH'} = '';
  $ENV{'ENV'}  = '';
}
BEGIN { # Extract path and program name.
  use vars qw($path $prog);
  $0 =~ m%(.*)[/\\]([^/\\]*)%;
  ($path, $prog) = ($1 || '.', $2 || $0);
}

#---- Packages

use Getopt::Long;
use sigtrap qw(die normal-signals);
use IO::File;
use POSIX;

#---- Constants

# Version is extracted from CVS/RCS revision.
my $REVISION = '$Revision: 1263 $';
use vars qw($VERSION);
($VERSION = $REVISION) =~ s%^\$.evision: (.*?) \$$%$1%;

# Reserved keywords and other identifiers as specified in
# "JavaScript: The Definitive Guide" by David Flanagan
# Plus a few additional things like standard object/method names.
my %RESERVED = map { $_ => 1 }
  qw(
     anchor area array boolean button checkbox date document element
     fileupload form frame function hidden history image javaarray
     javaclass javaobject javapackage link location math mimetype
     navigator number object option packages password plugin radio
     reset select string submit text textarea window abstract alert
     assign blur boolean break byte case catch char class cleartimeout
     close closed confirm const continue default defaultstatus delete
     do document double else escape eval extends false final finally
     float focus for frames function getclass goto history if
     implements import in instanceof int interface isnan java length
     location long name native navigate navigator netscape new null
     onblur onerror onfocus onload onunload open opener package parent
     parsefloat parseint private prompt protected prototype public ref
     return scroll self settimeout short static status sun super
     switch synchronized taint this throw throws tostring top
     transient true try typeof unescape untaint valueof var void while
     window with

     anchor applet area array boolean button checkbox date document e
     element embed fileupload form frame function hidden history image
     jsobject javaarray javaclass javamethod javaobject javapackage
     ln10 ln2 log10e log2e link location max_value min_value math
     mimetype negative_infinity nan navigator number object option pi
     positive_infinity packages password plugin radio reset sqrt1_2
     sqrt2 select string submit text textarea url utc window abs acos
     action alert alinkcolor anchor anchors appcodename appname
     appversion applets arguments asin assign atan atan2 back bgcolor
     big blink blur bold border call caller ceil charat checked clear
     cleartimeout click close closed complete confirm constructor
     cookie cos current defaultchecked defaultselected defaultstatus
     defaultvalue description document domain elements embeds
     enabledplugin encoding escape eval exp fgcolor filename fixed
     floor focus fontcolor fontsize form forms forward frames getclass
     getdate getday gethours getmember getminutes getmonth getseconds
     getslot gettime gettimezoneoffset getwindow getyear go hash
     height history host hostname href hspace images index indexof
     isnan italics java javaenabled join lastindexof lastmodified
     length link linkcolor links location log lowsrc max method
     mimetypes min name navigate navigator netscape next onabort
     onblur onchange onclick onerror onfocus onload onmouseout
     onmouseover onreset onsubmit onunload open opener options parent
     parse parsefloat parseint pathname plugins port pow previous
     prompt protocol prototype random referrer refresh reload
     removemember replace reset reverse round scroll search select
     selected selectedindex self setdate sethours setmember setminutes
     setmonth setseconds setslot settime settimeout setyear sin small
     sort split sqrt src status strike sub submit substring suffixes
     sun sup taint taintenabled tan target text title togmtstring
     tolocalestring tolowercase tostring touppercase top type unescape
     untaint useragent value valueof vlinkcolor vspace width window
     write writeln

     fromcharcode all screen classname innertext
    );

#---- Options

use vars qw($debug);
$debug          = 0;
my $help        = 0;
use vars qw($quiet);
$quiet          = 0;
my $version     = 0;
my $keep_identifiers = 0;
my $keep_globals     = 0;
my $keep_whitespace  = 0;
my $keep_newlines    = 0;
my $keep_comments    = 0;
my $add_note         = undef;

Getopt::Long::config('no_ignore_case');
GetOptions(
           'debug'              => \$debug,
           'help'               => \$help,
           'quiet'              => \$quiet,
           'version'            => \$version,

           'keep-identifiers'   => \$keep_identifiers,
           'i'                  => \$keep_identifiers,

           'keep-globals'       => \$keep_globals,
           'g'                  => \$keep_globals,

           'keep-whitespace'    => \$keep_whitespace,
           'w'                  => \$keep_whitespace,

           'keep-newlines'      => \$keep_newlines,
           'n'                  => \$keep_newlines,

           'keep-comments'      => \$keep_comments,
           'c'                  => \$keep_comments,

           'add-note:s'         => \$add_note,
           'a:s'                => \$add_note,
          )
  or die_usage();

#---- Initialization

# Don't buffer output.
STDOUT->autoflush(1);
STDERR->autoflush(1);

#---- Main

$quiet or warn "$prog v${VERSION}a\n";
die_usage() if $help;
exit 0 if $version;

# Can't keep comments without keeping newlines
$keep_newlines = 1 if $keep_comments;

# Use stdin if no files specified.
unshift(@ARGV, '-') unless scalar @ARGV;

# For each file...
my $filename;
while ( $filename = shift ) {
  $debug and warn "$main::prog: Processing $filename\n";

  local($/) = undef;
  open(FILE, "< $filename")
    or die "$main::prog: Unable to open: $filename: $!";
  my $contents = <FILE>;
  close(FILE);

  $contents = jam($contents);

  print $contents;
}

exit 0;

#---- Functions

#
# jam - compress the code.
#
sub jam {
  my ($contents) = @_;

  # Identifiers which should not be shortened are indicated in the code using:
  # //jsjam-keep:identifier
  # where "identifier" is the identifier which should not be shortened.
  while ( $contents =~ s%//\s*jsjam-keep\s*:\s*(\w+).*\n%\n% ) {
    my $word = "\L$1\E";
    ++ $RESERVED{$word};
  }

  # Regexp for non-greedy stuff, counting quoted strings as opaque chunks.
  # Also count as quoted first arg of replace,match,search when it's /.*/
  my $stuff_with_strings = <<'EOM';
  (?:
   <!-- .*? -->
  |
   \b (?: replace | match | search ) \s* \( \s* / (?: \\/ | [^/] )* /
  |
   [^"']+?
  |
   " (?: \\" | [^"] )* "
  |
   ' (?: \\' | [^'] )* '
  )*?
EOM

  my $starts_with_comment = $1 if $contents =~ s%^(<!--.*?\n)%%;

  if ( not $keep_comments ) {
    # Remove comments.
    $debug and warn "$main::prog: Removing comments\n";
    # Remove comments as long as the comments are not quoted.
    # $source = the remainder of the document to process
    my $source=$contents;
    my $result="";

    while(length($source)>1){
      # match \" or \' or "" or ''
      # and copy to result
      $source =~ s/^(\\"|\\'|""|'')// && do {
        $result.=$1;
        next;
      };

      # match ".." or '..'
      # and copy quoted text to result
      $source =~ s/^(".*?[^\\]"|'.*?[^\\]')// && do {
        $result.=$1;
        next;
      };

      # match //
      # remove text to end of line
      $source =~ s/^\/\/.*?\n// && do {
        next;
      };

      # match /*
      # remove text to */
      $source =~ s/^\/\*.*?\*\///s && do {
        next;
      };

      # match string before /* or // or \" or \' or " or '
      $source =~ s/^(.+?)(\/\*|\/\/|\\"|\\'|"|')/$2/s && do {
        $result.=$1;
        next;
      };

      # Copy remainder of input.
      $result.=$source;
      last;
    }
    $contents=$result;
  }

  if ( not $keep_identifiers ) {
    my $new_contents = '';

    if ( not $keep_globals ) {
      # Shorten all identifiers.
      $debug and warn "$main::prog: Shortening all identifiers\n";
      while ( $contents =~ s%^($stuff_with_strings)\b([_A-Za-z]\w*)%%sx ) {
        $new_contents .= $1.word($2);
      }

    } else {
      # Shorten var identifiers only (TBD: may conflict with globals).
      $debug and warn "$main::prog: Shortening 'var' identifiers\n";
      while ($contents =~ s%^($stuff_with_strings\bvar\s+)([_A-Za-z]\w*)%%sx) {
        $new_contents .= $1.word($2);
      }
    }
    $contents = $new_contents . $contents;
  }

  if ( not $keep_whitespace ) {
    # Remove blank lines.
    $debug and warn "$main::prog: Removing blank lines\n";
    $contents =~ s%^(\s*\n)%%gm;

    # Compress whitespace.
    my $new_contents = '';

    if ( not $keep_newlines ) {
      $debug and warn "$main::prog: Compressing whitespace\n";
      while ( $contents =~ s%^($stuff_with_strings)\s+%%sx ) {
        $new_contents .= $1.' ';
      }

    } else {
      $debug and warn "$main::prog: Compressing non-newline whitespace\n";
      while ( $contents =~ s%^($stuff_with_strings)([\ \t]|$)+%%sx ) {
        $new_contents .= $1.' ';
        last if $contents =~ m%^\s*$%;
      }

    }
    $contents = $new_contents . $contents;

    # Remove whitespace which has punctuation on one side.
    $new_contents = '';
    $debug and warn "$main::prog: Removing unneeded whitespace\n";

    my $re_space = $keep_newlines ? '[ \t]' : '\s';
    while ( $contents =~ s%^($stuff_with_strings)$re_space(\S|$)%$2%sx ) {
      my ($stuff, $after) = ($1, $2);
      my $before = $1 if $stuff =~ m%(.)$%;
      next unless defined $before;
      $new_contents .= $stuff;
      if ( $before =~ m%[\w'"@]% and
           $after  =~ m%[\w'"@]% ) {
        $new_contents .= ' ';
      }
    }
    $contents = $new_contents . $contents;

    # Remove leading/trailing whitespace.
    $debug and warn "$main::prog: Removing leading/trailing whitespace\n";
    $contents =~ s%^\s+%%gm;
    $contents =~ s%\s*$%\n%;

    # Fixup HTML comments.
    $contents =~ s%(<!--.*-->)%\n$1\n%g;
    if ( $starts_with_comment ) {
      $contents = $starts_with_comment . $contents . "\n// -->\n";
    }
  }

  # Add note if desired.
  if ( defined $add_note ) {
    my $time_string = strftime("%Y/%M/%d %H:%M:%S",localtime);
    $contents .= <<"EOM";
// Compressed by jsjam <www.jsjam.com> $time_string $add_note
EOM
  }

  $contents;
}

#
# word - lookup/create mapping for a potential identifier.
#
BEGIN {
  use vars qw(%map $next_short);
  %map = ();

  $next_short = 'a';
}
sub word {
  my ($word) = @_;

  return $word if defined $RESERVED{"\L$word\E"};

  my $short = $map{$word};
  if ( not defined $short ) {
    while ( $RESERVED{$next_short} ) {
      ++ $next_short;
    }
    $short = $next_short ++;
    $map{$word} = $short;
    $debug and warn "$main::prog: Mapping: $word => $short\n";
  }

  $short;
}

#
# die_usage - Print usage string from manpage at end of file and die
#
sub die_usage {
  my $usage;
  open(PROG, "< $0")
    or die "$prog: Unable to open $0 to print usage";
  local($/) = undef;
  $usage = <PROG>;
  close(PROG);
  $usage =~ s%^.*?
              =head1\sSYNOPSIS\s+
              (.*?)\s+
              =head1\sOPTIONS\s*\n
              (.*?)\s*
              =head1.*$
             %Usage: $1\n$2\n%xs;
  die $usage;
}

=head1 NAME

jsjam - Compress JavaScript code.

=head1 SYNOPSIS

 jsjam [opts] file...

=head1 OPTIONS

 -d --debug             Debug mode.
 -h --help              Print help and exit.
 -q --quiet             Quiet mode.
 -v --version           Print version and exit.

 -i --keep-identifiers  Do not shorten identifiers.
 -g --keep-globals      Do not shorten non-"var" identifiers.
 -w --keep-whitespace   Do not compress whitespace.
 -n --keep-newlines     Do not remove newlines following stuff.
 -c --keep-comments     Do not compress comments (implies -n).

 -a --add-note N        Adds note "N" to the end of the compressed
                        output (in a // comment).

 The options --keep-identifiers and --keep-globals are not compatible.

=head1 ARGUMENTS

 file           One or more JavaScript files to compress.  If no files
                are specified, stdin is used.

=head1 DOWNLOAD

The jsjam Perl script is available here:

	http://www.anvilon.com/software/download/jsjam

=head1 DESCRIPTION

This program attempts to compress JavaScript so that it downloads
faster to the browser.  If the identifier compression is kept on, it
also has a side-effect of making the JavaScript fairly unreadable.

The compressed output for all input files is sent to stdout.

Compression methods include:

 - Strip comments.

 - Strip unnecessary whitespace.

 - Shorten identifiers (variable names, function names, field names).

Identifiers which should not be shortened can be indicated in the
JavaScript code using one line per identifier in the form:

        //jsjam-keep:identifier

where "identifier" is the identifier which should not be shortened.

=head1 EXAMPLES

 jsjam --debug mycode.js >mycode-jsjam.js

=head1 CAVEATS

This program was originally written to compress one particular set of
JavaScript software, but many others have found it useful for their
situations as well.  If this happens to work or almost work for you,
please drop a note to the author.  Bug reports are welcomed and may
even get fixed, especially if you can provide sample JavaScript code
that illustrates the problem.

If you have any short global variable names (1-2 characters), the
--keep-globals option will probably shorten local (var) variables so
that they conflict with the global variables.

The characters // may be treated as the start of a comment even if
they are inside a string.  To get around this, replace

        var url = "http://site/page/";

with

        var url = "http:/"+"/site/page/";

In addition to working well on Linux/Unix, this script has reportedly
been able to run on Perl under Windows, though some Windows users
report that it is better to remove the first line of this script file
(#!/usr/bin/perl -wT)

=head1 AUTHOR

Eric Hammond <ehammond@thinksome.com>

=cut


