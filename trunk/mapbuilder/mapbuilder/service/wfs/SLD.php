<?
print '<?xml version="1.0" encoding="UTF-8"?>';
?>
<!DOCTYPE StyledLayerDescriptor SYSTEM "SLD.dtd">
<?
    writeTag("open",null,"StyledLayerDescriptor",null,True,True);
    $depth++;
    $sql="SELECT TableName,Shape,FillColor,StrokeColor,StrokeWidth,LabelColor FROM Layers";
    $result = mysql_query($sql,$db);
    while ($myrow = mysql_fetch_array($result)){
        $TableName=$myrow["TableName"];
        $Shape=$myrow["Shape"];
        $atts=array();
        $atts["name"]=$TableName;
        writeTag("open",null,"NamedLayer",$atts,True,True);
        $atts["name"]="geometry";
        $depth++;
        writeTag("open",null,"UserStyle",null,True,True);
        $depth++;
        switch($Shape){
          case "polygon":
            $FillColor=$myrow["FillColor"];
            $StrokeColor=$myrow["StrokeColor"];
            writeTag("open",null,"PolygonSymbol",null,True,True);
            $depth++;
            writeTag("open",null,"Geometry",null,True,True);
            $depth++;
            writeTag("selfclose",null,"FetchFeatureProperty",$atts,True,True);
            $depth--;
            writeTag("close",null,"Geometry",null,True,True);
            $depth--;
            writeTag("open",null,"StrokeColor",null,True,False);
            echo $StrokeColor;
            writeTag("close",null,"StrokeColor",null,False,True);
            writeTag("open",null,"FillColor",null,True,False);
            echo $FillColor;
            writeTag("close",null,"FillColor",null,False,True);
            $depth--;
            writeTag("close",null,"PolygonSymbol",null,True,True);
            break;
          case "line":
            $StrokeColor=$myrow["StrokeColor"];
            writeTag("open",null,"LineStringSymbol",null,True,True);
            $depth++;
            writeTag("open",null,"Geometry",null,True,True);
            $depth++;
            $atts=array();
            $atts["name"]=$TableName;
            writeTag("selfclose",null,"FetchFeatureProperty",$atts,True,True);
            $depth--;
            writeTag("close",null,"Geometry",null,True,True);
            $depth--;
            writeTag("open",null,"StrokeColor",null,True,False);
            echo $StrokeColor;
            writeTag("close",null,"StrokeColor",null,False,True);
            $depth--;
            writeTag("close",null,"LineStringSymbol",null,True,True);
            break;
          case "point":
            $FillColor=$myrow["FillColor"];
            writeTag("open",null,"PointSymbol",null,True,True);
            $depth++;
            writeTag("open",null,"Geometry",null,True,True);
            $depth++;
            $atts=array();
            $atts["name"]=$TableName;
            writeTag("selfclose",null,"FetchFeatureProperty",$atts,True,True);
            $depth--;
            writeTag("close",null,"Geometry",null,True,True);
            $depth--;
            writeTag("open",null,"FillColor",null,True,False);
            echo $FillColor;
            writeTag("close",null,"FillColor",null,False,True);
            $depth--;
            writeTag("close",null,"PointSymbol",null,True,True);
            break;
          default:
            break;
        }
        $depth--;
        writeTag("close",null,"UserStyle",null,True,True);
        $depth--;
        writeTag("close",null,"NamedLayer",null,True,True);
    }
    $depth--;
    writeTag("close",null,"StyledLayerDescriptor",null,True,True);
?>

