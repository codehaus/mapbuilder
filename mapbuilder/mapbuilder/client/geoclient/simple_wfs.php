<?

//added NR

ob_start("ob_gzhandler");

//end added

include('connect.php');

include('convertgeom.php');

$data = $GLOBALS["HTTP_RAW_POST_DATA"];

$thePath= "http://".$SERVER_NAME.$PHP_SELF;

$server="http://".$SERVER_NAME;

$BBox=null;

//added NR

$disjoints=array();

$NotDisjoints=array();

$disjointCoords=array();

$notDisjointCoords=array();

//end added

$currentTable=null;

$currentTag=null;

$gen=array();

$gen[0]="";

$level=0;

$depth=0;

$tables=array();

$fields=array();

$wheres=array();

$limits=array();



function startElement($parser, $name, $attrs) {

  global $BBox;

  global $currentTag;

  global $currentTable;

  global $gen;

  global $level;

  global $depth;

  global $tables;

  global $fields;

  global $limits;

  $level++;

  $currentTag = $name;

  $gen[$level]=$currentTag;

  if($level>0){

    if (($gen[($level)-1]=="Insert")||($gen[($level)-1]=="Update")){

      $tables[]=$currentTag;

    }

  }

  switch($currentTag){

    case "GetExtendedProjectDescriptor":

       getExtendedProjectDescriptor();

       break;

    case "GetStyledLayerDescriptor":

       getStyledLayerDescriptor();

       break;

    case "GetExtendedLayerDescriptor":

       getExtendedLayerDescriptor();

       break;

    case "GetCapabilities":

      getCapabilities();

      break;

    case "GetFeature":

      if (sizeof($attrs)) {

        while (list($k, $v) = each($attrs)) {

          if ($k=="maxFeatures"){

            $limits[$currentTable]=$v;

          }

        }

      }

      writeTag("open","gml","featureCollection",null,True,True);

      $depth++;

      break;

    case "Query":

      if (sizeof($attrs)) {

        while (list($k, $v) = each($attrs)) {

          if ($k=="typeName"){

            $currentTable=$v;

            $tables[]=$currentTable;

            $fields[$currentTable]=array();

          }

        }

      }

      break;

  }

}



function endElement($parser, $name) {

  global $currentTag;

  global $fields;

  global $fieldCount;

  global $level;

  global $depth;

  $currentTag=$name;

  switch($currentTag){

    case "GetFeature":

      doQuery("Select");

      $depth--;

      writeTag("close","gml","featureCollection",null,True,False);

      break;

//added NR

    case "DescribeFeatureType":

      getXSD();

      break;

//end added NR

    case "Query":

      break;

    case "Insert":

      doQuery("Insert");

      $fields=null;

      break;

    case "Update":

      doQuery("Update");

      $fields=null;

      break;

    case "Delete":

      doQuery("Delete");

      $fields=null;

      break;

  }

  $level--;

  $currentTag = null;

  }



// process data between tags

function characterData($parser, $data) {

  global $currentTable;

  global $currentTag;

//added NR

  global $tables;

//end added NR

  global $fields;

  global $gen;

  global $level;

  global $depth;

  global $BBox;

//added NR

  global $disjointCoords;

  global $notDisjointCoords;

//end added

//  echo "currenttag: '".$currentTag."' gen-2: '".$gen[$level-2]."' gen-3: '".$gen[$level-3]."' data: ".$data. " ";



  $pos=strpos($currentTag, "coordi");



  if(!(empty($pos))){

      switch($gen[$level-2]){

        case "BBOX":

          $BBox=$data;

          break;

        case "Disjoint":

//          echo "disjoint: ".$data;

          if($gen[$level-3]=="Not"){

//            echo "not";

            $notDisjointCoords[]=$data;

          }

          else{

            $disjointCoords[]=$data;

          }

          break;

        default:

          break;

      }

  }

  switch ($currentTag) {

//added NR

    case "PropertyName":

      switch($gen[$level-1]){

        case "Disjoint":

          if($gen[$level-2]=="Not"){

            disjoint($data,true);

          }

          else{

            disjoint($data,false);

          }

          break;

        default:

          break;

      }

      break;

//end added NR

    case "TypeName":

      if($gen[$level-1]=="DescribeFeatureType"){

        $tables[]=$data;

      }

      break;



    case "PropertyName":

      $fields[$currentTable][]=$data;

      break;

    default:

      break;

  }

}



function getCapabilities(){

  global $thePath;

  global $db;

  include('capabilities.php');

}



//end added NR

function intersects($Box){

  $Box=str_replace (","," ", $Box);

  $coords = explode(" ", $Box);

  $XMin=$coords[0];

  $YMin=$coords[1];

  $XMax=$coords[2];

  $YMax=$coords[3];

  return "((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMin BETWEEN  $YMin  AND  $YMax )) OR ((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMax BETWEEN  $YMin  AND  $YMax )) OR ((XMax BETWEEN  $XMin  AND  $XMax ) AND (YMin BETWEEN  $YMin  AND  $YMax )) OR ((XMax BETWEEN  $XMin  AND  $XMax ) AND (YMax BETWEEN  $YMin  AND  $YMax ))  OR ((XMin <  $XMin ) AND (YMin <  $YMin ) AND (XMax >  $XMax ) AND (YMax >  $YMax )) OR ((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMin <  $YMin ) AND (YMax >  $YMax )) OR ((XMax BETWEEN  $XMin  AND  $XMax ) AND (YMin <  $YMin ) AND (YMax >  $YMax )) OR ((YMin BETWEEN  $YMin  AND  $YMax ) AND (XMin <  $XMin ) AND (XMax >  $XMax )) OR ((YMax BETWEEN  $YMin  AND  $YMax ) AND (XMin <  $XMin ) AND (XMax >  $XMax ))";

}



function getExtendedProjectDescriptor(){

  global $thePath;

  global $depth;

  global $db;

  include('EPD.php');

}



function getStyledLayerDescriptor(){

  global $thePath;

  global $depth;

  global $db;

  include('SLD.php');

}



function getExtendedLayerDescriptor(){

  global $thePath;

  global $depth;

  global $db;

  include('ELD.php');

}



//added NR

function getXSD(){

  global $server;

  global $depth;

  global $db;

  global $tables;

  include('XSD.php');

}

//end added NR



function doQuery($queryType){

  global $currentTag;

  global $BBox;

  global $tables;

  global $fields;

  global $values;

  global $wheres;

  global $limits;

//added NR

  global $disjoints;

  global $notDisjoints;

  global $disjointCoords;

  global $notDisjointCoords;

//end added

  switch ($queryType) {

    case "Select":

      foreach($tables as $table){

        $sql="SELECT ";

        if (!(empty($fields[$table]))){

          foreach ($fields as $field){

            $sql = $sql. $field.",";

          }

        }

        else {

          $sql .= " * ";

        }

        $sql2 = "SELECT Min(XMin) AS TXMin,Max(XMax) AS TXMax, Min(YMin) AS TYMin,Max(YMax) AS TYMax ";

        $from = " FROM ".$table;

        if ((!(empty($BBox)))||(sizeof($wheres))||(sizeof($disjointCoords))||(sizeof($notDisjointCoords))){

          $from .= " WHERE ";

        }

        if (!(empty($BBox))){

          $from .= intersects($BBox)." AND ";

        }

        if (sizeof($notDisjoints)){

          for($i=0;$i<sizeof($notDisjoints);$i++){

            foreach($notDisjoints[$i] as $notDisjoint){

              if($notDisjoint==$table){

                $from .= " (".intersects($notDisjointCoords[$i]).") AND ";

                break;

              }

            }

          }

        }

        if (sizeof($disjoints)){

          for($i=0;$i<sizeof($disjoints);$i++){

            foreach($disjoints[$i] as $disjoint){

              if($disjoint==$table){

                $from .= " (NOT(".intersects($disjointCoords[$i]).")) AND ";

                break;

              }

            }

          }

        }

        if (sizeof($wheres)) {

          while (list($k, $v) = each($wheres)) {

            //note: incomplete: needs test for data type of field

            $from .= " (" . $k . "=" . $v . ") AND ";

          }

        }

        if ((!(empty($BBox)))||(sizeof($wheres))||(sizeof($disjointCoords))||(sizeof($notDisjointCoords))){

          $from=dropLastChrs($from,4);

        }

        if (!(empty($limits[$table]))){

          $from .= " LIMIT " . $limits[$table];

        }

        doSelect($table,$sql,$sql2,$from);

      }

      break;

    case "Insert":

      $sql="INSERT INTO " . $table;

      echo $sql;

      break;

    default:

      break;

  }

}



//added NR

function disjoint($data,$Not){

  global $disjoints;

  global $notDisjoints;

  $posOr = strpos($data, "|");

  if($Not==true){

    $num=count($notDisjoints);

    $notDisjoints[$num]=array();

    if(!(empty($posOr))){

      $tables = explode("|", $data);

      foreach($tables as $table){

        $posSlash = strpos($table, "/");

        $table = substr($table, 0, $posSlash);

        $notDisjoints[$num][]=$table;

      }

    }

    else{

      $posSlash = strpos($data, "/");

      $table = substr($data, 0, $posSlash);

      $notDisjoints[$num][]=$table;

    }

  }

  else{

    $num=count($disjoints);

    $disjoints[$num]=array();

    if(!(empty($posOr))){

      $tables = explode("|", $data);

      foreach($tables as $table){

        $posSlash = strpos($table, "/");

        $table = substr($table, 0, $posSlash);

        $disjoints[$num][]=$table;

      }

    }

    else{

      $posSlash = strpos($data, "/");

      $table = substr($data, 0, $posSlash);

      $disjoints[$num][]=$table;

    }

  }

}



function genBBox($XMin,$YMin,$XMax,$YMax){

  global $depth;

  global $tables;

  global $db;

  writeTag("open","gml","boundedBy",null,True,True);

  $depth++;

  writeTag("open","gml","Box",null,True,True);

  $depth++;

  writeTag("open","gml","coordinates",null,True,False);

  print $XMin.",".$YMin." ".$XMax.",".$YMax;

  writeTag("close","gml","coordinates",null,False,True);

  $depth--;

  writeTag("close","gml","Box",null,True,True);

  $depth--;

  writeTag("close","gml","boundedBy",null,True,True);

}



function doSelect($table,$sql,$sql2,$from){

  global $db;

  global $depth;

  $sql.=$from;

  $sql2.=$from;

//  echo $sql;

//  echo $sql2;

  $result = mysql_query($sql2,$db);

  while ($myrow = mysql_fetch_array($result)){

    if(!(empty($myrow["TXMin"]))){

//added NR

      genBBox($myrow["TXMin"],$myrow["TYMin"],$myrow["TXMax"],$myrow["TYMax"]);

    }

    else{

      return;

    }

  }

  $result = mysql_query($sql,$db);

  while ($myrow = mysql_fetch_array($result)){

      writeTag("open","gml","featureMember",null,True,True);

      $depth++;

      writeTag("open",null,$table,null,True,True);

      $depth++;   

      for ($i=0;($i < mysql_num_fields ($result)) ;$i++) { 

        $FieldName=mysql_field_name($result, $i);

        $FieldValue=$myrow[$FieldName];

        if (!(empty($FieldValue))){

          if (($FieldName!="Geometry")&&($FieldName!="TXMin")&&($FieldName!="TYMin")&&($FieldName!="TXMax")&&($FieldName!="TYMax")){

            writeTag("open",null,$table.".".$FieldName,null,True,False);

            echo $FieldValue;

            writeTag("close",null,$table.".".$FieldName,null,False,True);

          }

          else{

            writeTag("open",null,$table.".".$FieldName,null,True,True);

            $depth++;

            convertGeom($FieldValue);

            $depth--;

            writeTag("close",null,$table.".".$FieldName,null,True,True);

          }

        }

      }

      $depth--;

      writeTag("close",null,$table,null,True,True);

      $depth--;

      writeTag("close","gml","featureMember",null,True,True);

  }

}



function dropLastChrs($str,$no) {

  $strLen=strlen($str);

  return (substr($str,0,($strLen)-$no));

}



// initialize parser

$xml_parser = xml_parser_create();



// set callback functions

xml_set_element_handler($xml_parser, "startElement", "endElement");

xml_set_character_data_handler($xml_parser, "characterData");

xml_parser_set_option($xml_parser, XML_OPTION_CASE_FOLDING, 0);

    

if(!xml_parse($xml_parser, $data))

{

  echo "XML error: ".xml_error_string(xml_get_error_code($parser))." at line ". xml_get_current_line_number($parser); 

}



// clean up

xml_parser_free($xml_parser);



?>



