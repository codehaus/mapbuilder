<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:gml="http://www.opengis.net/gml" version="1.0">

  <xsl:output method="html" encoding="utf-8"/>

  <!--============================================================================-->
  <!-- Parameters passed into this xsl                                            -->
  <!--============================================================================-->
  <!-- Location of XSD, ideally these are local to reduce bandwidth -->
  <xsl:param name="feature_xsd" select='"feature.xsd"'/>
  <xsl:param name="geometry_xsd" select='"geometry.xsd"'/>

  <!-- Set TRUE to produce extra debugging html -->
  <xsl:param name="debug" select='"TRUE"'/>


  <!--============================================================================-->
  <!-- Todo:
       * Move XSD type matches and processing from element template into its own
         template.
  -->
  <!--============================================================================-->


  <!--============================================================================-->
  <!-- Main html                                                                  -->
  <!--============================================================================-->
  <xsl:template match="/">
    <html>
      <head>
        <title>Feature Entry - Community Map Builder</title>
      </head>
      <body>
        <h1>Feature Entry - Community Map Builder</h1>
        <form>
          <ul>
            <xsl:apply-templates select="/xsd:schema/xsd:element"/>
          </ul>
        </form>
      </body>
    </html>
  </xsl:template>

  <!--============================================================================-->
  <!-- element                                                                    -->
  <!--============================================================================-->
  <xsl:template match="xsd:element | element">
      <!-- ref elements rename other elements.  We don't display the name of the
      element being renamed.  Eg, display the name "gml:description" instead of
      "xsd:string".  -->
      <xsl:param name="displayName"/>

      <xsl:variable name="typeName" select="substring-after(@type,':')"/>
      <xsl:choose>
        <!-- match schema primative and derived data types. -->
        <xsl:when test="@type">
          <xsl:if test="$debug"> <b>Element: </b> </xsl:if>
          <xsl:value-of select="@name"/>
          <xsl:call-template name="schemaBaseType">
            <xsl:with-param name="type"><xsl:value-of select="@type"/></xsl:with-param>
          </xsl:call-template>
        </xsl:when>

        <xsl:when test="@ref">
          <b>Element Ref:</b> <xsl:value-of select="@ref"/> (TBD: Expand this.)<br/>
          <xsl:apply-templates select="//xsd:element[@name=@ref]"/>

          <!--
          <xsl:call-template name="schemaBaseType">
            <xsl:with-param name="type"><xsl:value-of select="@ref"/></xsl:with-param>
          </xsl:call-template>
          -->
        </xsl:when>

        <!-- @ref means this element renames another.  Display this element's name
        but use displayName="false" to ensure the renamed element is not printed. -->
        <!--
        <xsl:when test="@ref">
          <xsl:if test="$debug">
            <xsl:if test="not(contains($displayName,'false'))">
              <li>
                <b>Ref Element: </b>
                <xsl:value-of select="@ref"/>
                <xsl:if test="@type">
                  - <xsl:value-of select="@type"/>
                </xsl:if>
              </li>
            </xsl:if>
          </xsl:if>
          <xsl:variable name="ref" select="substring-after(@ref,':')"/>
          <xsl:apply-templates select="//xsd:element[@name=$ref]">
            <xsl:with-param name="displayName">false</xsl:with-param>
          </xsl:apply-templates>
        </xsl:when>
        -->

        <!-- Elements that can be expanded -->
        <xsl:otherwise>
          <xsl:if test="not(contains($displayName,'false'))">
            <xsl:if test="$debug"><b>Element to expand: </b></xsl:if>
            <xsl:value-of select="@name"/>
            <xsl:if test="@type">
              - <i><xsl:value-of select="@type"/></i>
              <xsl:variable name="typeName" select="substring-after(@type,':')"/>
              <ul>
                <xsl:apply-templates select="//xsd:schema/xsd:complexType[@name=$typeName]" mode="expandedElement"/>
                <xsl:apply-templates select="//xsd:schema/xsd:simpleType[@name=$typeName]" mode="expandedElement"/>
              </ul>
              </xsl:if>
              <xsl:apply-templates/>
            </xsl:if>
          <xsl:if test="$debug">end.<br/></xsl:if>
        </xsl:otherwise>
      </xsl:choose>
  </xsl:template>

  <!--============================================================================-->
  <!-- complexType                                                                -->
  <!--============================================================================-->
  <xsl:template match="xsd:complexType" mode="expandedElement">
    <xsl:if test="$debug">
      <b>complexType:</b> <xsl:value-of select="@name"/><br/>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:template>

  <!--============================================================================-->
  <!-- simpleType                                                                 -->
  <!--============================================================================-->
  <xsl:template match="xsd:simpleType" mode="expandedElement">
    <p>
      <b>simpleType:</b> <xsl:value-of select="@name"/>
    </p>
    <xsl:apply-templates/>
  </xsl:template>

  <!--============================================================================-->
  <!-- extension                                                                  -->
  <!--============================================================================-->
  <xsl:template match="xsd:extension">
    <b>Extension:</b>
    <xsl:call-template name="schemaBaseType">
      <xsl:with-param name="type"><xsl:value-of select="@base"/></xsl:with-param>
    </xsl:call-template>
    <xsl:apply-templates/>
  </xsl:template>

  <!--============================================================================-->
  <!-- restriction (of types)                                                     -->
  <!-- Provide simple re-casting to the parent type                               -->
  <!--============================================================================-->
  <xsl:template match="xsd:restriction">
    <xsl:variable name="type" select="substring-after(@base,':')"/>
    <xsl:if test="$debug">
      <b>Restriction of: </b>
      <xsl:copy-of select="$type"/>
    </xsl:if>
    <xsl:call-template name="schemaBaseType">
      <xsl:with-param name="type"><xsl:value-of select="@base"/></xsl:with-param>
    </xsl:call-template>
    <xsl:apply-templates/>
    <!--
    <xsl:call-template name="importedcomplextype">
      <xsl:with-param name="type"><xsl:value-of select="$type"/></xsl:with-param>
    </xsl:call-template>
    -->
  </xsl:template>

  <!--============================================================================-->
  <!-- Schema base types                                                          -->
  <!--============================================================================-->
  <xsl:template match="
      xsd:string |
      xsd:boolean |
      xsd:float |
      xsd:double |
      xsd:decimal |
      xsd:duration |
      xsd:dateTime |
      xsd:time |
      xsd:date |
      xsd:gYearMonth |
      xsd:gYear |
      xsd:gMonthDay |
      xsd:gDay |
      xsd:gMonth |
      xsd:hexBinary |
      xsd:base64Binary |
      xsd:anyURI |
      xsd:QName |
      xsd:NOTATION |
      xsd:normalizedString |
      xsd:token |
      xsd:language |
      xsd:IDREFS |
      xsd:ENTITIES |
      xsd:NMTOKEN |
      xsd:NMTOKENS |
      xsd:Name |
      xsd:NCName |
      xsd:ID |
      xsd:IDREF |
      xsd:ENTITY |
      xsd:integer |
      xsd:nonPositiveInteger |
      xsd:negativeInteger |
      xsd:long |
      xsd:int |
      xsd:short |
      xsd:byte |
      xsd:nonNegativeInteger |
      xsd:unsignedLong |
      xsd:unsignedInt |
      xsd:unsignedShort |
      xsd:unsignedByte |
      xsd:positiveInteger |
      xsd:derivationControl |
      xsd:simpleDerivationSet">
    - <i><xsl:value-of select="$type"/></i>
    <input type="text" maxlength="20" name="text"/>
  </xsl:template>

  <!--============================================================================-->
  <!-- schemaBaseType                                                             -->
  <!--============================================================================-->
  <xsl:template name="schemaBaseType">
    <xsl:param name="type"/>

    <xsl:variable name="typeName" select="substring-after($type,':')"/>
    <xsl:variable name="nameSpace" select="substring-before($type,':')"/>

    - <i><xsl:value-of select="$type"/></i>
    <ul>
      <xsl:apply-templates select="document($geometry_xsd)/xsd:schema/*[@name=$typeName]"/>
      <xsl:apply-templates select="document($feature_xsd)/xsd:schema/*[@name=$typeName]"/>
      <xsl:apply-templates select="/xsd:schema/*[@name=$typeName]"/>
    </ul>
    <!--
    <xsl:choose>
      <xsl:when test="contains($nameSpace,'gml')">
      </xsl:when>
      <xsl:otherwise>
        <input type="text" maxlength="20" name="text"/>
      </xsl:otherwise>
    </xsl:choose>
    -->
  </xsl:template>

  <!--============================================================================-->
  <!-- documentation                                                              -->
  <!-- Don't print the embedded docs                                              -->
  <!--============================================================================-->
  <xsl:template match="xsd:documentation"/>

  <!--============================================================================-->
  <!-- Apply templates which match "match" from main schema and imported schemas  -->
  <!--============================================================================-->
  <!--
  <xsl:template name="importedcomplextype">
    <xsl:param name="type"/>

    <xsl:if test="//xsd:import | xsd:include">
      <xsl:for-each select="//xsd:import | //xsd:include">
        <xsl:if test="document(@schemaLocation)/xsd:schema/xsd:complexType[@name=$type]">
          <b>Imported Schema:</b> <xsl:value-of select="@schemaLocation"/>
          from namespace <xsl:value-of select="@namespace"/><br/>
          <xsl:apply-templates select="document(@schemaLocation)/xsd:schema/xsd:complexType[@name=$type]"/>
          end Imported schemata.
        </xsl:if>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
  -->

</xsl:stylesheet>

