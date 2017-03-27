<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!--
		Description: Displays the mapbuilder version.
		The $Version: $ tag is changed during the ant build process to
		the current version.
		Author:      Cameron Shorter
		Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
		
		$Id: Version.xsl 2175 2006-08-16 10:34:37Z camerons $
		$Name$
	-->

	<xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>
	<!-- Main html -->
	<xsl:template match="/">
		<div id="menubar"><!-- left side of the middle div-->
			<h2>Basic</h2>
			<ul>
				<li>
					<a href="../simple/index.html"
						title="simple map demo">
						Simple Map Viewer
					</a>
				</li>
				<li>
					<a href="../interactive/index.html"
						title="interactive map demo">
						Interactive Map Viewer
					</a>
				</li>

				<li>
					<a href="../mapViewer/index.html"
						title="enhanced map demo">
						Enhanced Map Viewer
					</a>
				</li>

				<li>
					<a href="../wmts/index.html"
						title="WMTS map demo">
						WMTS Map Viewer
					</a>
				</li>
			</ul>
			<h2>Complex</h2>
			<ul>
				<li>
					<a href="../Demis/index.html"
						title="Demis map viewer">
						Different maps connected
					</a>
				</li>
				<li>
					<a href="../timeSeries/index.html"
						title="Time series viewer">
						Time series viewer
					</a>
				</li>
				<li>
					<a href="../wfs-t/index.html"
						title="Feature entry">
						Feature entry
					</a>
				</li>

				<li>
					<a href="../OWSExplorer/index.html"
						title="OWS Explorer">
						Open Web Services Explorer
					</a>
				</li>
			</ul>
			<h2>New</h2>
			<ul>
				<li>
					<a href="../catalog/index.html"
						title="Catalog Client">
						Catalog Client
					</a>
				</li>
				<li>
					<a href="../mergeModels/index.html"
						title="Complex Vector Rendering with GmlRendererOL and MergeModels">
						Complex Vector Rendering
					</a>
				</li>
				<li>
					<a href="../flickr/index.html"
						title="GeoRSS feed example">
						Live flickr feed viewer
					</a>
				</li>
				<li>
					<a href="../shipTracks/index.html"
						title="GeoRSS Ship tracks">
						GeoRSS Shiptracks
					</a>
				</li>

				<li>
					<a href="../GeoBliki/index.html"
						title="GeoBliki example">
						WFS query, Popup Feature information
					</a>
				</li>
				<li>
					<a href="../Google/index.html"
						title="Google Map Viewer">
						Google Map Viewer
					</a>
				</li>
				<li>
					<a href="../projDemo/index.html"
						title="Reprojecting vector data on the fly">
						Projections
					</a>
				</li>
				<li>
					<a href="../openlayers/index.html"
						title="Webmap.js integration">
						OpenLayers integration
					</a>
				</li>
				<li>
					<a href="../i18n/index.html"
						title="I18N map demo">
						I18N Map Viewer
					</a>
				</li>
			</ul>
            <h2><a href="../" style="color:black">
                <b>All examples</b></a>
            </h2>
            <p>Note: Some examples use external servers that may have been reconfigured or taken down, causing error messages or other unexpected behaviour.
            </p>
			

		</div><!-- /menubar -->
	</xsl:template>

	<xsl:template match="text()|@*" />
</xsl:stylesheet>
