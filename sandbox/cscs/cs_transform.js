// Monday, 06 March, 2006

var SRS_WGS84_SEMIMAJOR=6378137.0;  // only used in grid shift transforms

/****************************************************************/
// cs_transform()
//  main entry point
//  source coordinate system definition,
//  destination coordinate system definition,
//  point to transform, may be geodetic (long, lat)
//    or projected Cartesian (x,y)
function cs_transform(srcdefn, dstdefn, point) {
  pj_errno = 0;

    // Transform source points to long/lat, if they aren't already.
  if( !srcdefn.is_latlong ) {
    alert("projected input coordinates not implemented yet");
    return 1;
  } else {            // else convert degrees to radians
    point.x *=D2R;
    point.y *=D2R;
  }

    // Adjust for the prime meridian if necessary
    // assumes that PM is in radians
  if( srcdefn.from_greenwich) {
  // if( srcdefn.from_greenwich != 0.0 ) {
      point.x += srcdefn.from_greenwich;
  }

    // Convert datums if needed, and possible.
  if( cs_datum_transform( srcdefn, dstdefn, point) != 0 )
    return pj_errno;

    // Adjust for the prime meridian if necessary
    // assumes that PM is in radians
  //if( dstdefn.from_greenwich != 0.0 ) {
  if( dstdefn.from_greenwich ) {
      point.x -= dstdefn.from_greenwich;
  }

  if( dstdefn.is_latlong ) // convert radians to decimal degrees
  {
    point.x *=R2D;
    point.y *=R2D;
  } else  {               // else project
    //alert("output projection not implemented yet." );
    //return 2;
    dstdefn.Forward(dstdefn, point);
  }

} // cs_transform()

/****************************************************************/
// cs_compare_datums()
//   Returns 1 (TRUE) if the two datums match, otherwise 0 (FALSE).
function cs_compare_datums( srcdefn, dstdefn )
{
  if( srcdefn.datum_type != dstdefn.datum_type )
  {
    return 0;
  }
  else if( srcdefn.a != dstdefn.a
           || Math.abs(srcdefn.es - dstdefn.es) > 0.000000000050 )
  {
    /* the tolerence for es is to ensure that GRS80 and WGS84 are
       considered identical */
    return 0;
  }
  else if( srcdefn.datum_type == PJD_3PARAM )
  {
    return (srcdefn.datum_params[0] == dstdefn.datum_params[0]
            && srcdefn.datum_params[1] == dstdefn.datum_params[1]
            && srcdefn.datum_params[2] == dstdefn.datum_params[2]);
  }
  else if( srcdefn.datum_type == PJD_7PARAM )
  {
    return (srcdefn.datum_params[0] == dstdefn.datum_params[0]
            && srcdefn.datum_params[1] == dstdefn.datum_params[1]
            && srcdefn.datum_params[2] == dstdefn.datum_params[2]
            && srcdefn.datum_params[3] == dstdefn.datum_params[3]
            && srcdefn.datum_params[4] == dstdefn.datum_params[4]
            && srcdefn.datum_params[5] == dstdefn.datum_params[5]
            && srcdefn.datum_params[6] == dstdefn.datum_params[6]);
  }
  else if( srcdefn.datum_type == PJD_GRIDSHIFT )
  {
    return strcmp( pj_param(srcdefn.params,"snadgrids").s,
                   pj_param(dstdefn.params,"snadgrids").s ) == 0;
  }
  else
    return 1;
} // cs_compare_datums()


/****************************************************************/
// pj_geocentic_to_wgs84(defn, p )
//    defn = coordinate system definition,
//  p = point to transform in geocentric coordinates (x,y,z)
function cs_geocentric_to_wgs84( defn, p ) {

  if( defn.datum_type == PJD_3PARAM )
  {
    // if( x[io] == HUGE_VAL )
    //    continue;
    p.x += defn.datum_params[0];
    p.y += defn.datum_params[1];
    p.z += defn.datum_params[2];

  }
  else  // if( defn.datum_type == PJD_7PARAM )
  {
    var Dx_BF =defn.datum_params[0];
    var Dy_BF =defn.datum_params[1];
    var Dz_BF =defn.datum_params[2];
    var Rx_BF =defn.datum_params[3];
    var Ry_BF =defn.datum_params[4];
    var Rz_BF =defn.datum_params[5];
    var M_BF  =defn.datum_params[6];
    // if( x[io] == HUGE_VAL )
    //    continue;
    var x_out = M_BF*(       p.x - Rz_BF*p.y + Ry_BF*p.z) + Dx_BF;
    var y_out = M_BF*( Rz_BF*p.x +       p.y - Rx_BF*p.z) + Dy_BF;
    var z_out = M_BF*(-Ry_BF*p.x + Rx_BF*p.y +       p.z) + Dz_BF;
    p.x = x_out;
    p.y = y_out;
    p.z = z_out;
  }
} // cs_geocentric_to_wgs84

/****************************************************************/
// pj_geocentic_from_wgs84()
//  coordinate system definition,
//  point to transform in geocentric coordinates (x,y,z)
function cs_geocentric_from_wgs84( defn, p ) {

  if( defn.datum_type == PJD_3PARAM )
  {
    //if( x[io] == HUGE_VAL )
    //    continue;
    p.x -= defn.datum_params[0];
    p.y -= defn.datum_params[1];
    p.z -= defn.datum_params[2];

  }
  else // if( defn.datum_type == PJD_7PARAM )
  {
    var Dx_BF =defn.datum_params[0];
    var Dy_BF =defn.datum_params[1];
    var Dz_BF =defn.datum_params[2];
    var Rx_BF =defn.datum_params[3];
    var Ry_BF =defn.datum_params[4];
    var Rz_BF =defn.datum_params[5];
    var M_BF  =defn.datum_params[6];
    var x_tmp = (p.x - Dx_BF) / M_BF;
    var y_tmp = (p.y - Dy_BF) / M_BF;
    var z_tmp = (p.z - Dz_BF) / M_BF;
    //if( x[io] == HUGE_VAL )
    //    continue;

    p.x =        x_tmp + Rz_BF*y_tmp - Ry_BF*z_tmp;
    p.y = -Rz_BF*x_tmp +       y_tmp + Rx_BF*z_tmp;
    p.z =  Ry_BF*x_tmp - Rx_BF*y_tmp +       z_tmp;
  }
} //cs_geocentric_from_wgs84()

/****************************************************************/
// cs_datum_transform()
//  source coordinate system definition,
//  destination coordinate system definition,
//  point to transform in geodetic coordinates (long, lat, height)
function cs_datum_transform( srcdefn, dstdefn, point )
{
  pj_errno = 0;

    // Short cut if the datums are identical.
  if( cs_compare_datums( srcdefn, dstdefn ) )
      return 0;

// #define CHECK_RETURN {if( pj_errno != 0 ) { if( z_is_temp ) pj_dalloc(z); return pj_errno; }}

/* -------------------------------------------------------------------- */
/*  If this datum requires grid shifts, then apply it to geodetic   */
/*      coordinates.                                                    */
/* -------------------------------------------------------------------- */
    if( srcdefn.datum_type == PJD_GRIDSHIFT )
    {
      alert("ERROR: Grid shift transformations are not implemented yet.");
      /*
        pj_apply_gridshift( pj_param(srcdefn.params,"snadgrids").s, 0,
                            point_count, point_offset, x, y, z );
        CHECK_RETURN;

        src_a = SRS_WGS84_SEMIMAJOR;
        src_es = 0.006694379990;
      */
    }

    if( dstdefn.datum_type == PJD_GRIDSHIFT )
    {
      alert("ERROR: Grid shift transformations are not implemented yet.");
      /*
        dst_a = ;
        dst_es = 0.006694379990;
      */
    }

      // Do we need to go through geocentric coordinates?
    if( srcdefn.es != dstdefn.es || srcdefn.a != dstdefn.a
        || srcdefn.datum_type == PJD_3PARAM
        || srcdefn.datum_type == PJD_7PARAM
        || dstdefn.datum_type == PJD_3PARAM
        || dstdefn.datum_type == PJD_7PARAM)
    {

        //Convert to geocentric coordinates.
      cs_geodetic_to_geocentric( srcdefn, point );
      // CHECK_RETURN;

/* -------------------------------------------------------------------- */
/*      Convert between datums.                                         */
/* -------------------------------------------------------------------- */
        if( srcdefn.datum_type == PJD_3PARAM
            || srcdefn.datum_type == PJD_7PARAM )
        {
            cs_geocentric_to_wgs84( srcdefn, point);
            //CHECK_RETURN;
        }

        if( dstdefn.datum_type == PJD_3PARAM
            || dstdefn.datum_type == PJD_7PARAM )
        {
            cs_geocentric_from_wgs84( dstdefn, point);
            // CHECK_RETURN;
        }

/* -------------------------------------------------------------------- */
/*      Convert back to geodetic coordinates.                           */
/* -------------------------------------------------------------------- */
        cs_geocentric_to_geodetic( dstdefn, point );
        // CHECK_RETURN;
    }

/* -------------------------------------------------------------------- */
/*      Apply grid shift to destination if required.                    */
/* -------------------------------------------------------------------- */
  if( dstdefn.datum_type == PJD_GRIDSHIFT )
  {
    alert("ERROR: Grid shift transformations are not implemented yet.");
    // pj_apply_gridshift( pj_param(dstdefn.params,"snadgrids").s, 1, point);
    // CHECK_RETURN;
  }
  return 0;
} // cs_datum_transform
