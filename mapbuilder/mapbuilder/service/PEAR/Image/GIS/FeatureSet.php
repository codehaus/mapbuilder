<?php
//
// +------------------------------------------------------------------------+
// | PEAR :: Image :: GIS :: Line Set                                       |
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

require_once 'Image/GIS/Feature.php';

/**
 * A Set of Features.
 *
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_FeatureSet {

    /**
    * @var Image_GIS_Style      $style
    */
    var $style;

    /**
    * @var array $lines
    */
    var $features = array();

    /**
    * @var array $min
    */
    var $min = false;
    /**
    * @var array $max
    */
    var $max = false;

    /**
    * Constructor.
    *
    * @param  Image_GIS_Style $style
    * @access public
    */
    function Image_GIS_FeatureSet($style) {
        $this->style = $style;
    }

    /**
    * Adds a feature to the feature set.
    *
    * @param  array $coordinates
    * @access public
    */
    function addFeature($coordinates = array(), $labelText = null, $symbolText = null) {
        $this->features[] = new Image_GIS_Feature($coordinates, $labelText, $symbolText);
    }
}
?>
