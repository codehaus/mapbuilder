import java.util.Iterator;

import chat.ChatServer;
import chat.Room;
import chat.User;

import fitlibrary.DoFixture;
import fitlibrary.graphic.DotGraphic;

/*
 * @author Rick Mugridge 13/07/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class UsersAndRooms extends DoFixture { //COPY:ALL
    private ChatServer chat = new ChatServer(); //COPY:ALL
    //COPY:ALL
	public DotGraphic users() { //COPY:ALL
	    String dot = "digraph G {\n"; //COPY:ALL
	    for (Iterator itRoom = chat.getRooms(); itRoom.hasNext(); ) { //COPY:ALL
	        Room room = (Room)itRoom.next(); //COPY:ALL
	        for (Iterator itUser = room.users(); itUser.hasNext(); ) { //COPY:ALL
	            User user = (User)itUser.next(); //COPY:ALL
	            dot += room.getName()+"->"+user.getName()+";\n"; //COPY:ALL
	        } //COPY:ALL
	    } //COPY:ALL
		return new DotGraphic(dot+"}\n"); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
