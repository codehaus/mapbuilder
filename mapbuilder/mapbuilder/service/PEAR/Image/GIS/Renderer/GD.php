<?php
//
// +------------------------------------------------------------------------+
// | PEAR :: Image :: GIS :: GD Renderer                                    |
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

require_once 'Image/GIS/Renderer.php';

/**
 * GD Renderer.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Renderer_GD extends Image_GIS_Renderer {
    /**
    * GD Image Palette.
    *
    * @var array $palette
    */
    var $palette = array();

    /**
    * GD Image Resource.
    *
    * @var resource $img
    */
    var $img;

    /**
    * Constructor.
    *
    * @param  mixed   $width
    * @param  integer $sizyY
    * @param  boolean $debug
    * @access public
    */
    function Image_GIS_Renderer_GD($width, $height, $debug) {
        if (is_file($width)) {
            $this->img = imagecreatefrompng($width);
            $width     = imagesx($this->img);
            $height    = imagesy($this->img);

            $this->Image_GIS_Renderer($width, $height, $debug);
        } else {
            $this->Image_GIS_Renderer($width, $height, $debug);

            $this->img = imagecreate($this->width, $this->height);
            imagecolorallocate($this->img, 255, 255, 255);
        }
    }

    /**
    * Draws a clipped line from ($x1, $y1) to ($x2, $y2)
    * using $color.
    *
    * @param  float $x1
    * @param  float $y1
    * @param  float $x2
    * @param  float $y2
    * @param  Image_GIS_Style $style
    * @access public
    */
    function drawClippedLine($x1, $y1, $x2, $y2, $style) {
        if (($x1 > $this->max['x']  ||
             $x1 < $this->min['x']  ||
             $y1 > $this->max['y']  ||
             $y1 < $this->min['y']) &&
            ($x2 > $this->max['x']  ||
             $x2 < $this->min['x']  ||
             $y2 > $this->max['y']  ||
             $y2 < $this->min['y'])) {
            if ($this->debug) {
                printf('clipped x1: %d %d %d<br />', $x1, $this->min['x'], $this->max['x']);
                printf('clipped y1: %d %d %d<br />', $y1, $this->min['y'], $this->max['y']);
                printf('clipped x2: %d %d %d<br />', $x2, $this->min['x'], $this->max['x']);
                printf('clipped y2: %d %d %d<br />', $y2, $this->min['y'], $this->max['y']);
            }
        } else {

            $x1 = $this->polar2image($x1, 'x');
            $y1 = $this->polar2image($y1, 'y');
            $x2 = $this->polar2image($x2, 'x');
            $y2 = $this->polar2image($y2, 'y');

            if ($this->debug) {
                printf('Drawing line (%s, %s) -> (%s, %s)<br />', $x1, $y1, $x2, $y2);
            }

            $this->drawLine($x1, $y1, $x2, $y2, $style);
        }
    }

    /**
    * Renders a point set.
    *
    * @param  array $pointSet
    * @access public
    */
    function renderPointSet($pointSet) {
        if (!is_array($pointSet->style->fillColor)) {
            $pointSet->style->fillColor = Image_Color::namedColor2RGB($pointSet->style->fillColor);
        }
        $r = $pointSet->style->fillColor[0];
        $g = $pointSet->style->fillColor[1];
        $b = $pointSet->style->fillColor[2];
        if (!isset($this->palette[$r][$g][$b])) {
            $this->palette[$r][$g][$b] = imagecolorallocate($this->img, $r, $g, $b);
        }
        if ($pointSet->style->shadowColor && !is_array($pointSet->style->shadowColor)) {
            $pointSet->style->shadowColor = Image_Color::namedColor2RGB($pointSet->style->shadowColor);
        }
        $rb = $pointSet->style->shadowColor[0];
        $gb = $pointSet->style->shadowColor[1];
        $bb = $pointSet->style->shadowColor[2];
        if (!isset($this->palette[$rb][$gb][$bb])) {
            $this->palette[$rb][$gb][$bb] = imagecolorallocate($this->img, $rb, $gb, $bb);
        }
        foreach ($pointSet->features as $feature) {
            if($feature->symbolText && ($pointSet->style->symbolMinimumScale > $this->getScale())) {
                $x = $this->polar2image($feature->coordinates[0][0], 'x') - ($pointSet->style->symbolSize/2);
                $y = $this->polar2image($feature->coordinates[0][1], 'y') - ($pointSet->style->symbolSize/2);
                if ($pointSet->style->shadowColor) {
                    imagettftext($this->img, $pointSet->style->symbolSize, 0, $x - 1, $y - 1, $this->palette[$rb][$gb][$bb], $pointSet->style->fontFile, chr($feature->symbolText));
                }
                imagettftext($this->img, $pointSet->style->symbolSize, 0, $x, $y, $this->palette[$r][$g][$b], $pointSet->style->fontFile, chr($feature->symbolText));
            } else {
                imagefilledellipse ($this->img, $this->polar2image($feature->coordinates[0][0], 'x'), $this->polar2image($feature->coordinates[0][1], 'y'), $pointSet->style->width, $pointSet->style->height, $this->palette[$r][$g][$b]);
            }
        }
    }

    /**
    * Renders a polyline set.
    *
    * @param  array $polylineSet
    * @access public
    */
    function renderPolylineSet($polylineSet) {
        foreach ($polylineSet->features as $line) {
            $pp[0] = null;
            $pp[1] = null;
            foreach ($line->coordinates as $coordinate) {
                if (($pp[0] == null) && ($pp[1] == null)) {
                    $pp[0] = $coordinate[0];
                    $pp[1] = $coordinate[1];
                } else {
                    $this->drawClippedLine($pp[0], $pp[1], $coordinate[0], $coordinate[1], $polylineSet->style);
                    $pp[0] = $coordinate[0];
                    $pp[1] = $coordinate[1];
                }
            }
        }
    }

    /**
    * Renders a polygon set.
    *
    * @param  array $polygonSet
    * @param  Image_GIS_Style $style
    * @access public
    */
    function renderPolygonSet($polygonSet) {
        if (!is_array($polygonSet->style->fillColor)) {
            $polygonSet->style->fillColor = Image_Color::namedColor2RGB($polygonSet->style->fillColor);
        }
        $r = $polygonSet->style->fillColor[0];
        $g = $polygonSet->style->fillColor[1];
        $b = $polygonSet->style->fillColor[2];
        if (!isset($this->palette[$r][$g][$b])) {
            $this->palette[$r][$g][$b] = imagecolorallocate($this->img, $r, $g, $b);
        }
        foreach ($polygonSet->features as $feature) {
            $coordinates = array();
            foreach ($feature->coordinates as $coordinate) {
                $coordinates[] = $this->polar2image($coordinate[0], 'x');
                $coordinates[] = $this->polar2image($coordinate[1], 'y');
            }

            if (count($coordinates) > 5) {
                if ($this->debug) {
                    printf('Drawing polygon (%s)<br />', implode(' ', $coordinates));
                }
                imagefilledpolygon($this->img, $coordinates, count($coordinates)/2, $this->palette[$r][$g][$b]);
            }
        }
    }

    /**
    * Fetches an image from the uri $uri and draws it to the map image.
    * Used principally for fetching images from web map services.
    *
    * @param  string  $uri
    * @access public
    */
    function drawImage($image) {
        $create = 'imagecreatefrom' . $image->format;
        if ($img = $create($image->dataFile)) {
echo 'width: ' . $image->width . ' height: ' . $image->height . ' xmin: ' . $image->xmin . ' ymin: ' . $image->ymin;

imagefilledrectangle ($this->img, $image->xmin, $image->ymin, $image->xmin + $image->width, $image->xmin + $image->width, imagecolorallocate($this->img, 255, 255, 0));
            imagecopyresampled ($this->img, $image, 0, 0, $image->xmin, $image->ymin, $this->width, $this->height, $image->width, $image->height);
        }
    }

    /**
    * Fetches an image from the uri $uri and draws it to the map image.
    * Used for fetching images from web map services.
    *
    * @param  string  $uri
    * @access public
    */
    function drawWMSImage($uri) {
        if ($image = imagecreatefrompng($uri . '&WIDTH=' . $this->width . '&HEIGHT=' . $this->height . '&BBOX=' . $this->min['x'] . ',' . $this->min['y'] . ',' . $this->max['x'] . ',' . $this->max['y'])) {
            imagecolortransparent ($image, imagecolorallocate($image, 255, 255, 255));
            imagecopymerge($this->img, $image, 0, 0, 0, 0, $this->width, $this->height, 50);
        }
    }

    /**
    * Draws a line from ($x1, $y1) to ($x2, $y2)
    *
    * @param  float   $x1
    * @param  float   $y1
    * @param  float   $x2
    * @param  float   $y2
    * @access public
    */
    function drawLine($x1, $y1, $x2, $y2, $style) {
        if (!is_array($style->strokeColor)) {
            $style->strokeColor = Image_Color::namedColor2RGB($style->strokeColor);
        }
        $r = $style->strokeColor[0];
        $g = $style->strokeColor[1];
        $b = $style->strokeColor[2];
        if (!isset($this->palette[$r][$g][$b])) {
            $this->palette[$r][$g][$b] = imagecolorallocate($this->img, $r, $g, $b);
        }
        imageline(
          $this->img,
          $x1,
          $y1,
          $x2,
          $y2,
          $this->palette[$r][$g][$b]
        );
    }

    /**
    * Saves the rendered image to a given file.
    *
    * @param  string  $filename
    * @return boolean
    * @access public
    */
    function saveImage($filename) {
        return imagepng($this->img, $filename);
    }

    /**
    * Shows the rendered image.
    *
    * @access public
    */
    function showImage() {
        header('Content-Type: image/png');
        imagepng($this->img);
    }
}
?>
