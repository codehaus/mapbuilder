<?php

require_once 'Image/GIS/Layer.php';

/**
 * A data source for a map.
 *
 * @author      Jan Kneschke <jan@kneschke.de>
 * @author      Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @author      Nedjo Rogers <nedjo@gworks.ca>
 * @copyright   Copyright &copy; 2002-2004 Jan Kneschke <jan@kneschke.de> and Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @license     http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category    Image
 * @package     Image_GIS
 */
class Image_GIS_DataSource {

    /**
    * For file-based data sources, path and filename.
    *
    * @var string $dataFile
    */
    var $dataFile;

    /**
    * For datasources from a web map service, the uri of the service.
    *
    * @var string $uri
    */
    var $uri;

    /**
    * For databases, the database type.
    * Valid values are:
    * - 'proxy'
    *   Indicates a database without spatial functionlity, where geometries
    *   are stored in a text field in the OGC well known text format, with
    *   four additional fields providing minimum and maximum x and y coordinates.
    * - 'mysqlspatial'
    *   Indicates a MySQL database with spatial functionality (version 4.1 or later).
    * - 'postgis'
    *   Indicates a Postgresql database with the PostGIS extension.
    *
    * @var string $dbType
    */
    var $dbType;

    /**
    * Data source name, in the format expected by PEAR's DB extension.
    * Example: pgsql://username:password@example.org/databasename'
    *
    * @var string $dsn
    */
    var $dsn;

    /**
    * Constructor.
    *
    * @param  array $parameters
    * @access public
    */
    function Image_GIS_DataSource($parameters) {
        // Read parameters for E00 parser.
        $this->dataFile = isset($parameters['dataFile']) ? $parameters['dataFile'] : null;
        // Read parameters for WMS parser.
        $this->uri = isset($parameters['uri']) ? $parameters['uri'] : null;
        // Read parameters for Img parser.
        $this->worldFile = isset($parameters['worldFile']) ? $parameters['worldFile'] : null;
        $this->width = isset($parameters['width']) ? $parameters['width'] : null;
        $this->height = isset($parameters['height']) ? $parameters['height'] : null;
        $this->format = isset($parameters['format']) ? $parameters['format'] : null;
        // Read parameters for WKT parser.
        $this->dbType = isset($parameters['dbType']) ? $parameters['dbType'] : 'proxy';
        $this->pearDSN = isset($parameters['pearDSN']) ? $parameters['pearDSN'] : null;
        $this->fromClause = isset($parameters['fromClause']) ? $parameters['fromClause'] : null;
        $this->whereClause = isset($parameters['whereClause']) ? $parameters['whereClause'] : null;
        $this->geometryField = isset($parameters['fields']['geometry']) ? $parameters['fields']['geometry'] : 'geometry';
        $this->xminField = isset($parameters['fields']['xmin']) ? $parameters['fields']['xmin'] : 'xmin';
        $this->yminField = isset($parameters['fields']['ymin']) ? $parameters['fields']['ymin'] : 'ymin';
        $this->xmaxField = isset($parameters['fields']['xmax']) ? $parameters['fields']['xmax'] : 'xmax';
        $this->ymaxField = isset($parameters['fields']['ymax']) ? $parameters['fields']['ymax'] : 'ymax';
        $this->labelField = isset($parameters['fields']['label']) ? $parameters['fields']['label'] : null;
        $this->symbolField = isset($parameters['fields']['symbol']) ? $parameters['fields']['symbol'] : null;
    }
}
?>
