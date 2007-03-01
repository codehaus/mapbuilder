<?xml version="1.0"?>
<xsl:stylesheet xmlns:gml="http://www.opengis.net/gml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="xml" encoding="utf-8"/><xsl:param name="lineColor" select="'red'"/><xsl:param name="lineWidth" select="1"/><xsl:param name="objRef" select="objRef"/><xsl:param name="widgetNode" select="widgetNode"/><xsl:template match="/"><js><xsl:value-of select="$objRef"/>.jg=new jsGraphics(<xsl:value-of select="$objRef"/>.outputNodeId);
    
    <xsl:value-of select="$objRef"/>.jg.clear();
    <xsl:value-of select="$objRef"/>.jg.setColor("<xsl:value-of select="$lineColor"/>");
    <xsl:value-of select="$objRef"/>.jg.setStroke(parseInt(<xsl:value-of select="$lineWidth"/>));
      
    /** Empty XML to load when this tool is selected. */
    <xsl:value-of select="$objRef"/>.defaultModelUrl=<xsl:value-of select="$widgetNode"/>.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
    /** Reference to XML node to update when a feature is added. */
    <xsl:value-of select="$objRef"/>.featureXpath=<xsl:value-of select="$widgetNode"/>.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
    
    var coordsML = <xsl:value-of select="$objRef"/>.model.getXpathValue(<xsl:value-of select="$objRef"/>.model,<xsl:value-of select="$objRef"/>.featureXpath);
    var ArrayML = coordsML.split(" ");
     
    if (ArrayML.length &gt;1){     
        pointStart = ArrayML[0];
        pointEnd = ArrayML[1];
        
        //Split points in x and y coordinate
        start = pointStart.split(",");
        end = pointEnd.split(",");
        
        xStart=parseFloat(start[0]);
        yStart=parseFloat(start[1]);
        xEnd=parseFloat(end[0]);
        yEnd=parseFloat(end[1]);
        
        <xsl:value-of select="$objRef"/>.jg.drawMouseLine(xStart, yStart, xEnd, yEnd);  
        <xsl:value-of select="$objRef"/>.jg.paint();
    }
    </js></xsl:template></xsl:stylesheet>
