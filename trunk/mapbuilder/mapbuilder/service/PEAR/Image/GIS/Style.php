<?php

require_once 'Image/GIS/Layer.php';

/**
 * A style for a map layer.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_Style {

    /**
    * Type of style.
    * Acceptable values are 'stroke', 'fill', and 'symbol'.
    *
    * @var string $type
    */
    var $type;

    /**
    * For datasources from a web map service, the uri of the service.
    *
    * @var string $uri
    */
    var $uri;

    /**
    * Constructor.
    *
    * @param  array $parameters
    * @access public
    */
    function Image_GIS_Style($parameters) {
        $this->type = isset($parameters['type']) ? $parameters['type'] : null;
        $this->fillColor = isset($parameters['fillColor']) ? $parameters['fillColor'] : null;
        $this->shadowColor = isset($parameters['shadowColor']) ? $parameters['shadowColor'] : null;
        $this->fontFile = isset($parameters['fontFile']) ? $parameters['fontFile'] : null;
        $this->symbolSize = isset($parameters['symbolSize']) ? $parameters['symbolSize'] : 12;
        $this->strokeColor = isset($parameters['strokeColor']) ? $parameters['strokeColor'] : null;
        $this->strokeWidth = isset($parameters['strokeWidth']) ? $parameters['strokeWidth'] : null;
        $this->width = isset($parameters['width']) ? $parameters['width'] : 6;
        $this->height = isset($parameters['height']) ? $parameters['height'] : 6;
        $this->displayThreshold = isset($parameters['displayThreshold']) ? $parameters['displayThreshold'] : 50;
        $this->symbolMinimumScale = isset($parameters['symbolMinimumScale']) ? $parameters['symbolMinimumScale'] : null;

    }
}
?>
