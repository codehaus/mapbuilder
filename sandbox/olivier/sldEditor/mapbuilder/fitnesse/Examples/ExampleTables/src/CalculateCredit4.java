/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class CalculateCredit4 extends fitlibrary.DoFixture {
	private static final String KOREAN_YES = "&#50696;";
	private static final String KOREAN_NO = "&#50500;&#45768;&#50724;";
	private Credit credit = new Credit();
	
	public fit.Fixture ampersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash49328SemicolonAmpersandHash51221Semicolon() {
		return new Calculate();
	}
	public fit.Fixture ampersandHash12463SemicolonAmpersandHash12524SemicolonAmpersandHash12472SemicolonAmpersandHash12483SemicolonAmpersandHash12488SemicolonAmpersandHash12434SemicolonAmpersandHash35336SemicolonAmpersandHash31639SemicolonAmpersandHash12377SemicolonAmpersandHash12427Semicolon() {
		return new CalculateCredit3();
	}
	
	public class Calculate extends fitlibrary.CalculateFixture {
		public String ampersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash54728SemicolonAmpersandHash50857SemicolonAmpersandHash50900SemicolonAmpersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash51088SemicolonAmpersandHash44201SemicolonAmpersandHash50976SemicolonAmpersandHash47924SemicolonAmpersandHash51092SemicolonAmpersandHash50529Semicolon(
				int months, String reliableString, double balance) { //COPY:ALL
			boolean reliable = reliableString.equals(KOREAN_YES);
			if (credit.allowsCredit(months,reliable,balance))
				return KOREAN_YES;
			return KOREAN_NO;
		}
		public double ampersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash54620SemicolonAmpersandHash46020SemicolonAmpersandHash50529SemicolonAmpersandHash50900SemicolonAmpersandHash49888SemicolonAmpersandHash50857SemicolonAmpersandHash51088SemicolonAmpersandHash44201SemicolonAmpersandHash50976SemicolonAmpersandHash47924SemicolonAmpersandHash51092SemicolonAmpersandHash50529Semicolon(
				int months, boolean reliable, double balance) { //COPY:ALL
			return credit.limit(months,reliable,balance); //COPY:ALL
		}
	}
}
