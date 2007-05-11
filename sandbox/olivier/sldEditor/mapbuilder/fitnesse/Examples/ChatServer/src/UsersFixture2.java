import java.util.List;

import chat.User;

/*
 * @author Rick Mugridge 11/10/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class UsersFixture2 extends fit.RowFixture { //COPY:ALL
	private Object[] collection; //COPY:ALL
	 //COPY:ALL
	public UsersFixture2(List users) { //COPY:ALL
		collection = users.toArray(); //COPY:ALL
	} //COPY:ALL
	public Object[] query() throws Exception { //COPY:ALL
		return collection; //COPY:ALL
	} //COPY:ALL
	public Class getTargetClass() { //COPY:ALL
		return User.class; //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
