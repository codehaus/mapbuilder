import fitlibrary.SetUpFixture;

/*
 * @author Rick Mugridge 12/10/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class SetUpDiscounts extends SetUpFixture { //COPY:ALL
	private DiscountApplication app; //COPY:ALL
	 //COPY:ALL
	public SetUpDiscounts(DiscountApplication app) { //COPY:ALL
		this.app = app; //COPY:ALL
	} //COPY:ALL
	public void futureValueMaxBalanceMinPurchaseDiscountPercent( //COPY:ALL
			String futureValue, double maxBalance, double minPurchase, //COPY:ALL
			double discountPercent) { //COPY:ALL
		app.addDiscountGroup(futureValue,maxBalance, //COPY:ALL
                minPurchase,discountPercent); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
