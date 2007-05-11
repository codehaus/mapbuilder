/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class Credit {
	public boolean allowsCredit(int months, boolean reliable, double balance) {
		return months > 12 && reliable && balance < 6000;
	}
	public double limit(int months, boolean reliable, double balance) {
		if (allowsCredit(months, reliable, balance))
			return 1000;
		else
			return 0;
	}
}
