/*
 * @author Rick Mugridge 12/10/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class CalculateDiscounts2 extends fitlibrary.CalculateFixture { //COPY:ALL
	private DiscountApplication app; //COPY:ALL
	private String futureValue; //COPY:ALL
	 //COPY:ALL
	public CalculateDiscounts2(DiscountApplication app, String futureValue) { //COPY:ALL
		this.app = app; //COPY:ALL
		this.futureValue = futureValue; //COPY:ALL
	} //COPY:ALL
	public double discountOwingPurchase(double owing, double purchase) { //COPY:ALL
		return app.discount(futureValue,owing,purchase); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
