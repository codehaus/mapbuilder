Mapbuilder, Open Source, GML Viewer
===================================
Last updated: 7 November 2006.

About
=====
This draft Mapbuilder release provides rendering of GML3 inside a web browser.
This demonstrates that a dataset the size of MSD3 can be rendered in Mozilla
based browsers using Scalable Vector Graphics (SVG).
The MSD3 dataset can be rendered in Internet Explorer using VML, however
performance is a major issue. The full MSD3 dataset takes ~10mins to render.
Optimization is being investigated for the next phase.

How to execute
==============
Uncompress mapbuilder-ows4-draft1 into a directory.
In a gecko based web browser (eg Firefox or Mozilla) open
file:///..../demo/gml3/index.html

The full MSD3 dataset is viewable from:
file:///..../demo/gml3/indexAll.html

Note, drawing the full dataset in Firefox takes around 40 seconds.
In IE, it takes around 10 minutes.

Limitations
===========
This release is the halfway point for the project and hence is still
missing functionality.

In particular:
* SVG rendering in firefox/mozilla has been implemented so far and has reasonable performance.
VML rendering in Internet Explorer is still very slow and takes ~ 10 mins to render the entire MSD3 dataset.

* Optimization has not been investigated yet.

* A WMS layer has not been integrated yet as the standard WMS servers we
have used in the past don't support the MSD3 SRS.

* Styling has not been implemented yet. This will be implemented using a subset
 of the Styled Layer Descriptor (SLD) specification.

* Differentiation of Inner and Outer rings for polygons has not been addressed.

* Only limited testing has been applied so far.

GeoDSS for the the OWS4 Testbed
===============================
Geo-Decision Support Services (GeoDSS) provide interoperable access to
distributed geospatial web services to aid decision makers in forming,
analyzing, and selecting alternatives.  GeoDSS utilizes workflow management
to produce context-specific results from information and knowledge from
multiple communities.   The GeoDSS subtask will extend the Decision Support
and the Information Interoperability work done in OWS-3 to include
multilingual interoperability and compressed GML data.

The GML OS Client is designed for distribution with GML 3.2 data to provide
an simple, self-contained map and data viewer. This client shall provide
mapping services for WMS, WFS and WFS-T interfaces.   The GML Viewer shall
include in-browser Vector Rendering capabilities. GML will be rendered
using inbuilt browser vector rendering (available in recent browsers).  

Deliverable
===========
16 October 2006: Phase 1: Draft GML OS Client

15 November 2006: Phase 2: Final GML OS Client

GML Viewer shall:
1.	Build a Map Pane based upon a Context document which includes layers
        from WMS, local GML files, GML files on the network.
2.	Provide a List of Layers and their icons for WMS layers.
3.	Hide/unhide layers.
4.	Provides zoom/pan tools.
5.	Render GML 3.2 features into a MapPane.  GML the size of the MSD3
        dataset will be rendered.
6.	Render a GML 3.2 feature’s attributes into a list.
7.	Support specific versions of Firefox and Internet Explorer browsers. 
        (At a minimum).
8.	The GML Viewer will be accessible from a local directory using nothing
        but a recent web browser (Firefox or Internet Explorer).
Where time and budget permits, the GML Viewer may also provide:
9.	 Search via CS/W.
10.	Editing of features using WFS-T interface.
11.	Editing of Context to insert WMS and WFS layers.

Due to the size of the GML 3.2 specification and the limitations of web browsers, only a subset of the GML 3.2 features will be supported by the GML OS Client, which will include those needed to encode MSD3 data sets.

Credits
=======
Sponsor:    Open Geospatial Consortium
Project:    Open Web Services 4 Testbed. (OWS4 Testbed)
Contractor: Thales Australia
Author:     Cameron Shorter cameronATshorter.net
Codebase:   This project extends http://communitymapbuilder.org , an open
            source, standards compliant, browser based, webmapping client.
