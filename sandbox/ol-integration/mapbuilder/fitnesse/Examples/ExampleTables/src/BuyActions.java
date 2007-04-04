import items.*;

/*
 * @author Rick Mugridge 8/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  * Tests correct totalling of purchased item
*/
public class BuyActions extends fit.Fixture { //COPY:ALL
	private LineItems lineItems = new LineItems(); //COPY:ALL
	private double currentPrice = 0.0; //COPY:ALL
	//COPY:ALL
	public void price(double currentPrice) { //COPY:ALL
		this.currentPrice = currentPrice; //COPY:ALL
	} //COPY:ALL
	public void buy() { //COPY:ALL
		lineItems.buyFor(currentPrice); //COPY:ALL
	} //COPY:ALL
	public double total() { //COPY:ALL
		return lineItems.totalIs(); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
