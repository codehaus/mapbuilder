<?
print '<?xml version="1.0" encoding="UTF-8"?>';
    writeTag("open",null,"ExtendedLayerDescriptor",null,True,True);
    $depth++;
    $sql="SELECT TableName,Shape,MinScale,MaxScale,HasAttributes,IDType,NameField,IDField,URL,
		  LegendType,ClassificationField,ClassificationType,ClassesCount,SymbolType,SymbolSize,StrokeWidth,ColorList FROM Layers";
    $result = mysql_query($sql,$db);
      while ($myrow = mysql_fetch_array($result)){
        $TableName=$myrow["TableName"];
        $atts=array();
        $atts["name"]=$TableName;
        writeTag("open",null,"NamedLayer",$atts,True,True);
        $depth++;
        while (list ($key, $val) = each ($myrow)) {
          if(!(gettype($key)=="integer")&&(!($val==""))){
            writeTag("open",null,$key,null,True,False);
            echo $val;
            writeTag("close",null,$key,null,False,True);
          }
        }
        $depth--;
        writeTag("close",null,"NamedLayer",null,True,True);
      }
    $depth--;
    writeTag("close",null,"ExtendedLayerDescriptor",null,True,True);
?>

