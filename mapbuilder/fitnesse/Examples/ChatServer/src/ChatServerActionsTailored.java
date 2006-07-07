import chat.ChatRoom;

/*
 * @author Rick Mugridge 24/04/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class ChatServerActionsTailored extends fit.ActionFixture {
	private static ChatRoom CHAT; //COPY:ALL
	private String roomName; //COPY:ALL
	//COPY:ALL
	public ChatServerActionsTailored() { //COPY:ALL
		actor = this; //COPY:ALL
		if (CHAT == null) //COPY:ALL
			start(); //COPY:ALL
	} //COPY:ALL
	public void start() { //COPY:ALL
		CHAT = new ChatRoom(); //COPY:ALL
	} //COPY:ALL
	public void connect() { //COPY:ALL
		String userName = arg(0); //COPY:ALL
		CHAT.connectUser(userName); //COPY:ALL
	} //COPY:ALL
	public void newRoom() { //COPY:ALL
		String roomName = arg(0); //COPY:ALL
		CHAT.userCreatesRoom(null, roomName); //COPY:ALL
	} //COPY:ALL
	public void enterRoom() { //COPY:ALL
		roomName = arg(0); // Save current roomName //COPY:ALL
		String userName = arg(1); //COPY:ALL
		CHAT.userEntersRoom(userName,roomName); //COPY:ALL
	} //COPY:ALL
	public int occupantCount() { //COPY:ALL
		return CHAT.occupants(roomName); // Use current roomName //COPY:ALL
	} //COPY:ALL
	private String arg(int i) { //COPY:ALL
		return cells.at(i+1).text(); //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
