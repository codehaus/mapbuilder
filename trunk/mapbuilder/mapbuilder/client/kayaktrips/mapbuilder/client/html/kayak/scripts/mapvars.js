// JavaScript Document
cmbtitle="Kayaking New England";
// if WMS is on a different server, add fully qualified domain name, e.g.
// wmsurl='http://www.spatialweb.net/cgi-bin/kayakmapserv?';
wmsurl='/cgi-bin/kayakmapserv?';
wmsfeaureinfourl='/cmb/www/middleware/cmbWMSGetFeatureInfo.pl?';
wmsversion='1.1.0';
wmssrs='EPSG:4326';
defminx=-71.60;
defmaxx=-69.25;
defminy=42.18;
defmaxy=44.00;
defimgwidth=450;
defimgheight=350;
panpercent=0.50;
zoompercents=[0.10, 0.40, 1.20];
layers='coastalrelief,states,rivstream,lakepond,roads,routes';
imageformat='image/png';
// optional: for overview map
ovminx=-73.83529232639995
ovmaxx=-67.01470767360004
ovminy=39.859157432319996
ovmaxy=45.14148256768001
ovimgwidth=75
ovimgheight=58

function projectX(pt, pixmin, pixmax, newmin, newmax) {
	pctchange = ( pt - pixmin ) / ( pixmax - pixmin );
	return newmin + ( (newmax - newmin) * pctchange );
}

function projectY(pt, pixmin, pixmax, newmin, newmax) {
	pctchange = ( (pixmax-pixmin) - (pt-pixmin) ) / ( pixmax - pixmin );
	return newmin + ( (newmax - newmin) * pctchange );
}

