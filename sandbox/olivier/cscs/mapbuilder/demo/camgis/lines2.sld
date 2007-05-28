<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
		xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
		xmlns="http://www.opengis.net/sld" 
		xmlns:ogc="http://www.opengis.net/ogc" 
		xmlns:xlink="http://www.w3.org/1999/xlink" 
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

	<NamedLayer>
		<Name>topp:tasmania_roads</Name>
		<UserStyle>
			<Title>A boring default style</Title>
			<Abstract>A sample style that just prints out a green line</Abstract>
			<FeatureTypeStyle>

				<!-- Rule 1 -->
				<Rule>
					<Name>Rule 1</Name>
					<Title>Green Line</Title>
					<Abstract>A green line with a 2 pixel width</Abstract>

					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">#319738</CssParameter>
							<CssParameter name="stroke-width">2</CssParameter>
						</Stroke>
					</LineSymbolizer>
				</Rule>

		    </FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>

