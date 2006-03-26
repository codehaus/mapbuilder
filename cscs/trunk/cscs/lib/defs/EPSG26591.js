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
Radim Blazek  Feb 1, 2006
I used

cs2cs -f %.5f +proj=tmerc +ellps=intl +lat_0=0 +lon_0=9 \
               +k=0.999600 +x_0=1500000 +y_0=0 \
               +no_defs  \
               +to +proj=latlong +datum=WGS84 \
               +no_defs
*/


