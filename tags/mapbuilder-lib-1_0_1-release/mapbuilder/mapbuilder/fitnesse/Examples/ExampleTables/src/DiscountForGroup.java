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
public class DiscountForGroup {
		public double maxOwing, minPurchase;
		public String futureValue, description;
		public double discountPercent;
	
		public DiscountForGroup(String futureValue, double maxOwing, 
					 double minPurchase, double discountPercent) {
			this.futureValue = futureValue;
			this.maxOwing = maxOwing;
			this.minPurchase = minPurchase;
			this.discountPercent = discountPercent;
			this.description = "";
		}
		public double discount(String futureValue, double owing, double purchase) {
			if (this.futureValue.equals(futureValue) && owing <= maxOwing && purchase >= minPurchase)
				return purchase * discountPercent/100;
			return 0.0;
		}
}
