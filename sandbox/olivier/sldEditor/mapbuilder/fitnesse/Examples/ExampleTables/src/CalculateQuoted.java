/*
 * @author Rick Mugridge 18/05/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class CalculateQuoted extends fit.ColumnFixture {
	public String input;
	
	public int countSpaces() {
		int count = 0;
		for (int i = 0; i < input.length(); i++)
			if (input.charAt(i) == ' ')
				count++;
		return count;
	}
	public int countChars() {
		return input.length()-2;
	}
}
