/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  *
*/
public class CalculateDiscount extends fit.ColumnFixture { //COPY:ALL
	public double amount; //COPY:ALL
	private Discount application = new Discount(); //COPY:ALL
	//COPY:ALL
	public double discount() { //COPY:ALL
		return application.getDiscount(amount); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
