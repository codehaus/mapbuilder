<?php
//
// +------------------------------------------------------------------------+
// | PEAR :: Image :: GIS                                                   |
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
require_once 'Image/GIS/Layer.php';
require_once 'Image/GIS/Renderer.php';

/**
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS {
    /**
    * Set to TRUE to enable debugging.
    *
    * @var boolean $debug
    */
    var $debug;

    /**
    * Image_GIS_Renderer sub-class object.
    *
    * @var Image_GIS_Renderer $renderer
    */
    var $renderer;

    /**
    * Constructor.
    *
    * @param  array   $parameters
    * @access public
    */
    function Image_GIS($parameters = array()) {
        $this->debug = isset($parameters['debug']) ? $parameters['debug'] : false;

        $this->setRenderer(
          isset($parameters['renderer']) ? $parameters['renderer'] : 'GD',
          isset($parameters['width'])    ? $parameters['width']    : 640,
          isset($parameters['height'])   ? $parameters['height']   : 480
        );

        if (isset($parameters['range']['x1']) &&
            isset($parameters['range']['x2']) &&
            isset($parameters['range']['y1']) &&
            isset($parameters['range']['y2'])) {
            $this->setRange(
              $parameters['range']['x1'],
              $parameters['range']['x2'],
              $parameters['range']['y1'],
              $parameters['range']['y2']
            );
        }
    }

    /**
    * Adds a data layer to the map.  This function is deprecated but included for backwards compatibility.
    *
    * @param  string  $dataFile
    * @param  mixed   $color
    * @return boolean
    * @access public
    * @deprecated
    */
    function addDataFile($dataFile, $color) {
        $parameters = array(
            'parser' => 'E00',
            'dataSource' => array(
                'dataFile' => $datafile
            ),
            'style' => array(
                'type'        => 'stroke',
                'strokeColor' => $color,
                'strokeWidth' => 1
            ),
            'type' => 'polyline'
        );
        $this->layers[] = new Image_GIS_Layer($parameters, $this->debug);
    }

    /**
    * Adds a data layer to the map.
    *
    * @param  array  $parameters
    * @return boolean
    * @access public
    */
    function addLayer($parameters) {
        $this->layers[] = new Image_GIS_Layer($parameters, $this->debug);
    }

    /**
    * Parses the data files of the map.
    *
    * @access public
    * @return array
    */
    function parseLayers() {
        foreach ($this->layers as $layer) {
            $cacheID = md5($layer->name . '_' . implode('-', $this->getRange()));
            $featureSet = false;

            if (is_object($this->cache) &&
                $featureSet = $this->cache->get($cacheID, 'Image_GIS')) {
                $featureSet = unserialize($featureSet);
            }

            if ($featureSet === false) {
                $featureSet = $layer->parse($this->getRange());

                if (is_object($this->cache)) {
                    $this->cache->save(serialize($featureSet), $cacheID, 'Image_GIS');
                }
            }

            $featureSets[] = $featureSet;
        }
        return $featureSets;
    }

    /**
    * Returns the range of the data to be rendered.
    *
    * @return array
    * @access public
    * @since  Image_GIS 1.0.1
    */
    function getRange() {
        return $this->renderer->getRange();
    }

    /**
    * Renders the image.
    *
    * @access public
    */
    function render() {
        $this->renderer->render($this->parseLayers());
    }

    /**
    * Saves the rendered image to a given file.
    *
    * @param  string  $filename
    * @return boolean
    * @access public
    */
    function saveImage($filename) {
        $this->render();

        return $this->renderer->saveImage($filename);
    }

    /**
    * Sets the range of the data to be rendered.
    *
    * @param  float $x1
    * @param  float $x2
    * @param  float $y1
    * @param  float $y2
    * @access public
    */
    function setRange($x1, $x2, $y1, $y2) {
        $this->renderer->setRange($x1, $x2, $y1, $y2);
    }

    /**
    * Sets the Image_GIS_Renderer sub-class to be used
    * to render an image.
    *
    * @param  string  $renderer
    * @access public
    */
    function setRenderer($renderer, $width, $height) {
        $this->renderer = &Image_GIS_Renderer::factory($renderer, $width, $height, $this->debug);
    }

    /**
    * Shows the rendered image.
    *
    * @access public
    */
    function showImage() {
        $this->render();
        $this->renderer->showImage();
    }
}
?>
