<?php

require_once 'Service/GIS/FeatureType.php';

/**
 * Handler Base Class.
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Service
 * @package     Service_GIS_Handler
 */

class Service_GIS_Handler{
    /**
    * Set to TRUE to enable debugging.
    *
    * @var boolean $debug
    */
    var $debug;

    var $featureTypes;
    /**
    * Constructor.
    *
    * @param  array   $parameters
    * @access public
    */
    function Service_GIS_Handler($debug) {
        $this->debug = $debug;
    }


    /**
    * Adds a geographic feature type to the service.
    *
    * @param  array  $featureType
    * @access public
    */
    function addFeatureType($parameters) {
        $this->featureTypes[$parameters['name']] = new Service_GIS_FeatureType($parameters);
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
    function &factory($handler, $debug) {
        include_once 'Service/GIS/Handler/' . $handler . '.php';

        $class  = 'Service_GIS_Handler_' . $handler;
        $object = new $class($cache, $debug);

        return $object;
    }

    /**
    * Handles a service request.
    *
    * @access public
    * @abstract
    */
    function handleRequest() { /* abstract */ }
}

?>