<?
// script postxml.php
// Purpose: accept incoming variables and post xml content to requested url, then return result

// read in the variables
$host=$_GET['host'];
if(empty($host)){
  $host="localhost";
}
$port=$_GET['port'];
if(empty($port)){
  $port="80";
}
$path=$_GET['path'];
$post_data=$_GET['post_data'];

// define content type as XML
header("Content-type: text/xml");

// define class with functions to open socket and post XML
// from http://www.phpbuilder.com/annotate/message.php3?id=1013274 by Richard Hundt

class HTTP_Client 
{ 
  var $host; 
  var $path;
  var $port; 
  var $post_data; 
  var $socket; 
  var $errno; 
  var $errstr; 
  var $timeout; 
  var $buf; 
  var $result; 
  var $agent_name = "MyAgent"; 
  //Constructor, timeout 30s 
  function HTTP_Client($host, $port, $post_data, $timeout = 30) 
  { 
    $this->host = $host; 
    $this->port = $port;
    $this->post_data = $post_data;
    $this->timeout = $timeout; 
  } 
  
  //Opens a connection 
  function connect() 
  { 
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
  function set_path($path) 
  { 
    $this->path = $path; 
  } 
  
  //Send request and clean up 
  function send_request() 
  { 
    if(!$this->connect()) 
    { 
      return false; 
    } 
    else 
    { 
      $this->result = $this->request($this->post_data); 
      return $this->result; 
    } 
  } 
  
  function request($post_data) 
  { 
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
  
  
  function close() 
  { 
    fclose($this->socket); 
  } 
} 

// post XML
$posting=new HTTP_Client($host,$port,$post_data);
$posting->set_path($path);
$result=$posting->send_request();

// strip leading text from result and output result
$len=strlen($result);
$pos = strpos($result, "<");
$result = substr($result, $pos, $len);
echo $result;
?> 
