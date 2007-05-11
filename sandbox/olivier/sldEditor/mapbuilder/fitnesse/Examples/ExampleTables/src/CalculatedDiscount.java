/*
 * @author Rick Mugridge 17/07/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class CalculatedDiscount extends fitlibrary.CalculateFixture{
	private Discount application = new Discount(); //COPY:ALL
	//COPY:ALL
	public double discountDollar(double amount) { //COPY:ALL
		return application.getDiscount(amount); //COPY:ALL
	} //COPY:ALL
}
