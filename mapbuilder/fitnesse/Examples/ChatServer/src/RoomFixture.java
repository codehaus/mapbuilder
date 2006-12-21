import chat.ChatRoom;

/*
 * @author Rick Mugridge 22/05/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class RoomFixture extends fitlibrary.DoFixture { //COPY:ALL
	private String roomName; //COPY:ALL
	private ChatRoom chat; //COPY:ALL
	//COPY:ALL
	public RoomFixture(ChatRoom chat, String roomName) { //COPY:ALL
		this.chat = chat; //COPY:ALL
		this.roomName = roomName; //COPY:ALL
	} //COPY:ALL
	public boolean hasOccupants(int count) { //COPY:ALL
		return chat.room(roomName).occupantCount() == count; //COPY:ALL
	} //COPY:ALL
	public boolean isOpen() { //COPY:ALL
		return chat.room(roomName).isOpen(); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
