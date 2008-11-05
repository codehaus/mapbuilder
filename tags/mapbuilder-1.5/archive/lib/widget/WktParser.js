/*
Author:       Nedjo Rogers nedjo ATgworks.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

/**
 * Parse OGC Simple Features for SQL WKT into GML.
 * @constructor
 */
function WktParser() {

  /**
   * Do parsing.
   * @param geom Geometry in WKT format.
   */
  this.parse = function(geom) {
    geomTypeExp=/(\D+)\(([^)]+)\)/;
    pointExp=/(-?[0-9]+\.[0-9]+)\s+(-?[0-9]+\.[0-9]+)/;
    ringExp=/\(([^)]+)\)/;
    if (match = geomTypeExp.exec(geom)) {
      switch(match[1]) {
        case 'POINT':
          if (pt = pointExp.exec(match[2])) {
            out = '<gml:Point><gml:coordinates decimal="." cs="," ts=" "><gml:coord>' + pt[1] + ',' + pt[2] + '</gml:coord></gml:coordinates></gml:Point>';
          }
          break;
        case 'LINESTRING':
          out = '<gml:Linestring><gml:coordinates decimal="." cs="," ts=" ">';
          while (pt = pointExp.exec(match[2])) {
            out += '<gml:coord>' + pt[1] + ',' + pt[2] + '</gml:coord>';
            match[2] = match[2].replace(pt[0], '');
          }
          out += '</gml:coordinates></gml:Linestring>';
          break;
      }
    }
    return out;
  }
}
