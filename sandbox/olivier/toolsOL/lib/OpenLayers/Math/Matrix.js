/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/*
 * This class comes from DojoToolkit -> licence agreements:
 *
 * some of this code is based on
 *
 * http://www.mkaz.com/math/MatrixCalculator.java
 * (published under a BSD Open Source License)
 *
 * the rest is from my vague memory of matricies in school [cal]
 *
 * the copying of arguments is a little excessive, and could be trimmed back in
 * the case where a function doesn't modify them at all (but some do!)
 *
 * 2006-06-25: Some enhancements submitted by Erel Segal:
 * addition: a tolerance constant for determinant calculations.
 * performance fix: removed unnecessary argument copying.
 * addition: function "product" for multiplying more than 2 matrices
 * addition: function "sum" for adding any number of matrices
 * bug fix: inversion of a 1x1 Matrix without using the adjoint
 * performance fixes: upperTriangle
 * addition: argument "value" to function create, to initialize the Matrix with a custom val
 * addition: functions "ones" and "zeros" - like Matlab[TM] functions with the same name.
 * addition: function "identity" for creating an identity Matrix of a given size.
 * addition: argument "decimal_points" to function format
 * bug fix: adjoint of a 0-size Matrix
 * performance fixes: adjoint
 */

/**
 * @class
 */
OpenLayers.Math.Matrix = Array;

OpenLayers.Math.Matrix.iDF = 0;

// Erel: values lower than this value are considered zero (in detereminant calculations).
// It is analogous to Maltab[TM]'s "eps".
OpenLayers.Math.Matrix.ALMOST_ZERO = 1e-10;
OpenLayers.Math.Matrix.multiply = function(a, b) {
	var ay = a.length;
	var ax = a[0].length;
	var by = b.length;
	var bx = b[0].length;

	if (ax != by) {
		alert("Can't multiply matricies of sizes "+ax+","+ay+" and "+bx+","+by);
		return [[0]];
	}

	var c = [];
	for(var k=0; k<ay; k++) {
		c[k] = [];
		for(var i=0; i<bx; i++) {
			c[k][i] = 0;
			for(var m=0; m<ax; m++) {
				c[k][i] += a[k][m]*b[m][i];
			}
		}
	}
	return c;
}

// Erel: added a "product" function to calculate product of more than 2 matrices:
OpenLayers.Math.Matrix.product = function() {
	if (arguments.length==0) {
		alert ("can't multiply 0 matrices!");
		return 1;
	}
	var result = arguments[0];
	for (var i=1; i<arguments.length; i++) {
		result = OpenLayers.Math.Matrix.multiply(result,arguments[i]);
	}
	return result;
}

// Erel: added a "sum" function to calculate sum of more than 2 matrices:
OpenLayers.Math.Matrix.sum = function() {
	if (arguments.length==0) {
		alert ("can't sum 0 matrices!");
		return 0;
	}
	var result = OpenLayers.Math.Matrix.copy(arguments[0]);
	var rows = result.length;
	if (rows==0) {
		alert ("can't deal with matrices of 0 rows!");
		return 0;
	}
	var cols = result[0].length;
	if (cols==0) {
		alert ("can't deal with matrices of 0 cols!");
		return 0;
	}
	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i];
		if (arg.length!=rows || arg[0].length!=cols) {
			alert ("can't add matrices of different dimensions: first dimensions were " + rows + "x" + cols + ", current dimensions are "+arg.length + "x" + arg[0].length);
			return 0;
		}

		// The actual addition:
		for (var r=0; r<rows; r++) {
			for (var c=0; c<cols; c++) {
				result[r][c] += arg[r][c];
			}
		}
	}
	return result;
}


OpenLayers.Math.Matrix.inverse = function(a) {
	// Erel: added special case: inverse of a 1x1 Matrix can't be calculated by adjoint
	if (a.length==1 && a[0].length==1) {
		return [[ 1 / a[0][0] ]];
	}

	// Formula used to Calculate Inverse:
	// inv(A) = 1/det(A) * adj(A)

	var tms = a.length;
	var m = OpenLayers.Math.Matrix.create(tms, tms);
	var mm = OpenLayers.Math.Matrix.adjoint(a);
	var det = OpenLayers.Math.Matrix.determinant(a);
	var dd = 0;

	if(det == 0) {
		alert("Determinant Equals 0, Not Invertible.");
		return [[0]];
	}else{
		dd = 1 / det;
	}

	for (var i = 0; i < tms; i++) {
		for (var j = 0; j < tms; j++) {
			m[i][j] = dd * mm[i][j];
		}
	}
	return m;
}

OpenLayers.Math.Matrix.determinant = function(a) {
	if (a.length != a[0].length) {
		alert("Can't calculate the determiant of a non-squre Matrix!");
		return 0;
	}

	var tms = a.length;
	var det = 1;
	var b = OpenLayers.Math.Matrix.upperTriangle(a);

	for (var i=0; i < tms; i++) {
		var bii = b[i][i];
		if (Math.abs(bii) < OpenLayers.Math.Matrix.ALMOST_ZERO) {
			return 0;
		}
		det *= bii;
	}
	det = det * OpenLayers.Math.Matrix.iDF;
	return det;
}

OpenLayers.Math.Matrix.upperTriangle = function(m) {
	m = OpenLayers.Math.Matrix.copy(m);     // Copy m, because m is changed!
	var f1 = 0;
	var temp = 0;
	var tms = m.length;
	var v = 1;

	//Erel: why use a global variable and not a local variable?
	OpenLayers.Math.Matrix.iDF = 1;

	for (var col = 0; col < tms - 1; col++) {
		if (typeof m[col][col] != 'number') {
			alert("non-numeric entry found in a numeric Matrix: m["+col+"]["+col+"]="+m[col][col]);
		}
		v = 1;
		var stop_loop = 0;

		// check if there is a 0 in diagonal
		while ((m[col][col] == 0) && !stop_loop) {
			// if so,  switch rows until there is no 0 in diagonal:
			if (col + v >= tms) {
				// check if switched all rows
				OpenLayers.Math.Matrix.iDF = 0;
				stop_loop = 1;
			}else{
				for (var r = 0; r < tms; r++) {
					temp = m[col][r];
					m[col][r] = m[col + v][r]; // switch rows
					m[col + v][r] = temp;
				}
				v++; // count row switchs
				OpenLayers.Math.Matrix.iDF *= -1; // each switch changes determinant factor
			}
		}

		// loop over lower-right triangle (where row>col):
		// for each row, make m[row][col] = 0 by linear operations that don't change the determinant:
		for (var row = col + 1; row < tms; row++) {
			if (typeof m[row][col] != 'number') {
				alert("non-numeric entry found in a numeric Matrix: m["+row+"]["+col+"]="+m[row][col]);
			}
			if (typeof m[col][row] != 'number') {
				alert("non-numeric entry found in a numeric Matrix: m["+col+"]["+row+"]="+m[col][row]);
			}
			if (m[col][col] != 0) {
				var f1 = (-1) * m[row][col] / m[col][col];
				// this should make m[row][col] zero:
				// 	m[row] += f1 * m[col];
				for (var i = col; i < tms; i++) {
					m[row][i] = f1 * m[col][i] + m[row][i];
				}
			}
		}
	}
	return m;
}

// Erel: added parameter "value" - a custom default value to fill the Matrix with.
OpenLayers.Math.Matrix.create = function(a, b, value) {
	if(!value) {
		value = 0;
	}
	var m = [];
	for(var i=0; i<b; i++) {
		m[i] = [];
		for(var j=0; j<a; j++) {
			m[i][j] = value;
		}
	}
	return m;
}

// Erel implement Matlab[TM] functions "ones" and "zeros"
OpenLayers.Math.Matrix.ones = function(a,b) {
	return OpenLayers.Math.Matrix.create(a,b,1);
}
OpenLayers.Math.Matrix.zeros = function(a,b) {
	return OpenLayers.Math.Matrix.create(a,b,0);
}

// Erel: added function that returns identity Matrix.
//	size = number of rows and cols in the Matrix.
//	scale = an optional value to multiply the Matrix by (default is 1).
OpenLayers.Math.Matrix.identity = function(size, scale) {
	if (!scale) {
		scale = 1;
	}
	var m = [];
	for(var i=0; i<size; i++) {
		m[i] = [];
		for(var j=0; j<size; j++) {
			m[i][j] = (i==j? scale: 0);
		}
	}
	return m;
}

OpenLayers.Math.Matrix.adjoint = function(a) {
	var tms = a.length;

	// Erel: added "<=" to catch zero-size Matrix
	if (tms <= 1) {
		alert("Can't find the adjoint of a Matrix with a dimension less than 2");
		return [[0]];
	}

	if (a.length != a[0].length) {
		alert("Can't find the adjoint of a non-square Matrix");
		return [[0]];
	}

	var m = OpenLayers.Math.Matrix.create(tms, tms);

	var ii = 0;
	var jj = 0;
	var ia = 0;
	var ja = 0;
	var det = 0;
	var ap = OpenLayers.Math.Matrix.create(tms-1, tms-1);

	for (var i = 0; i < tms; i++) {
		for (var j = 0; j < tms; j++) {
			ia = 0;
			for (ii = 0; ii < tms; ii++) {   // create a temporary Matrix for determinant calc
				if (ii==i) {
					continue;       // skip current row
				}
				ja = 0;
				for (jj = 0; jj < tms; jj++) {
					if (jj==j) {
						continue;       // skip current col
					}
					ap[ia][ja] = a[ii][jj];
					ja++;
				}
				ia++;
			}

			det = OpenLayers.Math.Matrix.determinant(ap);
			m[i][j] = Math.pow(-1 , (i + j)) * det;
		}
	}
	m = OpenLayers.Math.Matrix.transpose(m);
	return m;
}

OpenLayers.Math.Matrix.transpose = function(a) {
	var m = OpenLayers.Math.Matrix.create(a.length, a[0].length);
	for (var i = 0; i < a.length; i++) {
		for (var j = 0; j < a[i].length; j++) {
			m[j][i] = a[i][j];
		}
	}
	return m;
}

// Erel: added decimal_points argument
OpenLayers.Math.Matrix.format = function(a, decimal_points) {
	if (arguments.length<=1) {
		decimal_points = 5;
	}

	function format_int(x, dp) {
		var fac = Math.pow(10 , dp);
		var a = Math.round(x*fac)/fac;
		var b = a.toString();
		if (b.charAt(0) != '-') { b = ' ' + b;}
		var has_dp = 0;
		for(var i=1; i<b.length; i++) {
			if (b.charAt(i) == '.') { has_dp = 1; }
		}
		if (!has_dp) { b += '.'; }
		while(b.length < dp+3) { b += '0'; }
		return b;
	}

	var ya = a.length;
	var xa = ya>0? a[0].length: 0;
	var buffer = '';
	for (var y=0; y<ya; y++) {
		buffer += '| ';
		for (var x=0; x<xa; x++) {
			buffer += format_int(a[y][x], decimal_points) + ' ';
		}
		buffer += '|\n';
	}
	return buffer;
}

OpenLayers.Math.Matrix.copy = function(a) {
	var ya = a.length;
	var xa = a[0].length;
	var m = OpenLayers.Math.Matrix.create(xa, ya);
	for (var y=0; y<ya; y++) {
		for (var x=0; x<xa; x++) {
			m[y][x] = a[y][x];
		}
	}
	return m;
}

OpenLayers.Math.Matrix.scale = function(k, a) {
	a = OpenLayers.Math.Matrix.copy(a);
	var ya = a.length;
	var xa = a[0].length;

	for (var y=0; y<ya; y++) {
		for (var x=0; x<xa; x++) {
			a[y][x] *= k;
		}
	}
	return a;
}
