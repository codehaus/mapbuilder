<?php
require_once 'Service/GIS.php';
$service = new Service_GIS(
  array(
    'handler' => 'WMS'
  )
);

$service->addFeatureType(
    array(
        'name' => 'coastline',
        // For "settings", put the array of values that would create a layer in Image_GIS.
        'settings' => array(
            'parser' => 'WMS',
            'dataSource' => array(
                'uri' => 'http://atlas.gc.ca/cgi-bin/atlaswms_en?VERSION=1.1.0&request=GetMap&SRS=EPSG:4326&LAYERS=can_7.5m&STYLES=&FORMAT=PNG'
            ),
            'type' => 'image'
        )
    )
);
$service->addFeatureType(
    array(
        'name' => 'nparks',
        'settings' => array(
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
    )
);
$service->addFeatureType(
    array(
        'name' => 'roads',
        'settings' => array(
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
    )
);
$service->addFeatureType(
    array(
        'name' => 'towns',
        'settings' => array(
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
    )
);

$service->handleRequest();
?>