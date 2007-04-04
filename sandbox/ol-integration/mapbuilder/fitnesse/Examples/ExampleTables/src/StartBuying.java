import items.LineItems;

/*
 * @author Rick Mugridge 1/05/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * This creates the SUT.
 * This is also the actor, so provides any check methods.
 */
public class StartBuying extends fit.ActionFixture { //COPY:ALL
	public static LineItems SUT; //COPY:ALL
	//COPY:ALL
	public StartBuying() { //COPY:ALL
		actor = this; //COPY:ALL
		SUT = new LineItems(); //COPY:ALL
	} //COPY:ALL
	public double total() { //COPY:ALL
		return StartBuying.SUT.totalIs(); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
