<?
print '<?xml version="1.0" encoding="UTF-8"?>';
    writeTag("open",null,"ExtendedProjectDescriptor",null,True,True);
    $depth++;
    $sql="SELECT XMin,XMax,YMin,YMax,Width,Height,Scale FROM Project";
    $result = mysql_query($sql,$db);
    while ($myrow = mysql_fetch_array($result)){
      writeTag("open",null,"ScaleFactor",null,True,False);
      echo (($myrow["XMax"]-$myrow["XMin"])/($myrow["Scale"]*$myrow["Width"]));
      writeTag("close",null,"ScaleFactor",null,False,True);
      writeTag("open",null,"BBox",null,True,False);
      echo ($myrow["XMin"].",".$myrow["YMax"]." ".$myrow["XMax"].",".$myrow["YMin"]);
      writeTag("close",null,"BBox",null,False,True);
    }
    $depth--;
    writeTag("close",null,"ExtendedProjectDescriptor",null,True,True);
?>

