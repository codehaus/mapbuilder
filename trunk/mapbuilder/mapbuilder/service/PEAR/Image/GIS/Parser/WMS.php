<?php

require_once 'Image/GIS/Parser.php';

/**
 * Image Parser.
 *
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */

class Image_GIS_Parser_WMS extends Image_GIS_Parser {
    /**
    * Constructor.
    *
    * @param  boolean              $cache
    * @param  string               $type
    * @param  Image_GIS_DataSource $dataSource
    * @param  Image_GIS_Style      $style
    * @param  boolean              $debug
    * @access public
    */
    function Image_GIS_Parser_WMS($cache, $type, $dataSource, $style, $debug) {
        $this->Image_GIS_Parser($cache, $type, $dataSource, $style, $debug);
    }

    /**
    * Parses a data layer.
    *
    * @param  array $range
    * @return mixed
    * @access public
    */
    function parse($range) {
        $wms->uri = $this->dataSource->uri;
        return array('wms' => $wms);
    }
}
?>
