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
// $Id: WKT.php
//

require_once 'Image/GIS/FeatureSet.php';
require_once 'Image/GIS/Parser.php';
require_once 'DB.php';
ob_start();
/**
 * WKT Parser.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Parser_WKT extends Image_GIS_Parser {

    var $geometry;

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
    function Image_GIS_Parser_WKT($cache, $type, $dataSource, $style, $debug) {
        $this->Image_GIS_Parser($cache, $type, $dataSource, $style, $debug);
        if (!DB::isConnection($this->dataSource->pearDSN)) {
            $this->db = DB::connect($this->dataSource->pearDSN);
            if (DB::isError($this->db)) {
                die($this->db->getMessage());
            }
        } else {
            $this->db = $this->dataSource->pearDSN;
        }
    }

    /**
    * Makes a database query and parses results.
    *
    * @param  array $range
    * @return mixed
    * @access public
    */
    function parse($range) {
        $this->featureSet = new Image_GIS_FeatureSet($this->style);
            echo $this->debug ? 'Database opened<br />': '';
            $sql = "SELECT " . $this->dataSource->geometryField . " AS geometry";
            if ($this->dataSource->labelField) {
                $sql .= "," . $this->dataSource->labelField . " AS label";
            }
            if ($this->dataSource->symbolField) {
                $sql .= "," . $this->dataSource->symbolField . " AS symbol";
            }
            $sql .= " FROM " . $this->dataSource->fromClause;
            $sql .= " WHERE " . $this->intersects($range);
            if ($this->dataSource->whereClause) {
                $sql .= "AND " . $this->dataSource->whereClause;
            }
            $result = $this->db->query($sql);
            if(DB::isError($result)) {
            	die($result->getMessage());
            }
            while ($row = $result->fetchRow(DB_FETCHMODE_OBJECT)) {
                $this->featureSet->addFeature(null, $row->label, $row->symbol);
                $this->convertGeometry($row->geometry);
            }
            return array($this->type => $this->featureSet);

        return false;
    }
  
    function geometryType($geometry) {
        $pos = strpos($geometry, '(');
        $geometryType = substr($geometry, 0, $pos);
        return $geometryType;
    }
    
    function dropShapeName($str) {
        return strchr($str, '(');
    }
    
    function dropFirstLastChrs($str) {
        $strLen = strlen($str);
        return (substr($str, 1, ($strLen) - 2));
    }
    
    function addSpacesMulti($str) {
        $str = str_replace(")),((", ")) , ((", $str);
        return $str;
    }
    
    function addSpacesSingle($str) {
        $str = str_replace("),(", ") , (", $str);
        return $str;
    }
    
    function explodeGeometry($str) {
        $strs = explode(" , ", $str);
        return $strs;
    }
    
    function convertGeometry($geometry){
        $geometryType = strtoupper($this->geometryType($geometry));
        $geometry = $this->dropFirstLastChrs($this->dropShapeName($geometry));
        switch ($geometryType) {
            case "POINT":
                $this->convertPoint($geometry);
                break;
            case "LINESTRING":
                $this->convertLinestring($geometry);
                break;
            case "POLYGON":
                $this->convertPolygon($geometry);
                break;
            case "MULTIPOINT":
                $this->convertMultiPoint($geometry);
                break;
            case "MULTILINESTRING":
                $this->convertMultiLinestring($geometry);
                break;
            case "MULTIPOLYGON":
                $this->convertMultiPolygon($geometry);
                break;
            case "GEOMETRYCOLLECTION":
                $this->convertGeometryCollection($geometry);
                break;
        }
    }
    
    function convertMultiPoint($geometry) {
        $geometry = $this->addSpacesMulti($geometry);
        $points = $this->explodeGeometry($geometry);
        foreach ($points as $point) {
            $this->convertPoint($this->dropFirstLastChrs($point));
        }
    }
    
    function convertPoint($geometry){
        $pt = explode(" ",$geometry);
        $this->featureSet->features[count($this->featureSet->features) - 1]->addCoordinate($pt[0], $pt[1]);
    }
    
    function coordinatesToArrays($str){
        $segments = explode(" ", $str);
        for($i = 0;$i<(count($segments));$i++){
            $segments[$i] = explode(",", $segments[$i]);
        }
        return $segments;
    }
    
    function convertMultiLinestring($geometry) {
        $geometry = $this->addSpacesSingle($geometry);
        $lines = $this->explodeGeometry($geometry);
        foreach ($lines as $line) {
            $this->convertLinestring($this->dropFirstLastChrs($line));
        }
    }
    
    function convertLinestring($geometry){
        $rawPts = explode(",", $geometry);
        foreach ($rawPts as $rawPt) {
          $pt = explode(' ', $rawPt);
          $this->featureSet->features[count($this->featureSet->features) - 1]->addCoordinate($pt[0], $pt[1]);
        }
    }
    
    function convertMultiPolygon($geometry) {
        $geometry = $this->addSpacesMulti($geometry);
        $polys = $this->explodeGeometry($geometry);
        foreach ($polys as $poly) {
            $this->convertPolygon($this->dropFirstLastChrs($poly));
        }
    }
    
    function convertPolygon($geometry){
        $geometry = $this->addSpacesSingle($geometry);
        $rings = $this->explodeGeometry($geometry);
        $pass = 0;
        foreach ($rings as $ring) {
            $ring = $this->dropFirstLastChrs($ring);
            if($pass == 0){
                $rawPts = explode(",",$ring);
                foreach ($rawPts as $rawPt) {
                  $pt = explode(' ', $rawPt);
                  $this->featureSet->features[count($this->featureSet->features) - 1]->addCoordinate($pt[0], $pt[1]);
                }
            }
            else{
                // for now, skip inner rings
                return;
            }
            $pass++;
        }
    }
    
    function convertGeometryCollection($geometry){
        $searchstr = array(",POINT",",LINESTRING",",POLYGON",",MULTIPOINT",",MULTILINESTRING",",MULTIPOLYGON");
        $replacestr = array(" , POINT"," , LINESTRING"," , POLYGON"," , MULTIPOINT"," , MULTILINESTRING"," , MULTIPOLYGON");
        $geometry = str_replace($searchstr, $replacestr, $geometry);
        $geometries = $this->explodeGeometry($geometry);
        foreach ($geometries as $geometry) {
            $this->convertGeometry($geometry);
        }
    }

    function intersects($range){
       return "(( " . $this->dataSource->xminField . "  BETWEEN $range[0] AND $range[1] ) AND ( " . $this->dataSource->yminField . "  BETWEEN  $range[2]  AND  $range[3] )) OR (( " . $this->dataSource->xminField . "  BETWEEN  $range[0]  AND  $range[1] ) AND ( " . $this->dataSource->ymaxField . "  BETWEEN  $range[2]  AND  $range[3] )) OR (( " . $this->dataSource->xmaxField . "  BETWEEN  $range[0]  AND  $range[1] ) AND ( " . $this->dataSource->yminField . "  BETWEEN  $range[2]  AND  $range[3] )) OR (( " . $this->dataSource->xmaxField . "  BETWEEN  $range[0]  AND  $range[1] ) AND ( " . $this->dataSource->ymaxField . "  BETWEEN  $range[2]  AND  $range[3] ))  OR (( " . $this->dataSource->xminField . "  <  $range[0] ) AND ( " . $this->dataSource->yminField . "  <  $range[2] ) AND ( " . $this->dataSource->xmaxField . "  >  $range[1] ) AND ( " . $this->dataSource->ymaxField . "  >  $range[3] )) OR (( " . $this->dataSource->xminField . "  BETWEEN  $range[0]  AND  $range[1] ) AND ( " . $this->dataSource->yminField . "  <  $range[2] ) AND ( " . $this->dataSource->ymaxField . "  >  $range[3] )) OR (( " . $this->dataSource->xmaxField . "  BETWEEN  $range[0]  AND  $range[1] ) AND ( " . $this->dataSource->yminField . "  <  $range[2] ) AND ( " . $this->dataSource->ymaxField . "  >  $range[3] )) OR (( " . $this->dataSource->yminField . "  BETWEEN  $range[2]  AND  $range[3] ) AND ( " . $this->dataSource->xminField . "  <  $range[0] ) AND ( " . $this->dataSource->xmaxField . "  >  $range[1] )) OR (( " . $this->dataSource->ymaxField . "  BETWEEN  $range[2]  AND  $range[3] ) AND ( " . $this->dataSource->xminField . "  <  $range[0] ) AND ( " . $this->dataSource->xmaxField . "  >  $range[1] ))";
    }

}
?>
