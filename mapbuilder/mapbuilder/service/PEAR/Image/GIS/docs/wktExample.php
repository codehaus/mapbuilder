<?php
require_once 'Image/GIS.php';
$map = new Image_GIS(
  array(
//    'debug'  => true,
    'width'  => 400,
    'height' => 275
  )
);
// First, add a background layer from a Web Map Service source.
$map->addLayer(
    array(
        'parser' => 'WMS',
        'dataSource' => array(
            'uri' => 'http://scbc2.dyndns.org/cgi-bin/mapserv?map=/usr/local/mapserver/html/gworks/greenmap/greenmap.map&VERSION=1.1.0&request=GetMap&SRS=epsg:26710&LAYERS=gvic&STYLES=&FORMAT=PNG'
        ),
        'type' => 'image'
    )
);
// Add a polygon layer from a database source.
$map->addLayer(
    array(
        'parser' => 'WKT',
        'dataSource' => array(
            'dbType' => 'proxy',
            'pearDSN' => 'mysql://user:password@host/database',
            'fromClause' => 'parks',
            'whereClause' => null,
            'fields' => array(
                'geometry' => 'Geometry',
                'xmin'     => 'XMin',
                'ymin'     => 'YMin',
                'xmax'     => 'XMax',
                'ymax'     => 'YMax',
            )
        ),
        'style' => array(
            'type'        => 'fill',
            'fillColor' => 'green',
            'strokeColor' => 'purple',
            'strokeWidth' => 1,
        ),
        'type' => 'polygon'
    )
);
// Add a point layer from a database source.
$map->addLayer(
    array(
        'parser' => 'WKT',
        'dataSource' => array(
            'dbType' => 'proxy',
            'pearDSN' => 'mysql://user:password@host/database',
            'fromClause' => 'Sites s INNER JOIN Icons i ON s.IconID = i.IconID',
            'whereClause' => null,
            'fields' => array(
                'geometry' => 's.Geometry',
                'xmin'     => 's.XMin',
                'ymin'     => 's.YMin',
                'xmax'     => 's.XMax',
                'ymax'     => 's.YMax',
                'label'    => 's.Name',
                'symbol'   => 'i.AsciiCode'
            )
        ),
        'style' => array(
            'type' => 'symbol',
            'shape' => 'icon',
            'fillColor' => 'pink',
            'fontFile' => './fonts/greenmap.ttf',
            'symbolSize' => '10',
            'symbolMinimumScale' => 75000
        ),
        'type' => 'point'
    )
);
$map->setRange(453882,479839,5.35000e+06,5.3948e+06);

$map->showImage();
?>