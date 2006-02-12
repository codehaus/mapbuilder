import chat.ChatRoom;
import chat.User;
import fitlibrary.DoFixture;

/*
 * @author Rick Mugridge 6/10/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class UserFixture extends DoFixture { //COPY:ALL
	private ChatRoom chat; //COPY:ALL
	private User user; //COPY:ALL
	 //COPY:ALL
	public UserFixture(ChatRoom chat, User user) { //COPY:ALL
		this.chat = chat; //COPY:ALL
		this.user = user; //COPY:ALL
	} //COPY:ALL
	public boolean createsRoom(String roomName) { //COPY:ALL
		chat.createRoom(roomName,user); //COPY:ALL
		return true; //COPY:ALL
	} //COPY:ALL
	public boolean entersRoom(String roomName) { //COPY:ALL
		return chat.userEntersRoom(user.getName(),roomName); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
