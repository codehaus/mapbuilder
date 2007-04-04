package items;
/*
 * @author Rick Mugridge 8/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  *
*/
public class LineItems { //COPY:ALL
	private double total = 0.0;//COPY:ALL
	//	COPY:ALL
	public void buyFor(double price) { //COPY:ALL
		total += price;//COPY:ALL
	} //COPY:ALL
	public double totalIs() { //COPY:ALL
		return total;//COPY:ALL
	} //COPY:ALL
} //COPY:ALL
