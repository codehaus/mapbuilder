<?
print '<?xml version="1.0" encoding="UTF-8"?>';
?>
<!DOCTYPE WMT_MS_Capabilities SYSTEM "http://www.digitalearth.gov/wmt/xml/capabilities_1_1_0.dtd"
 [
 <!ELEMENT VendorSpecificCapabilities EMPTY>
 ]>  <!-- end of DOCTYPE declaration -->

<WMT_MS_Capabilities version="1.1.0" updateSequence="0">
<Service> <!-- a service IS a MapServer mapfile -->
  <Name>GetMap</Name> <!-- WMT defined -->
  <Title>Greater Victoria Green Map</Title>
  <Abstract>A map of Greater Victoria, British Columbia using the Green Map System icons</Abstract>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>?"/>
  <ContactInformation>
    <ContactPersonPrimary>
      <ContactPerson>Nedjo Rogers</ContactPerson>
      <ContactOrganization>GroundWorks Learning Centre</ContactOrganization>
    </ContactPersonPrimary>
    <ContactPosition>Learning Technologies Manager</ContactPosition>
    <ContactElectronicMailAddress>nedjo@gworks.ca</ContactElectronicMailAddress>
  </ContactInformation>
</Service>

<Capability>
  <Request>
    <GetCapabilities>
      <Format>application/vnd.ogc.wms_xml</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>?"/></Get>
          <Post><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>?"/></Post>
        </HTTP>
      </DCPType>
    </GetCapabilities>
    <GetMap>
      <Format>image/png</Format>
      <Format>image/jpeg</Format>
      <Format>image/wbmp</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>?"/></Get>
          <Post><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>?"/></Post>
        </HTTP>
      </DCPType>
    </GetMap>
    <GetFeatureInfo>
      <Format>text/plain</Format>
      <Format>text/html</Format>
      <Format>application/vnd.ogc.gml</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>"/></Get>
          <Post><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="<?=$thePath?>"/></Post>
        </HTTP>
      </DCPType>
    </GetFeatureInfo>
  </Request>
  <Exception>
    <Format>application/vnd.ogc.se_xml</Format>
    <Format>application/vnd.ogc.se_inimage</Format>
    <Format>application/vnd.ogc.se_blank</Format>
  </Exception>
  <VendorSpecificCapabilities />
  <Layer>
    <Name>GWORKS</Name>
    <Title>Greater Victoria Green Map</Title>
    <SRS>EPSG:26910</SRS>
    <LatLonBoundingBox minx="-123.663" miny="48.3046" maxx="-123.256" maxy="48.7026" />
    <BoundingBox SRS="EPSG:26910"
                minx="451194" miny="5.35036e+06" maxx="480989" maxy="5.39443e+06" />
<?
    $sql="SELECT TableName FROM Layers ORDER BY LayerID DESC";
    if(!$result = mysql_query($sql,$db)){
      echo "Error in query ".$sql;
    }
    else{
      while ($row = mysql_fetch_array ($result)) {
        $TableName=$row["TableName"];
?>
    <Layer queryable="0" opaque="0" cascaded="0">
        <Name><?=$TableName?></Name>
        <Title><?=$TableName?></Title>
        <Abstract>abst</Abstract>
        <LatLonBoundingBox minx="-123.627" miny="48.3088" maxx="-123.272" maxy="48.6958" />
        <BoundingBox SRS="EPSG:26910"
                    minx="453882" miny="5.35081e+06" maxx="479839" maxy="5.39368e+06" />
    </Layer>
<?
      }
    }
?>
  </Layer>
</Capability>
</WMT_MS_Capabilities>