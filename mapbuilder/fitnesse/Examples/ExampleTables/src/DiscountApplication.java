import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/*
 * @author Rick Mugridge 24/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  *
*/
public class DiscountApplication {
	private List groups = new ArrayList();

	public void addDiscountGroup(String futureValue, double maxOwing, double minPurchase, double discountPercent) {
		groups.add(new DiscountForGroup(futureValue,maxOwing,minPurchase,discountPercent));
	}
	public List getGroups() {
		return groups;
	}
	public double discount(String futureValue, double owing, double purchase) {
		for (Iterator it = groups.iterator(); it.hasNext(); ) {
			DiscountForGroup group = (DiscountForGroup)it.next();
			double discount = group.discount(futureValue,owing,purchase);
			if (discount > 0)
				return discount;
		}
		return 0;
	}
}
