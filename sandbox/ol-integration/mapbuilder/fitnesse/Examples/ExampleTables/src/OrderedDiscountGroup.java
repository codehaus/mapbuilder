/*
 * @author Rick Mugridge 1/05/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class OrderedDiscountGroup { //COPY:ALL
	public int order; //COPY:ALL
	public double maxOwing, minPurchase; //COPY:ALL
	public String futureValue; //COPY:ALL
	public double discountPercent; //COPY:ALL
	 //COPY:ALL
	public OrderedDiscountGroup(int order, String futureValue, //COPY:ALL
	                      double maxOwing, double minPurchase, //COPY:ALL
			              double discountPercent) { //COPY:ALL
		this.futureValue = futureValue; //COPY:ALL
		this.order = order; //COPY:ALL
		this.maxOwing = maxOwing; //COPY:ALL
		this.minPurchase = minPurchase; //COPY:ALL
		this.discountPercent = discountPercent; //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
