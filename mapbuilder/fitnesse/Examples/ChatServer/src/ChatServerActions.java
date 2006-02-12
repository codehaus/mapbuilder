import chat.ChatRoom;

/*
 * @author Rick Mugridge 8/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
  * Test some simple changes to a chat room
*/
public class ChatServerActions extends fit.Fixture { //COPY:ALL
	private ChatRoom chat = new ChatRoom(); //COPY:ALL
	private String userName = ""; //COPY:ALL
	private String roomName = ""; //COPY:ALL
	//COPY:ALL
	public void user(String userName) { //COPY:ALL
		this.userName = userName; //COPY:ALL
	} //COPY:ALL
	public void connect() { //COPY:ALL
		chat.connectUser(userName); //COPY:ALL
	} //COPY:ALL
	public void room(String roomName) { //COPY:ALL
		this.roomName = roomName; //COPY:ALL
	} //COPY:ALL
	public void newRoom() { //COPY:ALL
		chat.userCreatesRoom(userName, roomName); //COPY:ALL
	} //COPY:ALL
	public void enterRoom() { //COPY:ALL
		chat.userEntersRoom(userName,roomName); //COPY:ALL
	} //COPY:ALL
	public int occupantCount() { //COPY:ALL
		return chat.occupants(roomName); //COPY:ALL
	} //COPY:ALL
	public void disconnect() {
		chat.disconnectUser(userName);
	}
} //COPY:ALL
