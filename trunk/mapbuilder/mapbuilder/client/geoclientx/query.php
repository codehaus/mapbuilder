<?
$onlineresource=$_GET['onlineresource'];
$mode=$_GET['mode'];
$linkedWFS=$_GET['linkedWFS'];
$featureType=$_GET['featureType'];

if ( ! $onlineresource ) {
  # No WFS service provided.
  echo "No 'onlineresource' defined";
  }
$service_request=$onlineresource;
# -------------------------------------------------------------
# Test that the file has successfully downloaded.
#
if( !($wms_query = file($service_request)) ) {
  # Cannot download the capabilities file.
  echo "Unable to retrieve query info  '$service_request'";
}
$wms_query = implode("",$wms_query);
switch($mode){
  case "query":
    header("Content-type: text/html");
    // if already in html, simply write
    if(!(strpos($wms_query, "<html>")===false)){
      echo $wms_query;
    }
    //otherwise format before writing
    else{
      $wms_query = str_replace ("'", "", $wms_query);
      $lines = explode("\n", $wms_query);
      echo "<html><head>";
      $title="";
      foreach($lines as $line){
        if(strpos($line, "=")===false){
          $title .= $line;
        }
      }
      echo "<title>".$title."</title></head><body><table bgcolor=black cellpadding=1 cellspacing=0 border=0><tr><td><table bgcolor=gray cellpadding=3 cellspacing=1 border=0>";
      foreach($lines as $line){
        if((strpos($line, "=")===false)&&($line!="")){
          echo "<tr><td colspan=2 bgcolor=silver>$line</td></tr>";
        }
        else{
          $line = str_replace("=", "</td><td valign=top bgcolor=white>", $line);
          echo "<tr><td valign=top bgcolor=pink>".$line."</td></tr>";
        }
        
      }
      echo "</table></td></tr></table></body></html>";
    }
    break;
  case "edit":
    $lines = explode("\n", $wms_query);
    foreach($lines as $line){
      $parts = explode("=", $line);
      if($parts[0]=="featureid"){
        $service_request=$linkedWFS."FEATUREID=".featureType.".".$parts[0];
        if( !($response = file($service_request)) ) {
          # Cannot download the response file.
          echo "Unable to retrieve file '$wfs_service_request'";
          return;
        }
        else{
          header("Content-type: application/xml");
          $response = implode("",$response);
          $response=dropLeadingSpaces($response);
          $response = str_replace("gml:","",$response);
          echo $response;
        }
      }
    }
    break;
  default:
    break;
}
?>