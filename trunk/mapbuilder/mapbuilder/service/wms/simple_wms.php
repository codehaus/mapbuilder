<?
$im=null;
$iconPath="../images/icons/";
$iconFormat="png";
$iconDensityThresh = 3; //threshold of icon density, in icons per 1000 square pixel
$iconWidth=14;
$iconHeight=13;
$iconId;
$ptMode;
$request=$_REQUEST['REQUEST'];
$layers=$_REQUEST['LAYERS'];


function dropComma($str){
  $strLen=strlen($str);
  if(substr($str,($strLen)-1,($strLen))==","){
    $str=substr($str,0,($strLen)-1);
  }
  return $str;
}

$bbox=$_GET['BBOX'];
$mapWidth=$_GET['WIDTH'];
if(empty($mapWidth)){
  $mapWidth=350;
}
$mapHeight=$_GET['HEIGHT'];
if(empty($mapHeight)){
  $mapHeight=200;
}
$imageFormat=$_GET['FORMAT'];
if(empty($imageFormat)){
  $imageFormat='png';
}
$transparent=$_GET['TRANSPARENCY'];
if(empty($transparent)){
  $transparent=true;
}
include('connect.php');
include('convertgeomwms.php');
include('image.php');

if(!(empty($bbox))){
  $bbox=explode(",",$bbox);
}
else{
  $sql="SELECT XMin,YMin,XMax,YMax from Project";
  $result = mysql_query($sql,$db);
  while ($row = mysql_fetch_array($result, MYSQL_ASSOC)){
    $bbox[0]=$row["XMin"];
    $bbox[1]=$row["YMax"];
    $bbox[2]=$row["XMax"];
    $bbox[3]=$row["YMin"];
  }
}
$bbox=scaleExt($bbox);
$layers=dropComma($layers);
$thePath= "http://".$_SERVER["SERVER_NAME"].$_SERVER["PHP_SELF"];
$server="http://".$_SERVER["SERVER_NAME"];

//$onlineResource="http://scbc.dyndns.org/cgi-bin/mapserv?map=/usr/local/mapserver/html/gworks/greenmap/greenmap.map&VERSION=1.1.0&REQUEST=GetMap&LAYERS=".$layersStr."&SRS=".$srs."&BBOX=".implode(",",$bbox)."&WIDTH=".$mapWidth."&HEIGHT=."$mapHeight&FORMAT=png";
//$onlineResource="http://scbc.dyndns.org/cgi-bin/mapserv?map=/usr/local/mapserver/html/gworks/greenmap/greenmap.map&VERSION=1.1.0&REQUEST=GetMap&BBOX=".implode(',',$bbox)."&WIDTH=".$mapWidth."&HEIGHT=".$mapHeight";
//$onlineResource="http://scbc.dyndns.org/cgi-bin/mapserv?map=/usr/local/mapserver/html/gworks/greenmap/greenmap.map&VERSION=1.1.0&REQUEST=GetMap&BBOX=".implode(',',$bbox)."&WIDTH=300&HEIGHT=200&FORMAT=png";
$onlineResource="http://scbc2.dyndns.org/cgi-bin/mapserv?map=/usr/local/mapserver/html/gworks/greenmap/greenmap.map&VERSION=1.1.0&REQUEST=GetMap&LAYERS=gvic,public,roads&SRS=EPSG:26910&BBOX=".implode(",",$bbox)."&WIDTH=".$mapWidth."&HEIGHT=".$mapHeight."&FORMAT=png";
function loadImage(){
  global $onlineResource;
  if(empty($onlineResource)){
    createImage();
  }
  else{
    getImage($onlineResource);
  }
}

readRequest();

function getCapabilities(){
  global $thePath,$db;
  include('capabilities.php');
}

function getScreenCoords($pt){
  global $bbox,$mapWidth,$mapHeight;
//  $bbox[0]=parseFloat($bbox[0]);
//  $bbox[1]=parseFloat($bbox[1]);
//  $bbox[2]=parseFloat($bbox[2]);
//  $bbox[3]=parseFloat($bbox[3]);
  $xfac = ($mapWidth/($bbox[2]-$bbox[0]));
  $yfac = ($mapHeight/($bbox[3]-$bbox[1]));
  $pt[0]=$xfac*($pt[0]-$bbox[0]);
  $pt[1]=$mapHeight-($yfac*($pt[1]-$bbox[1]));
  return $pt;
}

function scaleExt($ext){
  global $mapWidth,$mapHeight;
  // 
  // Resize a spatial extent to have the same aspect ratio
  // as an image size.
  //
  //
//  $ext[0]=parseFloat($ext[0]);
//  $ext[1]=parseFloat($ext[1]);
//  $ext[2]=parseFloat($ext[2]);
//  $ext[3]=parseFloat($ext[3]);
  $sw = $ext[2] - $ext[0];
  $sh = $ext[3] - $ext[1];
  if($sw/$mapWidth>$sh/$mapHeight){
    $ext[1]=$ext[1]-((($sw/$mapWidth*$mapHeight)-$sh)/2);
    $ext[3]=$ext[3]+((($sw/$mapWidth*$mapHeight)-$sh)/2);
  }
  else{
    $ext[0]=$ext[0]-((($sh/$mapHeight*$mapWidth)-$sw)/2);
    $ext[2]=$ext[2]+((($sh/$mapHeight*$mapWidth)-$sw)/2);
  }
  return $ext;
}

function makePoint($pt){
  global $ptMode;
  $pt=getScreenCoords($pt);
  switch($ptMode){
    case "pt":
      drawRect($pt);
      break;
    case "icon":
      drawIcon($pt);
      break;
    default:
      drawRect($pt);
  }
}

function makePoly($pts){
  $i=0;
  while($i<count($pts)){
    $pt=getScreenCoords(array($pts[$i],$pts[$i+1]));
    $pts[$i]=$pt[0];
    $pts[$i+1]=$pt[1];
    $i++;
    $i++;
  }
//  for($i=0;$i<count($pts);$i++){
//    echo " pt: ".$pts[$i];
//  }
  drawPoly($pts);
}

//end added NR
function intersects($box){
  $XMin=$box[0];
  $YMin=$box[1];
  $XMax=$box[2];
  $YMax=$box[3];
//return "((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMin BETWEEN  $YMin  AND  $YMax ))";
  return "((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMin BETWEEN  $YMin  AND  $YMax )) OR ((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMax BETWEEN  $YMin  AND  $YMax )) OR ((XMax BETWEEN  $XMin  AND  $XMax ) AND (YMin BETWEEN  $YMin  AND  $YMax )) OR ((XMax BETWEEN  $XMin  AND  $XMax ) AND (YMax BETWEEN  $YMin  AND  $YMax ))  OR ((XMin <  $XMin ) AND (YMin <  $YMin ) AND (XMax >  $XMax ) AND (YMax >  $YMax )) OR ((XMin BETWEEN  $XMin  AND  $XMax ) AND (YMin <  $YMin ) AND (YMax >  $YMax )) OR ((XMax BETWEEN  $XMin  AND  $XMax ) AND (YMin <  $YMin ) AND (YMax >  $YMax )) OR ((YMin BETWEEN  $YMin  AND  $YMax ) AND (XMin <  $XMin ) AND (XMax >  $XMax )) OR ((YMax BETWEEN  $YMin  AND  $YMax ) AND (XMin <  $XMin ) AND (XMax >  $XMax ))";
}

function doSelect($table,$sql,$from){
  global $db,$iconId,$iconDensityThresh,$ptMode,$mapWidth,$mapHeight;
  $sql.=$from;
  $result = mysql_query($sql,$db);
  $numRows = mysql_num_rows($result);
//  if(($numRows /(($mapHeight*$mapWidth)/1000))<$iconDensityThresh){
//    $result2=mysql_query("SELECT IconID from Icons left join on Sites.IconID=Icons.IconID ".$where,$db);
//    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)){
//      eval("$".$row["IconID"]."=
//    }
//  }
  while ($row = mysql_fetch_array($result, MYSQL_ASSOC)){
    $iconId=$row["IconID"];
    if(empty($iconId)){
        $iconId="dot";
    }
//    if(($numRows /(($mapHeight*$mapWidth)/1000))>$iconDensityThresh){
    if($numRows>25){
      $ptMode="pt";
    }
    else{
      $ptMode="icon";
    }
    convertGeom($row["Geometry"]);
  }
}

function dropLastChrs($str,$no) {
  $strLen=strlen($str);
  return (substr($str,0,($strLen)-$no));
}

function readRequest(){
  global $im, $request, $layers, $bbox, $mapWidth, $mapHeight;
  switch($request){
    case "GetCapabilities":
      getCapabilities();
      break;
    case "GetMap":
      loadImage();
      $layers=explode(",",$layers);
      foreach($layers as $layer){
        $table=$layer;
        $sql="SELECT *";
        $from = " FROM ".$table;
        if (!(empty($bbox))){
          $from .= " WHERE ";
          $from .= intersects($bbox);
        }
        doSelect($table,$sql,$from);
      }
      outputImage();
      break;
    default:
      echo $request;
      break;
  }
}

?>