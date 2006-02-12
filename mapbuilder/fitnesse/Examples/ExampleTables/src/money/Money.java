package money;
/*
 * @author Rick Mugridge 15/02/2004
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  *
*/
public class Money { //COPY:ALL
	private long cents; //COPY:ALL
	//COPY:ALL
	public Money(long cents) { //COPY:ALL
		this.cents = cents; //COPY:ALL
	} //COPY:ALL
	public Money(double amount) { //COPY:ALL
		this.cents = (long)(amount*100+0.5); //COPY:ALL
	} //COPY:ALL
    public Money() {
        this(0);
    }
    public boolean greaterThan(Money money) {
		return cents > money.cents;
	}
	public boolean greaterThanEqual(Money money) {
	    return cents >= money.cents;
	}
	public Money times(double rate) {
		return new Money((long)(cents*rate+0.5));
	}
	public boolean equals(Object other) { //COPY:ALL
		return other instanceof Money &&  //COPY:ALL
			((Money)other).cents == cents; //COPY:ALL
	} //COPY:ALL
	public int hashCode() { //COPY:ALL
		return (int)cents; //COPY:ALL
	} //COPY:ALL
	public String toString() { //COPY:ALL
	    long positiveCents = Math.abs(cents);
		String centString = ""+positiveCents%100; //COPY:ALL
		if (centString.length() == 1) //COPY:ALL
			centString += "0"; //COPY:ALL
		String amountString = positiveCents/100+"."+centString;
		if (cents < 0)
		    return "-"+amountString; //COPY:ALL
		return "$"+amountString; //COPY:ALL
	} //COPY:ALL
	public static Money parse(String s) { //COPY:ALL
	    if (!s.startsWith("$"))
	        throw new RuntimeException("Invalid Money");
	    s = s.substring(1);
		int dot = s.indexOf("."); //COPY:ALL
		if (dot < 0 || dot != s.length() - 3) //COPY:ALL
			throw new RuntimeException("Invalid money"); //COPY:ALL
		double amount = Double.valueOf(s).doubleValue()*100+0.5; //COPY:ALL
		return new Money((long)amount); //COPY:ALL
	} //COPY:ALL
	// ... //COPY:ALL
    public boolean isZero() {
        return cents == 0;
    }
    public Money plus(Money money) {
        return new Money(cents+money.cents);
    }
    public Money minus(Money money) {
        return new Money(cents-money.cents);
    }
    public Money negate() {
        return new Money(-cents);
    }
} //COPY:ALL
