import fitlibrary.ArrayFixture;
import fitlibrary.DoFixture;
import fit.Fixture;
import fitlibrary.SubsetFixture;

/*
 * @author Rick Mugridge 2/10/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class Discounts extends DoFixture { //COPY:ALL
	private DiscountApplication app = new DiscountApplication(); //COPY:ALL
	 //COPY:ALL
	public Fixture setUps() { //COPY:ALL
		return new SetUpDiscounts(app); //COPY:ALL
	} //COPY:ALL
	public Fixture orderedList() { //COPY:ALL
		return new ArrayFixture(app.getGroups()); //COPY:ALL
	} //COPY:ALL
	public Fixture subset() { //COPY:ALL
		return new SubsetFixture(app.getGroups()); //COPY:ALL
	} //COPY:ALL
	public Fixture calculateWithFutureValue(String futureValue) { //COPY:ALL
		return new CalculateDiscounts2(app,futureValue); //COPY:ALL
	} //COPY:ALL
}
