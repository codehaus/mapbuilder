<?php
//
// +------------------------------------------------------------------------+
// | PEAR :: Image :: GIS :: E00 Parser                                     |
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

require_once 'Image/GIS/FeatureSet.php';
require_once 'Image/GIS/Parser.php';

/**
 * E00 Parser.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Parser_E00 extends Image_GIS_Parser {
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
    function Image_GIS_Parser_E00($cache, $type, $dataSource, $style, $debug) {
        $this->Image_GIS_Parser($cache, $type, $dataSource, $style, $debug);
    }

    /**
    * Parses a data file.
    *
    * @param  array $range
    * @return mixed
    * @access public
    */
    function parse($range) {
        $featureSet = new Image_GIS_FeatureSet($this->style);
        if ($fp = @fopen($this->dataSource->dataFile, 'r')) {
            echo $this->debug ? 'File ' . $this->dataSource->dataFile . ' opened<br />': '';
            if ($this->type == 'point') {
                while(0 || $line = fgets($fp, 1024)) {
                    $ln ++;
                    if (preg_match("#^\s+[0-9]+\s+[0-9]([-][0-9]\.[0-9]{7}E[-+][0-9]{2})([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})#", $line, $a)) {
                        if ($this->debug) {
                            echo '<br />New ' . $this->type . ' feature created <br />';
                            echo $a[1] . ' ' . $a[2] . '<br />';
                        }
                        $featureSet->addFeature(array(array($a[1], $a[2])));
                    }
                }
            } elseif (($this->type == 'polyline') || ($this->type == 'polygon')) {
            
                $numRecords = 0;
                $ln         = 0;
                while(0 || $line = fgets($fp, 1024)) {
                    $ln ++;
    
                    if ($numRecords == 0 && 
                        preg_match("#^\s+([0-9]+)\s+([-0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)#", $line, $a)) {
                        if ($this->debug) {
                            echo '<br />New ' . $this->type . ' feature created <br />';
                        }
                        $featureSet->addFeature();
                        $numRecords = $a[7];
                    }
    
                    else if ($numRecords &&
                             preg_match("#^([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})#", $line, $a)) {
                        if ($this->debug) {
                            echo $a[0] . '<br />';
                        }
    
                        $featureSet->features[count($featureSet->features) - 1]->addCoordinate($a[1], $a[2]);
    
                        $numRecords--;
    
                        $featureSet->features[count($featureSet->features) - 1]->addCoordinate($a[3], $a[4]);
    
                        $numRecords--;
                    }
    
                    else if ($numRecords &&
                             preg_match("#^([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})([ -][0-9]\.[0-9]{7}E[-+][0-9]{2})#", $line, $a)) {
                        if ($pl['x'] != -1 &&
                            $pl['y'] != -1) {
                            $featureSet->features[count($featureSet->features) - 1]->addCoordinate($a[1], $a[2]);
                        }
    
                        $numRecords--;
                    }
    
                    else if ($ln > 2) {
                        if ($this->debug) {
                            printf(
                              'Died at: %s<br />',
                              $ln
                            );
                        }
    
                        break;
                    }
    
                    else if ($this->debug) {
                        echo $line . '<br />';
                    }
                }
            }
            @fclose($fp);
            return array($this->type => $featureSet);
        }

        return false;
    }
}
?>
