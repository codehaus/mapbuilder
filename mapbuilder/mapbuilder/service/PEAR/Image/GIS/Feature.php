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

/**
 * A Feature.
 *
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Feature {

    /**
    * @var array $coordinates
    */
    var $coordinates = array();

    /**
    * @var string $labelText
    */
    var $labelText;

    /**
    * @var string symbolText
    */
    var $symbolText;

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
    * @var array $coordinates
    * @access public
    */
    function Image_GIS_Feature($coordinates = array(), $labelText = null, $symbolText = null) {
        $this->coordinates = $coordinates;
        $this->labelText = $labelText;
        $this->symbolText = $symbolText;
    }

    /**
    * Adds a coordinate to the feature.
    *
    * @param  float $x
    * @param  float $y
    * @access public
    */
    function addCoordinate($x, $y) {
        $this->coordinates[] = array($x, $y);
    }
}
?>
