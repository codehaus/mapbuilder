#!/usr/bin/perl

# Find trip based on a WMS 1.1.1 GetFeatureInfo query
# this will look something like:
# http://www.a.com/cmb/middleware/cmbWMSGetFeatureInfo.pl? \
#   REQUEST=GetFeatureInfo&X=5&y=87&BBOX=-72.01,42.05,-72.4,42.9 \
#   &QUERY_LAYERS=route&FEATURE_COUNT=1&INFO_FORMAT=text/html&VERSION=1.1.1

# user variables
$dbuser = "webster";
$dbname = "cmb";
$dbaddress = "localhost";
$srs = "4326"; #hardcoded SRS--BAD
$wiggle = 2;

# Invoke needed library modules
use CGI;
use DBI;

# Limit command path
($ENV{'PATH'} = '/bin:/usr/bin:/usr/local/bin'); # =~ s/\s*,\s*/:/g;

# Retrieve parameters from (lower-cased) GET/POST query string
$ENV{'QUERY_STRING'} =~ tr/A-Z/a-z/ if defined $ENV{QUERY_STRING};
$query = new CGI;
$errfmt = $query->param('exceptions');

# Set up database access
$database = "DBI:Pg:dbname=$dbname;host=$dbaddress";
$dbh = DBI->connect("$database", $dbuser) or die $DBI::errstr;

# add some wiggle room and transform the user-specified point 
# into a PostGIS BOX3D for a bounding box query

# get point
$ptx = int $query->param('x');
$pty = int $query->param('y');
# make a box
$ptminx = $ptx - $wiggle;
$ptmaxx = $ptx + $wiggle;
$ptminy = $pty + $wiggle;
$ptmaxy = $pty - $wiggle;

# translate image coords to geographic coords
$imgwidth = int $query->param('width');
$imgheight = int $query->param('height');
$bbox = $query->param('bbox');
@coords = split(",",$bbox);
$minx = $coords[0];
$miny = $coords[1];
$maxx = $coords[2];
$maxy = $coords[3];

$findminx = projectX($ptminx, 0, $imgwidth, $minx, $maxx);
$findmaxx = projectX($ptmaxx, 0, $imgwidth, $minx, $maxx);
$findminy = projectY($ptminy, 0, $imgheight, $miny, $maxy);
$findmaxy = projectY($ptmaxy, 0, $imgheight, $miny, $maxy);

# get first parameter of query_layers
$layerlist = $query->param('query_layers');
@layers = split(",",$layerlist);
$bboxsql = "$layers[0] && GeometryFromText(\'BOX3D($findminx $findminy,$findmaxx $findmaxy)\'::box3d,$srs)";

# Query database for featureids of features that touch the bbox
$sql = "SELECT featureid,name FROM feature WHERE $bboxsql";
$sth = $dbh->prepare("$sql");
$sth->execute or die "Couldn't execute featureid query\n";

$foundfeatures = 'false';
$foundstories = 'false';

$featurecount = $query->param('feature_count');
my $i = 0;
while (@row = $sth->fetchrow_array) {
	$foundfeatures = 'true';

	# only get number of features requested
	$i += 1;
	if ($i > $featurecount) { last; }
	
	($featureid,$name) = @row;
	#warn("got matching featureid: $featureid\n");
	push(@fids, $featureid);
	push(@names, $name);
}
#eventually use the name as the display text in the HTML

if ($foundfeatures eq 'true') {	
	# Query database for storyids that have those featureids
	$sql = "SELECT storyid from story WHERE ";
	foreach $fid (@fids) {
		$sql .= "featureid=$fid OR ";
	}
	$sql = substr($sql,0,-3);
	$sth = $dbh->prepare("$sql");
	$sth->execute or die "Couldn't execute storyid query\n";
	while (@row = $sth->fetchrow_array) {
		$foundstories = 'true';
		($storyid) = @row;
		push(@sids, $storyid);
	}
} 

if ($foundfeatures eq 'false' && $errfmt eq 'application/vnd.ogc.se_xml') {
	returnNoMatchOGCXML();
}

# Present these to user as a web page
print "Content-Type: text/html\n\n";
print "<html>\n<head>\n";
print "  <link href=\"../normal.css\" rel=\"stylesheet\" type=\"text/css\">\n";
print "  <title>Matching Events</title>\n  </head>\n";
print "<body>\n";
if ($foundstories eq 'true') {
	print "<h1>Matching Events</h1>\n";
	foreach $sid (@sids) {
		print "<h3><a href=\"/cmb/www/middleware/getStory.pl?id=$sid\">Event</a></h3>\n";
	}
} else {
	print "<h1>No Matching Events</h1>\n";
}
print "</body>\n</html>\n";


sub projectX() {
	$newmax = pop @_;
	$newmin = pop @_;
	$pixmax = pop @_;
	$pixmin = pop @_;
	$pt = pop @_;
	$pctchange = ( $pt - $pixmin ) / ( $pixmax - $pixmin );
	return ($newmin + ( ($newmax - $newmin) * $pctchange ));
}

sub projectY() {
	$newmax = pop @_;
	$newmin = pop @_;
	$pixmax = pop @_;
	$pixmin = pop @_;
	$pt = pop @_;
	$pctchange = ( ($pixmax-$pixmin) - ($pt-$pixmin) ) / ( $pixmax - $pixmin );
	return ($newmin + ( ($newmax - $newmin) * $pctchange ));
}


sub returnNoMatchOGCXML() {
  $fullurl = $query->url(-query=>1);
	print "Content-Type: $errfmt\n\n";
	print "<? xml version=\"1.0\" ?>\n";
	print "<!DOCTYPE ServiceExceptionReport SYSTEM ";
	print "\"http://www.digitalearth.gov/wmt/xml/exception_1_1_1.dtd\">\n";
	print "<ServiceExceptionReport version=\"1.1.1\">\n";
	print "<ServiceException>URL: $fullurl</ServiceException>\n";
	print "<ServiceException>No matching features. Try zooming in and clicking on the point again.</ServiceException>\n";
	print "</ServiceExceptionReport>\n";
	exit; # don't continue!
}


