// # Monte Mario (Rome) / Italy zone 1
// <26591> +proj=tmerc +lat_0=0 +lon_0=-3.45233333333333 +k=0.999600 +x_0=1500000 +y_0=0 +ellps=intl +pm=rome +units=m +no_defs  <>
// "intl",    "a=6378388.0", "rf=297.", "International 1909 (Hayford)"
// Rome   12d27'8.4E == 12.45233333333333

/*
csList.EPSG26591 = "+title= Monte Mario (Rome) / Italy zone 1 EPSG:26591\
+proj=tmerc\
+lat_0=0 +lon_0=-3.45233333333333 +from_greenwich=12.45233333333333\
+k=0.999600 +x_0=1500000 +y_0=0\
+a=6378388.0, +b=6356911.94612795";
*/

csList.EPSG26591 = "+title= Monte Mario (Rome) / Italy zone 1 EPSG:26591\
+proj=tmerc\
+lat_0=0 +lon_0=9 \
+k=0.999600 +x_0=1500000 +y_0=0\
+a=6378388.0, +b=6356911.94612795";

/*
Radim Blazek  Feb 1, 2006  I used:

cs2cs -f %.5f +proj=tmerc +ellps=intl +lat_0=0 +lon_0=9 \
               +k=0.999600 +x_0=1500000 +y_0=0 \
               +no_defs  \
               +to +proj=latlong +datum=WGS84 \
               +no_defs

AutoCAD Map:                10.937335 46.035362
cs2cs :  1650000,5100000 -> 10.93836  46.03544  Radim's definition above
cs2cs                       10.938365 46.035444 203.740942 (using EPSG code)
MapInfo:                    10.938092 46.037011 (longlat WGS84)
MapInfo: 1650000 5100000 -> 10.938365 46.036266 (longitude / latitude, no datum)
cscs.js  (26 March, 2006)   10.93836  46.036266
Proj.js: 1650000 5100000 -> 10.93836  46.03626
ArcGIS 9.1    Has no transformation from Monte Mario to WGS84
   C:\ESRI\ArcGIS\Coordinate Systems\Projected Coordinate Systems\National Grids\Monte Mario (Rome) Italy 1.prj

*/

/*
MapInfo def:
"--- Italian Coordinate Systems ---"
"Italian National System (Gauss-Boaga), Zone 1 (West)\p26591", 8, 87, 7, 9,  0, 0.9996, 1500000, 0
"Italian National System (Gauss-Boaga), Zone 2 (East)\p26592", 8, 87, 7, 15, 0, 0.9996, 2520000, 0
*/