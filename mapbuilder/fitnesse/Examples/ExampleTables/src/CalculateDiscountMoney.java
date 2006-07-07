import money.Money;

/*
 * @author Rick Mugridge on Jan 3, 2005
 *
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
 *
 */
public class CalculateDiscountMoney extends fit.ColumnFixture {
    public Money amount;
    
    public Money discount() {
		if (amount.greaterThanEqual(new Money(1000*100)))
			return amount.times(0.05);
		else
			return new Money(0);
    }
	public Object parse(String s, Class type) throws Exception {
	    if (type == Money.class)
	        return Money.parse(s);
	    return super.parse(s,type);
	}
}
