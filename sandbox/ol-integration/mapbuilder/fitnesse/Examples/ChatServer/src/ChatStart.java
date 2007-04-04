import java.util.Iterator;
import java.util.Set;

import chat.ChatRoom;
import chat.User;
import fitlibrary.DoFixture;
import fit.Fixture;

/*
 * @author Rick Mugridge 22/05/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class ChatStart extends DoFixture { //COPY:ALL
	private ChatRoom chat = new ChatRoom(); //COPY:ALL
	//COPY:ALL
	public ChatStart() { //COPY:TWO //COPY:THREE //COPY:FOUR
	    setSystemUnderTest(chat); //COPY:TWO //COPY:THREE //COPY:FOUR
	} //COPY:TWO //COPY:THREE //COPY:FOUR
	public boolean connectUser(String userName) { //COPY:ONE
		return chat.connectUser(userName); //COPY:ONE
	} //COPY:ONE
	public boolean userCreatesRoom(String userName, String roomName) { //COPY:ONE
		return chat.userCreatesRoom(userName,roomName); //COPY:ONE
	} //COPY:ONE
	public boolean userEntersRoom(String userName, String roomName) { //COPY:ONE
		return chat.userEntersRoom(userName,roomName); //COPY:ONE
	} //COPY:ONE
	public Fixture usersInRoom(String roomName) { //COPY:ONE
		Set users = chat.usersInRoom(roomName); //COPY:ONE
		Object[] collection = new Object[users.size()]; //COPY:ONE
		int i = 0; //COPY:ONE
		for (Iterator it = users.iterator(); it.hasNext(); ) { //COPY:ONE
			User user = (User)it.next(); //COPY:ONE
			collection[i++] = new UserCopy(user.getName()); //COPY:ONE
		} //COPY:ONE
		return new ParamRowFixture(collection,UserCopy.class); //COPY:ONE
	} //COPY:ONE
	public boolean disconnectUser(String userName) { //COPY:ONE
		return chat.disconnectUser(userName); //COPY:ONE
	} //COPY:ONE
	public int occupantCount(String roomName) { //COPY:ALL
		return chat.occupants(roomName); //COPY:ALL
	} //COPY:ALL
	/*
	public SetFixture usersInRoom(String roomName) {//COPY:TWO
		return new SetFixture(chat.usersInRoom(roomName));//COPY:TWO
	}//COPY:TWO
	*/
	public Fixture usersInRoom2(String roomName) {
		return new ParamRowFixture(chat.usersInRoom(roomName).toArray(),User.class);
	}
	public UserFixture connect(String userName) { //COPY:THREE //COPY:FOUR
		if (chat.connectUser(userName)) //COPY:THREE //COPY:FOUR
			return new UserFixture(chat, chat.user(userName)); //COPY:THREE //COPY:FOUR
		throw new RuntimeException("Duplicate user"); //COPY:THREE //COPY:FOUR
	} //COPY:THREE //COPY:FOUR
	public DoFixture room(String roomName) { //COPY:THREE
		return new DoFixture(chat.room(roomName)); //COPY:THREE
	} //COPY:THREE
	public boolean roomIsEmpty(String roomName) {
		return chat.occupants(roomName) == 0;
	}
} //COPY:ALL
