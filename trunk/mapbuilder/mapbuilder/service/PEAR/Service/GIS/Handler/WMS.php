<?php

/* @author      Nedjo Rogers <nedjo@gworks.ca>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Service
 * @package     Service_OGC_WMS
 */

require_once 'Service/GIS/Handler.php';

class Service_GIS_Handler_WMS extends Service_GIS_Handler{ 
    var $map;
    var $srs;
    /**
    * Constructor.
    *
    * @param  array   $parameters
    * @access public
    */
    function Service_GIS_Handler_WMS($parameters = array()) {
        $this->Service_GIS_Handler($parameters);
    }

   /**
    * Handles a service request.
    *
    * @access public
    */
    function handleRequest(){
        switch($_REQUEST['REQUEST']){
            case "GetMap":
                $this->map = new Image_GIS(
                    array(
                      'width'  => $_REQUEST['WIDTH'],
                      'height' => $_REQUEST['HEIGHT']
                    )
                );
                $layers = explode("," ,$_REQUEST['LAYERS']);
                foreach ($layers as $layer) {
                    $this->map->addLayer($this->featureTypes[$layer]->settings);
                }
                $bbox = explode(",", $_REQUEST['BBOX']);
                $this->map->setRange($bbox[0], $bbox[2], $bbox[1], $bbox[3]);
                $this->map->showImage();
                break;
        }
    }
}



?>