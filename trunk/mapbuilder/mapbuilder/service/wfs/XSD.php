<?
print '<?xml version="1.0" encoding="UTF-8"?>';
$atts["targetNamespace"]=$server;
$atts["xmlns:xsd"]="http://www.w3.org/2000/10/XMLSchema";
$atts["xmlns:wfs"]=$server;
$atts["xmlns:gml"]="http://www.opengis.net/gml";
$atts["elementFormDefault"]="qualified";
$atts["version"]="0.1";
writeTag("open","xsd","schema",$atts,True,True);
$atts=null;
$depth++;
$atts["namespace"]="http://www.opengis.net/gml";
$atts["schemaLocation"]="feature.xsd";
writeTag("selfclose","xsd","import",$atts,True,True);
$atts=null;
foreach($tables as $table){

  $sql="SELECT * FROM " . $table." LIMIT 1";
  $result = mysql_query($sql,$db);
  $atts["name"]=$table."_Type";
  writeTag("open","xsd","complexType",$atts,True,True);
  $atts=null;
  $depth++;
  writeTag("open","xsd","complexContent",Null,True,True);
  $depth++;
  $atts["base"]="gml:AbstractFeatureType";
  writeTag("open","xsd","extension",$atts,True,True);
  $atts=null;
  $depth++;
  for ($i=0;$i < mysql_num_fields ($result);$i++) {
    $meta = mysql_fetch_field ($result);
    $atts["name"]=$meta->name;
    $atts["maxOccurs"]="1";
    $nullable=$meta->not_null;
    if($nullable==1){
      $atts["nullable"]="false";
      $atts["minOccurs"]="1";
    }
    else{
      $atts["nullable"]="true";
      $atts["minOccurs"]="0";
    }
    $selfclose=true;
    if($atts["name"]=="Geometry"){
      $geomsql="SELECT Shape FROM Layers WHERE TableName = '" . $table ."'";
      $geomresult = mysql_query($geomsql,$db);
      while ($geomrow = mysql_fetch_array($geomresult)){
        $Shape=$geomrow["Shape"];
      }
      mysql_free_result ($geomresult);
      switch ($Shape) {
        case "point":
          $atts["type"]="gml:PointPropertyType";
          break;
        case "linestring":
          $atts["type"]="gml:LinestringPropertyType";
          break;
        case "polygon":
          $atts["type"]="gml:PolygonPropertyType";
          break;
      }
    }

      writeTag("selfclose","xsd","element",$atts,True,True);
    $atts=Null;
  }
  $depth--;
  writeTag("close","xsd","extension",Null,True,True);
  $depth--;
  writeTag("close","xsd","complexContent",Null,True,True);
  $depth--;
  writeTag("close","xsd","complexType",Null,True,True);
  $depth--;
}

mysql_free_result ($result);
?>
   <xsd:complexType name="featureCollectionType">
      <xsd:complexContent>
         <xsd:extension base="gml:AbstractFeatureCollectionType" />
      </xsd:complexContent>
   </xsd:complexType>
<?

foreach($tables as $table){
  $atts["name"]=$table;
  $atts["type"]="wfs:".$table."_Type";
  $atts["substitutionGroup"]="gml:_Feature";
  writeTag("selfclose","xsd","element",$atts,True,True);
}
$depth--;
?>
   <xsd:element name="featureCollection" type="wfs:featureCollectionType" substitutionGroup="gml:_FeatureCollection"/>
<?
writeTag("close","xsd","schema",Null,True,True);
?>

