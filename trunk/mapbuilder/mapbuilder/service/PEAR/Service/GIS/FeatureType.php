<?php
/**
 * Service Base Class.
 *
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Service
 * @package     Service_OGC
 */

class Service_GIS_FeatureType{ 
    var $name;
    var $title;
    var $abstract;
    var $srs;
    /**
    * Constructor.
    *
    * @param  array   $parameters
    * @param  boolean $debug
    * @access public
    */
    function Service_GIS_FeatureType($parameters = array()) {
        $this->name = isset($parameters['name']) ? $parameters['name'] : null;
        $this->title = isset($parameters['title']) ? $parameters['title'] : null;
        $this->abstract = isset($parameters['abstract']) ? $parameters['abstract'] : null;
        $this->srs = isset($parameters['srs']) ? $parameters['srs'] : null;
        $this->settings = isset($parameters['settings']) ? $parameters['settings'] : null;
        $this->debug = $debug;
    }

}



?>