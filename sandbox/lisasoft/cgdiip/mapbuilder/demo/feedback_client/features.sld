<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<!--
    $Id: features.sld 2957 2007-07-09 12:21:10Z steven $
  -->
	<NamedLayer>
		<Name>featureCollection</Name>
		<UserStyle>
			<Name>default</Name>
			<IsDefault>true</IsDefault>
			<FeatureTypeStyle>
				<Rule>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<Fill>
									<CssParameter name="fill">#FF00FF</CssParameter>
									<CssParameter name="fill-opacity">0.8</CssParameter>
								</Fill>
								<Stroke>
									<CssParameter name="stroke">black</CssParameter>
									<CssParameter name="stroke-opacity">1</CssParameter>
									<CssParameter name="stroke-width">2</CssParameter>
								</Stroke>
							</Mark>
							<Size>4</Size>
						</Graphic>
					</PointSymbolizer>
					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">#FF0000</CssParameter>
							<CssParameter name="stroke-opacity">1</CssParameter>
							<CssParameter name="stroke-width">3</CssParameter>
						</Stroke>
					</LineSymbolizer>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">blue</CssParameter>
							<CssParameter name="fill-opacity">0.6</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">blue</CssParameter>
							<CssParameter name="stroke-opacity">1</CssParameter>
							<CssParameter name="stroke-width">1</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
		<UserStyle>
			<Name>selected</Name>
			<FeatureTypeStyle>
				<Rule>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<Fill>
									<CssParameter name="fill">yellow</CssParameter>
									<CssParameter name="fill-opacity">0.9</CssParameter>
								</Fill>
								<Stroke>
									<CssParameter name="stroke">red</CssParameter>
									<CssParameter name="stroke-opacity">1</CssParameter>
									<CssParameter name="stroke-width">2</CssParameter>
								</Stroke>
							</Mark>
							<Size>4</Size>
						</Graphic>
					</PointSymbolizer>
					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">yellow</CssParameter>
							<CssParameter name="stroke-opacity">1</CssParameter>
							<CssParameter name="stroke-width">3</CssParameter>
						</Stroke>
					</LineSymbolizer>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFFF00</CssParameter>
							<CssParameter name="fill-opacity">0.9</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">#FF0066</CssParameter>
							<CssParameter name="stroke-opacity">1</CssParameter>
							<CssParameter name="stroke-width">2</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
