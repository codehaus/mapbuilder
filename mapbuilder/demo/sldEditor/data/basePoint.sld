<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<!-- a named layer is the basic building block of an sld document -->
<NamedLayer>
<Name>A Test Layer</Name>

<!-- with in a layer you have Named Styles -->
<UserStyle>
    <!-- again they have names, titles and abstracts -->
  <Name>polyshp</Name>
    <!-- FeatureTypeStyles describe how to render different features -->
    <!-- a feature type for polygons -->
    <FeatureTypeStyle>
     
       
         <Rule>
          
          <Title>tres faible</Title>
          <Abstract>different color according to the risk</Abstract>
                   
          <ogc:Filter>
           
            <ogc:PropertyIsLessThan>
              <ogc:PropertyName>risque</ogc:PropertyName>
              <ogc:Literal>0.2</ogc:Literal>
            </ogc:PropertyIsLessThan>
          </ogc:Filter>
          <MaxScaleDenominator>100000</MaxScaleDenominator>
                    <PolygonSymbolizer>
                         <Fill>
                            <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                            <CssParameter name="fill">#fdffc6</CssParameter>
                         </Fill>   
                            <Stroke>
                               <CssParameter name="stroke-width">0.5</CssParameter>
                            </Stroke>
                
                        </PolygonSymbolizer>
          
        </Rule>
        <Rule>
          
          <Title>faible</Title>
          <Abstract>different color according to the risk</Abstract>
                     
          <ogc:Filter>
          
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>risque</ogc:PropertyName>
              <ogc:LowerBoundary><ogc:Literal>0.2</ogc:Literal></ogc:LowerBoundary>
              <ogc:UpperBoundary><ogc:Literal>0.4</ogc:Literal></ogc:UpperBoundary>
            </ogc:PropertyIsBetween>

          </ogc:Filter>
            <MaxScaleDenominator>100000</MaxScaleDenominator>
                    <PolygonSymbolizer>
                         <Fill>
                            <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                            <CssParameter name="fill">#f7ff4f</CssParameter>
                         </Fill>   
                           <Stroke>
                               <CssParameter name="stroke-width">0.5</CssParameter>
                            </Stroke>
                
                    </PolygonSymbolizer>
          
        </Rule>
        <Rule>
        
          <Title>moyen</Title>
          <Abstract>different color according to the risk</Abstract>
                    
          <ogc:Filter>
          
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>risque</ogc:PropertyName>
              <ogc:LowerBoundary><ogc:Literal>0.4</ogc:Literal></ogc:LowerBoundary>
                            <ogc:UpperBoundary><ogc:Literal>0.6</ogc:Literal></ogc:UpperBoundary>
                        </ogc:PropertyIsBetween>

          </ogc:Filter>
            <MaxScaleDenominator>100000</MaxScaleDenominator>
                    <PolygonSymbolizer>
                         <Fill>
                            <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                            <CssParameter name="fill">#ffbc15</CssParameter>
                         </Fill>   
                           <Stroke>
                               <CssParameter name="stroke-width">0.5</CssParameter>
                            </Stroke>
                
                        </PolygonSymbolizer>
          
        </Rule>
        <Rule>
          
          <Title>eleve</Title>
          <Abstract>different color according to the risk</Abstract>
                   
          <ogc:Filter>
          
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>risque</ogc:PropertyName>
              <ogc:LowerBoundary><ogc:Literal>0.6</ogc:Literal></ogc:LowerBoundary>
                            <ogc:UpperBoundary><ogc:Literal>0.8</ogc:Literal></ogc:UpperBoundary>
                        </ogc:PropertyIsBetween>

          </ogc:Filter>
            <MaxScaleDenominator>100000</MaxScaleDenominator>
                    <PolygonSymbolizer>
                         <Fill>
                            <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                            <CssParameter name="fill">#f65f00</CssParameter>
                         </Fill>   
                           <Stroke>
                               <CssParameter name="stroke-width">0.5</CssParameter>
				 <CssParameter name="stroke-linejoin">mitre</CssParameter>
                            </Stroke>
                
                        </PolygonSymbolizer>
          
        </Rule>
        <Rule>
          
          <Title>tres eleve</Title>
          <Abstract>different color according to the risk</Abstract>
                    
          <ogc:Filter>
          
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>risque</ogc:PropertyName>
              <ogc:LowerBoundary><ogc:Literal>0.8</ogc:Literal></ogc:LowerBoundary>
                            <ogc:UpperBoundary><ogc:Literal>1</ogc:Literal></ogc:UpperBoundary>
                        </ogc:PropertyIsBetween>

          </ogc:Filter>
            <MaxScaleDenominator>100000</MaxScaleDenominator>
                    <PolygonSymbolizer>
                         <Fill>
                            <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                            <CssParameter name="fill">#c30500</CssParameter>
                         </Fill>   
                            <Stroke>
                               <CssParameter name="stroke-width">0.5</CssParameter>
                            </Stroke>
                
                        </PolygonSymbolizer>
          
        </Rule>
        
    </FeatureTypeStyle>
</UserStyle>
</NamedLayer>
</StyledLayerDescriptor>
