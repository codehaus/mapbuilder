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
public class DiscountGroupsEntry extends fit.ColumnFixture { //COPY:ALL
	public double maxBalance, minPurchase; //COPY:ALL
	public String futureValue, description = ""; //COPY:ALL
	public double discountPercent; //COPY:ALL
	//COPY:ALL
	private static DiscountApplication APP; //COPY:ALL
	//COPY:ALL
	public boolean add() { //COPY:ALL
		getApp().addDiscountGroup(futureValue,maxBalance, //COPY:ALL
		                     minPurchase,discountPercent); //COPY:ALL
		return true; //COPY:ALL
	} //COPY:ALL
	public static DiscountApplication getApp() { //COPY:ALL
		if (APP == null) //COPY:ALL
			APP = new DiscountApplication(); //COPY:ALL
		return APP; //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
