<?php
//
// +------------------------------------------------------------------------+
// | PEAR :: Image :: GIS :: Renderer Base Class                            |
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

require_once 'Image/Color.php';

/**
 * Renderer Base Class.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 * @abstract
 */
class Image_GIS_Renderer {
    /**
    * Set to TRUE to enable debugging.
    *
    * @var boolean $debug
    */
    var $debug;

    /**
    * @var array $min
    */
    var $min = false;

    /**
    * @var array $max
    */
    var $max = false;

    /**
    * Width of the image.
    *
    * @var integer $width
    */
    var $width;

    /**
    * Height of the image.
    *
    * @var integer $height
    */
    var $height;

    /**
    * Constructor.
    *
    * @param  mixed   $width
    * @param  integer $height
    * @param  boolean $debug
    * @access public
    */
    function Image_GIS_Renderer($width, $height, $debug) {
        $this->debug  = $debug;

        if ($width < 0 ||
            $width > 2048) {
            $width = 640;
        }

        if ($height < 0 ||
            $height > 2048) {
            $height = 480;
        }

        $this->width  = $width;
        $this->height = $height;
        // Default is for 72 dpi monitor.
        $this->pixelsPerInch = 72;
        // Default is for meters.
        $this->inchesPerMapUnit = 39.3701;
   }

    /**
    * Factory.
    *
    * @param  string  $renderer
    * @param  mixed   $width
    * @param  integer $height
    * @param  boolean $debug
    * @return object
    * @access public
    */
    function &factory($renderer, $width, $height, $debug) {
        if (@include_once('Image/GIS/Renderer/' . $renderer . '.php')) {
            $class  = 'Image_GIS_Renderer_' . $renderer;
            $object = new $class($width, $height, $debug);

            return $object;
        }
    }

    /**
    * Returns the range of the data to be rendered.
    *
    * @return array
    * @access public
    * @since  Image_GIS 1.0.1
    */
    function getRange() {
        return array(
          $this->min['x'],
          $this->max['x'],
          $this->min['y'],
          $this->max['y']
        );
    }

    /**
    * Returns the scale of the current display.
    *
    * @return real
    * @access public
    */
    function getScale() {
        $md = ($this->width - 1) / ($this->pixelsPerInch * $this->inchesPerMapUnit);
        $gd = $this->max['x'] - $this->min['x'];
        return($gd/$md);
    }

    /**
    * Converts a polar coordinate to an image coordinate.
    *
    * @param  float  $polarCoordinate
    * @param  string $direction
    * @access public
    */
    function polar2image($polarCoordinate, $direction) {
        switch ($direction) {
            case 'x': {
                return ($polarCoordinate - $this->min[$direction]) *
                       ($this->width / ($this->max[$direction] - $this->min[$direction]));
            }
            break;

            case 'y': {
                return ($polarCoordinate - $this->max[$direction]) *
                       ($this->height / ($this->min[$direction] - $this->max[$direction]));
            }
            break;
        }
    }

    /**
    * Renders feature sets.
    *
    * @param  array $lineSets
    * @access public
    */
    function render($featureSets) {
        if ($this->min == false || $this->max == false) {
            foreach ($featureSets as $type => $featureSet) {
                if ($type == 'lineSet') {
                    if ($this->min == false) {
                        $this->min['x'] = $featureSet->min['x'];
                        $this->min['y'] = $featureSet->min['y'];
                        $this->max['x'] = $featureSet->max['x'];
                        $this->max['y'] = $featureSet->max['y'];
                    } else {
                        $this->min['x'] = min($this->min['x'], $featureSet->min['x']);
                        $this->min['y'] = min($this->min['y'], $featureSet->min['y']);
                        $this->max['x'] = max($this->max['x'], $featureSet->max['x']);
                        $this->max['y'] = max($this->max['y'], $featureSet->max['y']);
                    }
                }
            }
        }

        foreach ($featureSets as $featureSet) {
            foreach ($featureSet as $type => $features) {
                switch ($type) {
                    case 'point':
                        $this->renderPointSet($features);
                        break;
                    case 'polyline':
                        $this->renderPolylineSet($features);
                        break;
                    case 'polygon':
                        $this->renderPolygonSet($features);
                        break;
                    case 'image':
                        $this->renderImage($features);
                        break;
                    case 'wms':
                        $this->renderWMSImage($features);
                        break;
                }
            }
        }
    }

    /**
    * Renders an image from an image file source.
    *
    * @param  object $image
    * @access public
    */
    function renderImage($image) {
        $this->drawImage($image);
    }

    /**
    * Renders an image from a web map service source.
    *
    * @param  object $image
    * @access public
    */
    function renderWMSImage($wms) {
        $this->drawWMSImage($wms->uri);
    }

    /**
    * Sets the range of the data to be rendered.
    *
    * @param  float $x1
    * @param  float $x2
    * @param  float $y1
    * @param  float $y2
    * @param  boolean $adjust
    * @access public
    */
    function setRange($x1, $x2, $y1, $y2, $adjust = TRUE) {
        if ($adjust) {
            $sw = $x2 - $x1;
            $sh = $y2 - $y1;
            if ($sw / $this->width > $sh / $this->height) {
                $y1 -= ((($sw / $this->width * $this->height) - $sh) / 2);
                $y2 += ((($sw / $this->width * $this->height) - $sh) / 2);
            }
            else {
                $x1 -= ((($sh / $this->height * $this->width) - $sw) / 2);
                $x2 += ((($sh / $this->height * $this->width) - $sw) / 2);
            }            
        }
        $this->min = array('x' => $x1, 'y' => $y1);
        $this->max = array('x' => $x2, 'y' => $y2);
    }

   /**
    * Fetches an image from the uri $uri and draws it to the map image.
    * Used for fetching images from web map services.
    *
    * @param  string  $uri
    * @access public
    */
    function drawWMSImage($uri) { /* abstract */ }

    /**
    * Draws a line from ($x1, $y1) to ($x2, $y2)
    * using the color rgb($r, $g, $b).
    *
    * @param  float   $x1
    * @param  float   $y1
    * @param  float   $x2
    * @param  float   $y2
    * @param  float   $r
    * @param  float   $g
    * @param  float   $b
    * @access public
    * @abstract
    */
    function drawLine($x1, $y1, $x2, $y2, $r, $g, $b) { /* abstract */ }

    /**
    * Saves the rendered image to a given file.
    *
    * @param  string  $filename
    * @return boolean
    * @access public
    * @abstract
    */
    function saveImage($filename) { /* abstract */ }

    /**
    * Shows the rendered image.
    *
    * @access public
    * @abstract
    */
    function showImage() { /* abstract */ }
}
?>
