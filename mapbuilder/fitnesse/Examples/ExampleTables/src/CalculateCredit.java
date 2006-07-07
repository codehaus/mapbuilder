/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class CalculateCredit extends fit.ColumnFixture { //COPY:ALL
	public int months; //COPY:ALL
	public boolean reliable; //COPY:ALL
	public double balance; //COPY:ALL
	private Credit credit = new Credit(); //COPY:ALL
	//COPY:ALL
	public boolean allowCredit() { //COPY:ALL
        return credit.allowsCredit(months,reliable,balance); //COPY:ALL
	} //COPY:ALL
	public double creditLimit() { //COPY:ALL
        return credit.limit(months,reliable,balance); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
