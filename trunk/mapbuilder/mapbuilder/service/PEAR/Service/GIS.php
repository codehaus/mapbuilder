<?php
require_once 'Image/GIS.php';
require_once 'Service/GIS/Handler.php';

/*
 *
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @category    Service
 * @package     Service_OpenGIS
 */
class Service_GIS {
    /**
    * Set to TRUE to enable debugging.
    *
    * @var boolean $debug
    */
    var $debug;

    /**
    * Service_GIS_handler sub-class object.
    *
    * @var Service_GIS_Handler $handler
    */
    var $handler;

    /**
    * Constructor.
    *
    * @param  array   $parameters
    * @access public
    */
    function Service_GIS($parameters = array()) {
        $this->debug = isset($parameters['debug']) ? $parameters['debug'] : false;
        $this->setHandler(
          isset($parameters['handler']) ? $parameters['handler']   : 'WMS'
        );
        if (isset($parameters['featureTypes'])) {
            foreach ($parameters['featureTypes'] as $parameters) {
              $this->addFeatureType($parameters);
            }
        }
    }

    /**
    * Adds a geographic feature type to the service.
    *
    * @param  array  $parameters
    * @access public
    */
    function addFeatureType($parameters) {
        $this->handler->addFeatureType($parameters);
    }

    /**
    * Renders the image.
    *
    * @access public
    */
    function handleRequest() {
        $this->handler->handleRequest();
    }

    /**
    * Sets the Service_GIS_Handler sub-class to be used
    * to handle a service request.
    *
    * @param  string  $handler
    * @param  boolean $debug
    * @access public
    */
    function setHandler($handler) {
        $this->handler = &Service_GIS_Handler::factory($handler, $this->debug);
    }

}
?>
