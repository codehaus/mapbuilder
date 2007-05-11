import items.*;

/*
 * @author Rick Mugridge 24/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class BuyActionsWithColumn extends fit.ColumnFixture { //COPY:ALL
	private LineItems lineItems = new LineItems(); //COPY:ALL
	public double price = 0.0; //COPY:ALL
	//COPY:ALL
	public double total() { //COPY:ALL
		lineItems.buyFor(price); //COPY:ALL
		return lineItems.totalIs(); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
