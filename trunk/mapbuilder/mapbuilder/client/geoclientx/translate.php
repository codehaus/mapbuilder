<?
# -------------------------------------------------------------
# Test that there is a service defined before proceding.
#
$onlineresource=$_GET['onlineresource'];
$contenttype=$_GET['contenttype'];

if ( ! $onlineresource ) {
  # No service provided.
  echo "No 'onlineresource' defined";
  }

if ( $contenttype ) {
  switch($contenttype){
    case "xml":
      header("Content-type: application/xml");
      break;
    case "html":
      header("Content-type: text/html");
      break;
    case "text":
      header("Content-type: text/plain");
      break;
    default:
      break;
  }
}
$service_request=$onlineresource;

function dropLeadingSpaces($str) {
  $strLen=strlen($str);
  $pos = strpos($str, "<?xml");
  if(!($pos===false)){
    return (substr($str,$pos,($strLen)-$pos));
  }
  else{
    return $str;
  }
}
# -------------------------------------------------------------
# Test that the xml file has successfully downloaded.
#

if( !($response = file($service_request)) ) {
  # Cannot download the response file.
  echo "Unable to retrieve file '$service_request'";
}
$response = implode("",$response);
$response=dropLeadingSpaces($response);
$response = str_replace("gml:","",$response);
echo $response;
?>