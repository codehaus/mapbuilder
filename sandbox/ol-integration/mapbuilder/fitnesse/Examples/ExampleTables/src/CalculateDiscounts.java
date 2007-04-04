/*
 * @author Rick Mugridge 24/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  *
*/
public class CalculateDiscounts extends fit.ColumnFixture { //COPY:ALL
	public String futureValue; //COPY:ALL
	public double owing, purchase; //COPY:ALL
	//COPY:ALL
	public double discount() { //COPY:ALL
		return DiscountGroupsEntry.getApp().discount( //COPY:ALL
		             futureValue,owing,purchase); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
