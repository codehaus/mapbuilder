<?php
//
// +------------------------------------------------------------------------+
// | PEAR :: Image :: GIS :: Parser Base Class                              |
// +------------------------------------------------------------------------+
// | Copyright (c) 2002-2004 Jan Kneschke <jan@kneschke.de> and             |
// |                         Sebastian Bergmann <sb@sebastian-bergmann.de>. |
// +------------------------------------------------------------------------+
// | This source file is subject to version 3.00 of the PHP License,        |
// | that is available at http://www.php.net/license/3_0.txt.               |
// | If you did not receive a copy of the PHP license and are unable to     |
// | obtain it through the world-wide-web, please send a note to            |
// | license@php.net so we can mail you a copy immediately.                 |
// +------------------------------------------------------------------------+
//
// $Id$
//

require_once 'Cache/Lite.php';
require_once 'Image/GIS/LineSet.php';

/**
 * Parser Base Class.
 *
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Parser {
    /**
    * Cache.
    *
    * @var Cache_Lite $cache
    */
    var $cache = NULL;

    /**
    * Data Files.
    *
    * @var array $dataFiles
    */
    var $dataFiles = array();

    /**
    * Set to TRUE to enable debugging.
    *
    * @var boolean $debug
    */
    var $debug;

    /**
    * Line Set.
    *
    * @var array $lineSets
    */
    var $lineSets = array();

    /**
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
    function Image_GIS_Parser($cache, $type, $dataSource, $style, $debug) {
        if ($cache) {
            $this->cache = new Cache_Lite;
        }
        $this->type = $type;
        $this->dataSource = $dataSource;
        $this->style = $style;
        $this->debug = $debug;
    }

    /**
    * Factory.
    *
    * @param  string  $parser
    * @param  boolean $cache
    * @param  boolean $debug
    * @return object
    * @access public
    */
    function &factory($parser, $cache, $type, $dataSource, $style, $debug) {
        include_once 'Image/GIS/Parser/' . $parser . '.php';

        $class  = 'Image_GIS_Parser_' . $parser;
        $object = new $class($cache, $type, $dataSource, $style, $debug);

        return $object;
    }

    /**
    * Parses a data file.
    *
    * @param  array $range
    * @return mixed
    * @access public
    * @abstract
    */
    function parse($range) { /* abstract */ }
}
?>
