<?
/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
$Name$
*/

////////////////////////////////////////////////////////////////////////////////
// Description:
// Script to redirect the request http://host/proxy.php?url=http://someUrl
// to http://someUrl .
//
// This script can be used to circumvent javascript's security requirements
// which prevent a URL from an external web site being called.
//
// Author: Nedjo Rogers
////////////////////////////////////////////////////////////////////////////////

// read in the variables

$onlineresource=$_REQUEST['url'];
$parsed = parse_url($onlineresource);
$host = $parsed["host"];
$path = $parsed["path"] . "?" . $parsed["query"];
if(empty($host)) {
  $host = "localhost";
}
$port = $_REQUEST['port'];
if(empty($port)){
  $port="80";
}
$contenttype = $_REQUEST['contenttype'];
if(empty($contenttype)) {
  $contenttype = "text/xml";
}
$data = $GLOBALS["HTTP_RAW_POST_DATA"];
// define content type
header("Content-type: " . $contenttype);

if(empty($data)) {
  $result = send_request();
}
else {
  // post XML
  $posting = new HTTP_Client($host, $port, $data);
  $posting->set_path($path);
  $result = $posting->send_request();
}

// strip leading text from result and output result
$len=strlen($result);
$pos = strpos($result, "<");
if($pos > 1) {
  $result = substr($result, $pos, $len);
}
$result = str_replace("xlink:","",$result);
echo $result;

// define class with functions to open socket and post XML
// from http://www.phpbuilder.com/annotate/message.php3?id=1013274 by Richard Hundt

class HTTP_Client { 
  var $host; 
  var $path;
  var $port; 
  var $data; 
  var $socket; 
  var $errno; 
  var $errstr; 
  var $timeout; 
  var $buf; 
  var $result; 
  var $agent_name = "MyAgent"; 
  //Constructor, timeout 30s 
  function HTTP_Client($host, $port, $data, $timeout = 30) { 
    $this->host = $host; 
    $this->port = $port;
    $this->data = $data;
    $this->timeout = $timeout; 
  } 
  
  //Opens a connection 
  function connect() { 
    $this->socket = fsockopen($this->host, 
      $this->port, 
      $this->errno, 
      $this->errstr, 
      $this->timeout 
      ); 
    if(!$this->socket) 
      return false; 
    else 
      return true; 
  } 
  
  //Set the path 
  function set_path($path) { 
    $this->path = $path; 
  } 
  
  //Send request and clean up 
  function send_request() { 
    if(!$this->connect()) { 
      return false; 
    } 
    else { 
      $this->result = $this->request($this->data);
      return $this->result; 
    } 
  } 
  
  function request($data) { 
    $this->buf = ""; 
    fwrite($this->socket, 
      "POST $this->path HTTP/1.0\r\n". 
      "Host:$this->host\r\n". 
      "User-Agent: $this->agent_name\r\n". 
      "Content-Type: application/xml\r\n". 
      "Content-Length: ".strlen($post_data). 
      "\r\n". 
      "\r\n".$data. 
      "\r\n" 
    ); 
  
    while(!feof($this->socket)) 
      $this->buf .= fgets($this->socket, 2048); 
      $this->close(); 
      return $this->buf; 
  } 
  
  
  function close() {
    fclose($this->socket);
  } 
} 



function send_request() {
  global $onlineresource;
  if(!($response = file($onlineresource))) {
    echo "Unable to retrieve file '$service_request'";
  }
  $response = implode("",$response);
  return $response;
}
?> 
