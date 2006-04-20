import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import chat.*;

/*
 * @author Rick Mugridge 6/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class OccupantList extends fit.RowFixture { //COPY:ALL
	private ChatServer chat = new ChatServer(); //COPY:ALL
	//COPY:ALL
	public Object[] query() throws Exception { //COPY:ALL
		List occupancies = new ArrayList(); //COPY:ALL
		for (Iterator it = chat.getRooms(); it.hasNext(); ) { //COPY:ALL
			Room room = (Room)it.next(); //COPY:ALL
			collectOccupants(occupancies, room); //COPY:ALL
		} //COPY:ALL
		return occupancies.toArray(); //COPY:ALL
	} //COPY:ALL
	public Class getTargetClass() { //COPY:ALL
		return Occupancy.class; //COPY:ALL
	} //COPY:ALL
	private void collectOccupants(List occupancies, Room room) { //COPY:ALL
		for (Iterator it = room.users(); it.hasNext(); ) { //COPY:ALL
			User user = (User)it.next(); //COPY:ALL
			Occupancy occupant = new Occupancy(room.getName(), //COPY:ALL
			                                   user.getName()); //COPY:ALL
			occupancies.add(occupant);//COPY:ALL
		} //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
