<?php
$path = $_SERVER['PATH_TRANSLATED'];
$dir = substr($path, 0, strrpos($path, '/') + 1);
ini_set('include_path', $dir . PATH_SEPARATOR . ini_get('include_path'));
require_once 'Image/GIS.php';
$map = new Image_GIS(
  array(
//    'debug'  => true,
    'width'  => 700,
    'height' => 300
  )
);
$map->addLayer(
    array(
        'parser' => 'WMS',
        'dataSource' => array(
            'uri' => 'http://atlas.gc.ca/cgi-bin/atlaswms_en?VERSION=1.1.0&request=GetMap&SRS=EPSG:4326&LAYERS=can_7.5m&STYLES=&FORMAT=PNG'
        ),
        'type' => 'image'
    )
);
$map->addLayer(
    array(
        'parser' => 'E00',
        'dataSource' => array(
            'dataFile' => './data/bcnparkg.e00'
        ),
        'style' => array(
            'type'        => 'fill',
            'fillColor' => 'green',
            'strokeColor' => 'forestgreen',
            'strokeWidth' => 1,
        ),
        'type' => 'polygon'
    )
);
$map->addLayer(
    array(
        'parser' => 'E00',
        'dataSource' => array(
            'dataFile' => './data/bcroadg.e00'
        ),
        'style' => array(
            'type'        => 'stroke',
            'strokeColor' => 'red',
            'strokeWidth' => 1,
        ),
        'type' => 'polyline'
    )
);
$map->addLayer(
    array(
        'parser' => 'E00',
        'dataSource' => array(
            'dataFile' => './data/bctowng.e00'
        ),
        'style' => array(
            'type' => 'symbol',
            'shape' => 'circle',
            'fillColor' => 'pink',
            'width' => '6',
            'height' => '6'
        ),
        'type' => 'point'
    )
);

$map->setRange(-136, -114, 48, 60);

$map->showImage();
?>