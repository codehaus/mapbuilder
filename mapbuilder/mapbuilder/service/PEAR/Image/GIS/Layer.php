<?php

require_once 'Image/GIS/Parser.php';
require_once 'Image/GIS/DataSource.php';
require_once 'Image/GIS/Style.php';

/**
 * A Layer in a map.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Layer {
    /**
    * Set to TRUE to enable debugging.
    *
    * @var boolean $debug
    */
    var $debug;

    /**
    * Image_GIS_DataSource sub-class object.
    *
    * @var Image_GIS_DataSource $dataSource
    */
    var $dataSource;

    /**
    * Image_GIS_Style sub-class object.
    *
    * @var Image_GIS_Style $style
    */
    var $style;

    /**
    * Image_GIS_Parser sub-class object.
    *
    * @var Image_GIS_Parser $parser
    */
    var $parser;

    /**
    * Constructor.
    *
    * @param  string $parameters
    * @access public
    */
    function Image_GIS_Layer($parameters, $debug) {
        $this->debug = $debug;
        $this->type = isset($parameters['type']) ? $parameters['type'] : 'polyline';
        $this->style = new Image_GIS_Style($parameters['style']);
        $this->dataSource = new Image_GIS_DataSource($parameters['dataSource']);
        $this->setParser(
            isset($parameters['parser'])   ? $parameters['parser']   : 'E00',
            isset($parameters['cache'])    ? $parameters['cache']    : false,
            isset($parameters['cacheDir']) ? $parameters['cacheDir'] : '/tmp'
        );
    }

    /**
    * Sets the Image_GIS_Parser sub-class to be used
    * to parse a data source.
    *
    * @param  string  $parser
    * @param  boolean $cache
    * @access public
    */
    function setParser($parser, $cache) {
        $this->parser = &Image_GIS_Parser::factory($parser, $cache, $this->type, $this->dataSource, $this->style, $this->debug);
    }

    function parse($range) {
        return $this->parser->parse($range);
    }
}
?>
