/*
 * @author Rick Mugridge 23/04/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class CalculateFirstPhoneNumber extends fit.ColumnFixture { //COPY:ALL
	private Client client = new Client(); //COPY:ALL
	//COPY:ALL
	public String[] phones; //COPY:ALL
	//COPY:ALL
	public String first() { //COPY:ALL
		client.setPhones(phones); //COPY:ALL
		return client.firstPhone(); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
