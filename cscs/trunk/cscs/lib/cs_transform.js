// 06 March, 2006

var SRS_WGS84_SEMIMAJOR=6378137.0;  // only used in grid shift transforms

/** cs_transform()
  main entry point
  source coordinate system definition,
  destination coordinate system definition,
  point to transform, may be geodetic (long, lat)
    or projected Cartesian (x,y)
*/
function cs_transform(srcdefn, dstdefn, point) {
  pj_errno = 0;

    // Transform source points to long/lat, if they aren't already.
  if( srcdefn.proj=="longlat") {
    point.x *=D2R;  // convert degrees to radians
    point.y *=D2R;
  } else {
    if (srcdefn.to_meter) {
      point.x *= srcdefn.to_meter;
      point.y *= srcdefn.to_meter;
    }
    srcdefn.Inverse(point); // Convert Cartesian to longlat
  }

    // Adjust for the prime meridian if necessary
  if( srcdefn.from_greenwich) { point.x += srcdefn.from_greenwich; }

    // Convert datums if needed, and if possible.
  if( cs_datum_transform( srcdefn, dstdefn, point) != 0 )
    return pj_errno;

    // Adjust for the prime meridian if necessary
  if( dstdefn.from_greenwich ) { point.x -= dstdefn.from_greenwich; }

  if( dstdefn.proj=="longlat" )
  {             // convert radians to decimal degrees
    point.x *=R2D;
    point.y *=R2D;
  } else  {               // else project
    dstdefn.Forward(point);
    if (dstdefn.to_meter) {
      point.x /= dstdefn.to_meter;
      point.y /= dstdefn.to_meter;
    }
  }
} // cs_transform()





/** cs_datum_transform()
  source coordinate system definition,
  destination coordinate system definition,
  point to transform in geodetic coordinates (long, lat, height)
*/
function cs_datum_transform( srcdefn, dstdefn, point )
{

    // Short cut if the datums are identical.
  if( cs_compare_datums( srcdefn, dstdefn ) )
      return 0; // in this case, zero is sucess,
                // whereas cs_compare_datums returns 1 to indicate TRUE
                // confusing, should fix this

// #define CHECK_RETURN {if( pj_errno != 0 ) { if( z_is_temp ) pj_dalloc(z); return pj_errno; }}


    // If this datum requires grid shifts, then apply it to geodetic coordinates.
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
//  if( srcdefn.es != dstdefn.es || srcdefn.a != dstdefn.a || // RWG - removed ellipse comparison so
    if( srcdefn.datum_type == PJD_3PARAM                      // that longlat CSs do not have to have
        || srcdefn.datum_type == PJD_7PARAM                   // an ellipsoid, also should put it a
        || dstdefn.datum_type == PJD_3PARAM                   // tolerance for es if used.
        || dstdefn.datum_type == PJD_7PARAM)
    {

      // Convert to geocentric coordinates.
      cs_geodetic_to_geocentric( srcdefn, point );
      // CHECK_RETURN;

      // Convert between datums
      if( srcdefn.datum_type == PJD_3PARAM || srcdefn.datum_type == PJD_7PARAM )
      {
        cs_geocentric_to_wgs84( srcdefn, point);
        // CHECK_RETURN;
      }

      if( dstdefn.datum_type == PJD_3PARAM || dstdefn.datum_type == PJD_7PARAM )
      {
        cs_geocentric_from_wgs84( dstdefn, point);
        // CHECK_RETURN;
      }

      // Convert back to geodetic coordinates
      cs_geocentric_to_geodetic( dstdefn, point );
        // CHECK_RETURN;
    }


  // Apply grid shift to destination if required
  if( dstdefn.datum_type == PJD_GRIDSHIFT )
  {
    alert("ERROR: Grid shift transformations are not implemented yet.");
    // pj_apply_gridshift( pj_param(dstdefn.params,"snadgrids").s, 1, point);
    // CHECK_RETURN;
  }
  return 0;
} // cs_datum_transform


/****************************************************************/
// cs_compare_datums()
//   Returns 1 (TRUE) if the two datums match, otherwise 0 (FALSE).
function cs_compare_datums( srcdefn, dstdefn )
{
  if( srcdefn.datum_type != dstdefn.datum_type )
  {
    return 0; // false, datums are not equal
  }
  /*  RWG - took this out so that ellipse is not required for longlat CSs
  else if( srcdefn.a != dstdefn.a
           || Math.abs(srcdefn.es - dstdefn.es) > 0.000000000050 )
  {
    // the tolerence for es is to ensure that GRS80 and WGS84
    // are considered identical
    return 0;
  }
  */
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
    return 1; // true, datums are equal
} // cs_compare_datums()




