<?

print '<?xml version="1.0" encoding="UTF-8"?>';

?>

<WFS_Capabilities version="0.0.14">

   <Service>

      <Name>SimpleWebFeatureServer</Name>

      <Title>Simple Feature Server</Title>

      <Abstract>Open source simple web feature server</Abstract>

      <OnlineResource><?=$thePath?></OnlineResource>

   </Service>

   <Capability>

      <Request>

         <GetCapabilities>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </GetCapabilities>

         <DescribeFeatureType>

            <SchemaDescriptionLanguage>

               <XMLSCHEMA/>

            </SchemaDescriptionLanguage>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </DescribeFeatureType>

         <GetFeature>

            <ResultFormat>

               <GML2/>

            </ResultFormat>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </GetFeature>

         <Transaction>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </Transaction>

      </Request>

      <VendorSpecificCapabilities>

         <GetExtendedProjectDescriptor>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </GetExtendedProjectDescriptor>

         <GetStyledLayerDescriptor>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </GetStyledLayerDescriptor>

         <GetExtendedLayerDescriptor>

            <DCPType>

               <HTTP>

                  <Post onlineResource="<?=$thePath?>"/>

               </HTTP>

            </DCPType>

         </GetExtendedLayerDescriptor>

      </VendorSpecificCapabilities>

   </Capability>

<?

    $depth=1;

    writeTag("open",null,"FeatureTypeList",null,True,True);

    $depth++;

    $sql="SELECT TableName FROM Layers ORDER BY LayerID DESC";

    $result = mysql_query($sql,$db);

    while ($myrow = mysql_fetch_array ($result)) {

      $TableName=$myrow["TableName"];

      writeTag("open",null,"FeatureType",null,True,True);

      $depth++;

      writeTag("open",null,"Name",null,True,False);

      echo $TableName;

      writeTag("close",null,"Name",null,False,True);

      $depth--;

      writeTag("close",null,"FeatureType",null,True,True);

    }

    $depth--;

    writeTag("close",null,"FeatureTypeList",null,True,True);

?>

</WFS_Capabilities>



