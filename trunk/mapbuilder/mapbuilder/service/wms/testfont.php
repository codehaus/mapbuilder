<?php
  header("Content-type: image/jpeg");
  $im = imagecreate(400,30);
  $white = imagecolorallocate($im, 255,255,255);
  $black = imagecolorallocate($im, 0,0,0);
  
  // Replace path by your own font path
  imagettftext($im, 20, 0, 10, 20, $black, "/home/gworks/public_html/geoclientx/wms/greemi__.TTF","hHkKlL");
  imagejpeg($im);
  imagedestroy($im);
?>
