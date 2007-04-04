/*
 * @author Rick Mugridge on Sep 25, 2004
 *
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
 *
 */
public class DiscountGroupsSetUp extends fitlibrary.SetUpFixture {
    DiscountApplication app = new DiscountApplication();
    public void futureValueMaxBalanceMinPurchaseDiscountPercent(
            String futureValue, double maxBalance, double minPurchase, 
            double discountPercent) {
        app.addDiscountGroup(futureValue,maxBalance, //COPY:ALL
                minPurchase,discountPercent);
    }
}
