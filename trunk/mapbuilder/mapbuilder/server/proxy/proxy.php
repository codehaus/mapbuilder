<?
// script proxy.php
// Purpose: accept incoming variables and post content to requested url, then return result

// read in the variables

$onlineresource=$_REQUEST['onlineresource'];
$parsed = parse_url($onlineresource);
$host = $parsed["host"];
$path = $parsed["path"] . "?" . $parsed["query"];
if(empty($host)) {
  $host = "localhost";
}
$port = $_REQUEST['port'];
$contenttype = $_REQUEST['contenttype'];
if(empty($contenttype)) {
  $contenttype = "text/xml";
}
if(empty($port)){
  $port="80";
}
$data = $GLOBALS["HTTP_RAW_POST_DATA"];

// define content type
header("Content-type: " . $contenttype);

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
    $this->post_data = $post_data;
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
      $this->result = $this->request($this->post_data); 
      return $this->result; 
    } 
  } 
  
  function request($post_data) { 
    $this->buf = ""; 
    fwrite($this->socket, 
      "POST $this->path HTTP/1.0\r\n". 
      "Host:$this->host\r\n". 
      "User-Agent: $this->agent_name\r\n". 
      "Content-Type: application/xml\r\n". 
      "Content-Length: ".strlen($post_data). 
      "\r\n". 
      "\r\n".$post_data. 
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

// post XML
$posting=new HTTP_Client($host,$port,$data);
$posting->set_path($path);
$result=$posting->send_request();

// strip leading text from result and output result
$len=strlen($result);
$pos = strpos($result, "<");
$result = substr($result, $pos, $len);
$result = str_replace("xmlns:","",$result);
echo $result;
?> 
