<?
/*
script name: convertgeom.php
distributed under GNU LGPL license
info: Nedjo Rogers, nedjo@gworks.ca
*/

function geometrytype($geom){
  $pos = strpos($geom, "(");
  $geomType = substr($geom, 0, $pos);
  return $geomType;
}

function dropShapeName($str) {
  return strchr($str,"(");
}

function dropFirstLastChrs($str) {
  $strLen=strlen($str);
  return (substr($str,1,($strLen)-2));
}

function addSpacesMulti($str) {
  $str = str_replace(")),((", ")) , ((", $str);
  return $str;
}

function addSpacesSingle($str) {
  $str = str_replace("),(", ") , (", $str);
  return $str;
}

function explodeGeom($str) {
  $strs = explode(" , ", $str);
  return $strs;
}

function convertGeom($geom){
  $geomType=strtoupper(geometrytype($geom));
  $geom=dropFirstLastChrs(dropShapeName($geom));
  switch ($geomType) {
    case "POINT":
      convertPoint($geom);
      break;
    case "LINESTRING":
      convertLineString($geom);
      break;
    case "POLYGON":
      convertPolygon($geom);
      break;
    case "MULTILINESTRING":
      convertMultiLineString($geom);
      break;
    case "MULTIPOLYGON":
      convertMultiPolygon($geom);
      break;
    case "GEOMETRYCOLLECTION":
      convertGeometryCollection($geom);
      break;
  }
}

function convertMultiPoint($geom) {
  $geom=addSpacesMulti($geom);
  $points=explodeGeom($geom);
  foreach ($points as $point) {
    convertPoint(dropFirstLastChrs($point));
  }
}

function convertPoint($geom){
  $pt=explode(" ",$geom);
//  echo "point: ".$pt[0]." ".$pt[1];
  makePoint($pt);
}

function convertCoordinatesToArrays($str){
  $segments = explode(" ", $str);
  for($i=0;$i<(count($segments));$i++){
    $segments[$i] = explode(",",$segments[$i]);
  }
  return $segments;
}

function convertMultiLineString($geom) {
  global $depth;
  $geom=addSpacesSingle($geom);
  $lines=explodeGeom($geom);
  foreach ($lines as $line) {
    convertLineString(dropFirstLastChrs($line));
  }
  $depth--;
  writeTag("close","gml","MultiLineString",Null,True,True);
}

function convertLineString($geom){
  global $depth;
  echo convertCoordinatesToGML($geom);
}

function convertMultiPolygon($geom) {
  global $depth;
  $geom=addSpacesMulti($geom);
  $polys=explodeGeom($geom);
  foreach ($polys as $poly) {
    convertPolygon(dropFirstLastChrs($poly));
  }
  $depth--;
}

function convertPolygon($geom){
  $geom=addSpacesSingle($geom);
  $rings=explodeGeom($geom);
  $pass=0;
  foreach ($rings as $ring) {
    $ring=dropFirstLastChrs($ring);
    if($pass==0){
      $ring = str_replace(",", " ", $ring);
      $pts = explode(" ",$ring);
      makePoly($pts);
    }
    else{
      // for now, skip inner rings
      return;
    }
  }
  $depth--;
}

function convertGeometryCollection($geom){
  global $depth;
  $searchstr = array(",POINT",",LINESTRING",",POLYGON",",MULTIPOINT",",MULTILINESTRING",",MULTIPOLYGON");
  $replacestr = array(" , POINT"," , LINESTRING"," , POLYGON"," , MULTIPOINT"," , MULTILINESTRING"," , MULTIPOLYGON");
  $geom = str_replace($searchstr,$replacestr,$geom);
  $geoms=explodeGeom($geom);
  foreach ($geoms as $geom) {
    convertGeom($geom);
  }
  $depth--;
}
?>