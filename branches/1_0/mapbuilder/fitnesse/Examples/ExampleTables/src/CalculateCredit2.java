/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class CalculateCredit2 extends fitlibrary.CalculateFixture { //COPY:ALL
	private Credit credit = new Credit(); //COPY:ALL
	//COPY:ALL
	public boolean ampersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash54728SemicolonAmpersandHash50857SemicolonAmpersandHash50900SemicolonAmpersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash51088SemicolonAmpersandHash44201SemicolonAmpersandHash50976SemicolonAmpersandHash47924SemicolonAmpersandHash51092SemicolonAmpersandHash50529Semicolon(
			int months, boolean reliable, double balance) { //COPY:ALL
        return credit.allowsCredit(months,reliable,balance); //COPY:ALL
	} //COPY:ALL
	public double ampersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash54620SemicolonAmpersandHash46020SemicolonAmpersandHash50529SemicolonAmpersandHash50900SemicolonAmpersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash51088SemicolonAmpersandHash44201SemicolonAmpersandHash50976SemicolonAmpersandHash47924SemicolonAmpersandHash51092SemicolonAmpersandHash50529Semicolon(
			int months, boolean reliable, double balance) { //COPY:ALL
        return credit.limit(months,reliable,balance); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
