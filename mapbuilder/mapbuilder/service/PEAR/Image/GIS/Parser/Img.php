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

class Image_GIS_Parser_Img extends Image_GIS_Parser {
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
    function Image_GIS_Parser_Img($cache, $type, $dataSource, $style, $debug) {
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
        if ($fp = @fopen($this->dataSource->worldFile, 'r')) {
            echo $this->debug ? 'File ' . $this->dataSource->worldFile . ' opened<br />': '';
            while(0 || $line = fgets($fp, 1024)) {

                $ln ++;
                switch($ln) {
                    case 1:
                        $xStep = $line;
                        break;
                    case 4:
                        $yStep = $line;
                        break;
                    case 5:
                        $xLeft = $line;
                        break;
                    case 6:
                        $yTop = $line;
                        break;
                }
            }
            @fclose($fp);
        }
        $image->xmin = ($range[0] - $xLeft) / $xStep;
        $image->ymin = ($range[3] - $yTop) / $yStep;
        $image->width = ($range[1] - $range[0]) / $xStep;
        $image->height = ($range[3] - $range[2]) / $yStep;
//        $image->xmax = $image->xmin + (($range[1] - $range[0]) / $xStep);
//        $image->ymax = $image->ymin + (($range[3] - $range[2]) / $yStep);
        $image->dataFile = $this->dataSource->dataFile;
        $image->format = $this->dataSource->format;
        return array('image' => $image);
    }
}
?>
