/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class DiscountGroup { //COPY:ALL
	public double maxOwing, minPurchase; //COPY:ALL
	public String futureValue, description; //COPY:ALL
	public double discountPercent; //COPY:ALL
	
	public DiscountGroup(String futureValue, double maxOwing, 
			     double minPurchase, double discountPercent) {
		this.futureValue = futureValue;
		this.maxOwing = maxOwing;
		this.minPurchase = minPurchase;
		this.discountPercent = discountPercent;
		this.description = "";
	}

	public static DiscountGroup[] getElements() {
		return new DiscountGroup[] {
			new DiscountGroup("low",0,0,0),
			new DiscountGroup("low",0,2000,3),
			new DiscountGroup("medium",500,600,3),
			new DiscountGroup("medium",0,500,5),
			new DiscountGroup("high",2000,2000,10)
		};
	}
	public double getDiscountPercent() {
		return discountPercent;
	}
	public String getFutureValue() {
		return futureValue;
	}
	public double getMaxOwing() {
		return maxOwing;
	}
	public double getMinPurchase() {
		return minPurchase;
	}
	// ... //COPY:ALL
} //COPY:ALL
