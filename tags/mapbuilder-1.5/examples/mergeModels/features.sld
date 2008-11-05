<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<!--
    $Id$
  -->
	<NamedLayer>
		<Name>gmlRenderer</Name>
		<UserStyle>
			<Name>defaultScenario</Name>
			<IsDefault>true</IsDefault>
			<FeatureTypeStyle>
				<Rule>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<Fill>
									<CssParameter name="fill">#AA0000</CssParameter>
									<CssParameter name="fill-opacity">0.5</CssParameter>
								</Fill>
								<Stroke>
									<CssParameter name="stroke">black</CssParameter>
									<CssParameter name="stroke-opacity">1</CssParameter>
									<CssParameter name="stroke-width">2</CssParameter>
								</Stroke>
							</Mark>
							<Size>7</Size>
						</Graphic>
					</PointSymbolizer>
					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">#AA0000</CssParameter>
							<CssParameter name="stroke-opacity">0.5</CssParameter>
							<CssParameter name="stroke-width">6</CssParameter>
						</Stroke>
					</LineSymbolizer>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#AA0000</CssParameter>
							<CssParameter name="fill-opacity">0.5</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">black</CssParameter>
							<CssParameter name="stroke-opacity">1</CssParameter>
							<CssParameter name="stroke-width">3</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
		<UserStyle>
			<Name>selectedScenario</Name>
			<FeatureTypeStyle>
				<Rule>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<Fill>
									<CssParameter name="fill">#FF2200</CssParameter>
									<CssParameter name="fill-opacity">0.8</CssParameter>
								</Fill>
								<Stroke>
									<CssParameter name="stroke">#FF4400</CssParameter>
									<CssParameter name="stroke-opacity">0.8</CssParameter>
									<CssParameter name="stroke-width">3</CssParameter>
								</Stroke>
							</Mark>
							<Size>7</Size>
						</Graphic>
					</PointSymbolizer>
					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">#FF2200</CssParameter>
							<CssParameter name="stroke-opacity">0.8</CssParameter>
							<CssParameter name="stroke-width">7</CssParameter>
						</Stroke>
					</LineSymbolizer>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FF2200</CssParameter>
							<CssParameter name="fill-opacity">0.8</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">#FF2200</CssParameter>
							<CssParameter name="stroke-opacity">0.8</CssParameter>
							<CssParameter name="stroke-width">7</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
		<UserStyle>
			<Name>defaultNews</Name>
			<FeatureTypeStyle>
				<Rule>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<Fill>
									<CssParameter name="fill">#0000AA</CssParameter>
									<CssParameter name="fill-opacity">0.5</CssParameter>
								</Fill>
								<Stroke>
									<CssParameter name="stroke">red</CssParameter>
									<CssParameter name="stroke-opacity">1</CssParameter>
									<CssParameter name="stroke-width">2</CssParameter>
								</Stroke>
							</Mark>
							<Size>7</Size>
						</Graphic>
					</PointSymbolizer>
					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">#0000AA</CssParameter>
							<CssParameter name="stroke-opacity">0.5</CssParameter>
							<CssParameter name="stroke-width">6</CssParameter>
						</Stroke>
					</LineSymbolizer>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#0000AA</CssParameter>
							<CssParameter name="fill-opacity">0.5</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">red</CssParameter>
							<CssParameter name="stroke-opacity">1</CssParameter>
							<CssParameter name="stroke-width">3</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
		<UserStyle>
			<Name>selectedNews</Name>
			<FeatureTypeStyle>
				<Rule>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<Fill>
									<CssParameter name="fill">#FF2200</CssParameter>
									<CssParameter name="fill-opacity">0.8</CssParameter>
								</Fill>
								<Stroke>
									<CssParameter name="stroke">#FF2200</CssParameter>
									<CssParameter name="stroke-opacity">0.8</CssParameter>
									<CssParameter name="stroke-width">3</CssParameter>
								</Stroke>
							</Mark>
							<Size>7</Size>
						</Graphic>
					</PointSymbolizer>
					<LineSymbolizer>
						<Stroke>
							<CssParameter name="stroke">#FF2200</CssParameter>
							<CssParameter name="stroke-opacity">0.8</CssParameter>
							<CssParameter name="stroke-width">7</CssParameter>
						</Stroke>
					</LineSymbolizer>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FF2200</CssParameter>
							<CssParameter name="fill-opacity">0.8</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">#FF2200</CssParameter>
							<CssParameter name="stroke-opacity">0.8</CssParameter>
							<CssParameter name="stroke-width">7</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
