<?
$white;
function getImage($onlineResource){
  global $im,$white;
  $im=imagecreatefrompng($onlineResource);
  $white = imagecolorallocate ($im, 255, 255, 255);
}

// create the image
function createImage(){
  global $im,$white,$mapWidth,$mapHeight;
  $im = ImageCreate($mapWidth,$mapHeight);
  $white = imagecolorallocate ($im, 255, 255, 255);
  ImageFilledRectangle($im,0,0,$mapWidth,$mapHeight,$white);
}

function drawRect($pt){
  global $im,$iconPath,$iconId,$iconFormat,$iconWidth,$iconHeight;
  $col = imagecolorallocate ($im, 155, 155, 155);
  imagefilledrectangle ($im, $pt[0], $pt[1], $pt[0]+3, $pt[1]+3, $col);
}

function drawIcon($pt){
  global $im,$iconPath,$iconId,$iconFormat,$iconWidth,$iconHeight;
  $col = imagecolorallocate ($im, 0, 0, 0);
imagettftext($im, 15, 0, $pt[0], $pt[1], $col, "/home/gworks/public_html/geoclientx/wms/ARIAL.TTF","*");
//  $ic = imagecreatefrompng($iconPath.$iconId.".".$iconFormat);
//  imagecopy ($im,$ic,$pt[0]-($iconWidth/2),$pt[1]-($iconHeight/2),0,0,$iconWidth,$iconHeight);
}

function drawPoly($pts){
  global $im;
  $black = imagecolorallocate ($im, 0, 0, 0);
  imagepolygon ($im, $pts, count($pts)/2, $black);
}

function drawLine($pts){
  global $im;
  $black = imagecolorallocate ($im, 0, 0, 0);
  $i=0;
  while($i<count($pts)-1){
    imageline ($im,$pts[$i][0],$pts[$i][1],$pts[$i+1][0],$pts[$i+1][1],$black);
    $i++;
  }
}

function outputImage(){
  global $im;
  $col = imagecolorallocate ($im, 0, 0, 0);
//imagettftext($im, 15, 0, 10, 10, $col, "/home/gworks/public_html/geoclientx/wms/greemi__.TTF","abcdefghijklmABCDEFG1234");

  global $im,$white,$transparent,$imageFormat;
  if($transparent==true){
    imagecolortransparent ($im,$white);
  }
  // send the image
  switch($imageFormat){
    case "png":
      header("content-type: image/png");
      ImagePng($im);
      break;
    default:
      header("content-type: image/png");
      ImagePng($im);
  }
  imagedestroy($im);
}

?>