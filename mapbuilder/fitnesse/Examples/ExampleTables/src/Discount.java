/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class Discount {
	public double getDiscount(double amount) {
		if (amount < 0)
			throw new RuntimeException("Can't be a negative amount");
		if (amount < 1000)
			return 0;
		else
			return amount*0.05;
	}
}
