/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class CalculateCredit3 extends fitlibrary.CalculateFixture { //COPY:ALL
	private static final String KANJI_TRUE = "&#30495;";
	private static final String KANJI_FALSE = "&#20605;";
	private Credit credit = new Credit(); //COPY:ALL
	//COPY:ALL
	public String ampersandHash12463SemicolonAmpersandHash12524SemicolonAmpersandHash12472SemicolonAmpersandHash12483SemicolonAmpersandHash12488SemicolonAmpersandHash12434SemicolonAmpersandHash35377SemicolonAmpersandHash21487SemicolonAmpersandHash12377SemicolonAmpersandHash12427SemicolonAmpersandHash26376SemicolonAmpersandHash25968SemicolonAmpersandHash20449SemicolonAmpersandHash38972SemicolonAmpersandHash24230SemicolonAmpersandHash27531SemicolonAmpersandHash39640Semicolon(
			int months, String reliableString, double balance) { //COPY:ALL
		boolean reliable = reliableString.equals(KANJI_TRUE);
        if (credit.allowsCredit(months,reliable,balance))
        	return KANJI_TRUE;
        else
        	return KANJI_FALSE;
	} //COPY:ALL
	public double ampersandHash12463SemicolonAmpersandHash12524SemicolonAmpersandHash12472SemicolonAmpersandHash12483SemicolonAmpersandHash12488SemicolonAmpersandHash12398SemicolonAmpersandHash38480SemicolonAmpersandHash24230SemicolonAmpersandHash26376SemicolonAmpersandHash25968SemicolonAmpersandHash20449SemicolonAmpersandHash38972SemicolonAmpersandHash24230SemicolonAmpersandHash27531SemicolonAmpersandHash39640Semicolon(
			int months, String reliableString, double balance) { //COPY:ALL
		boolean reliable = reliableString.equals(KANJI_TRUE);
        return credit.limit(months,reliable,balance); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
