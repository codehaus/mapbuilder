/*
 * Created on Jun 4, 2005
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

public class CalculateMoney extends fit.ColumnFixture {
	public double money;
	public int multiplier;
	
	public double result() {
		return money * multiplier;
	}
}
