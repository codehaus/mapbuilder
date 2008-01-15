#!/usr/bin/env python


"""This is a blind proxy that we use to get around browser
restrictions that prevent the Javascript from loading pages not on the
same server as the Javascript.  This has several problems: it's less
efficient, it might break some sites, and it's a security risk because
people can use this proxy to browse the web and possibly do bad stuff
with it.  It only loads pages via http and https, but it can load any
content type. It supports GET and POST requests."""

import urllib2
import cgi
import sys, os
import zipfile, re, StringIO #for KMZ support


# Designed to prevent Open Proxy type stuff.


allowedHosts = ['www.openlayers.org', 'openlayers.org', 
                'labs.metacarta.com', 'world.freemap.in', 
                'prototype.openmnnd.org', 'geo.openplans.org',
                'geo.openplans.org:8080', 'wight.demos.galdosinc.com',
                'code.google.com', 'maps.google.com', 'bbs.keyhole.com',
                'press.jrc.it' ]

method = os.environ["REQUEST_METHOD"]

qs = os.environ["QUERY_STRING"]
if method == "GET":
    qs = qs.replace('+', '%2B')
d = cgi.parse_qs(qs)
if d.has_key("url"):
    url = d["url"][0]
else:
    url = "http://www.openlayers.org"

try:
    host = url.split("/")[2]
    isLocalHost = (os.environ["SERVER_NAME"] == "localhost") or (os.environ["HTTP_HOST"] == "localhost")
    #isLocalHost = False
    if not isLocalHost and allowedHosts and not host in allowedHosts:
        print "Status: 502 Bad Gateway"
        print "Content-Type: text/plain"
        print
        print "This proxy does not allow you to access that location: ", host
        print 
        print os.environ
  
    elif url.startswith("http://") or url.startswith("https://"):
    
        if method == "POST":
            length = int(os.environ["CONTENT_LENGTH"])
            headers = {"Content-Type": os.environ["CONTENT_TYPE"]}
            body = sys.stdin.read(length)
            r = urllib2.Request(url, body, headers)
            y = urllib2.urlopen(r)
        else:
            y = urllib2.urlopen(url)
        
        # print content type header
        i = y.info()
        if i.has_key("Content-Type"):
            print "Content-Type: %s" % (i["Content-Type"])
        else:
            print "Content-Type: text/plain"
        print

        # Handle KMZ files
        # First put content in StringIO object, so ZipFile can handle it
        fileObject = StringIO.StringIO()
        fileObject.write(y.read())

        # Now try to handle it as a ZIP file
        try:
            zipObject = zipfile.ZipFile(fileObject, "r")

        # if not, print the contents (most cases)
        except zipfile.BadZipfile:
            fileObject.seek(0) # reset pointer to start of file
            print fileObject.read()

        # It *is* a ZIP! Now loop through all files in ZIP
        # and only print the ones ending in .kml
        else:
            for info in zipObject.infolist():
                if re.search(r'''\.kml$''', info.filename):
                  print zipObject.read(info.filename)
            zipObject.close()
        
        fileObject.close()
        y.close()
    else:
        print "Content-Type: text/plain"
        print
        print "Illegal request."

except Exception, E:
    print "Status: 500 Unexpected Error"
    print "Content-Type: text/plain"
    print 
    print "Some unexpected error occurred. Error text was:", E
