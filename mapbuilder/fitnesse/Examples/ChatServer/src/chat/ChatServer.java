package chat;

/*
 * @author Rick Mugridge 26/12/2003
 *
 * Copyright (c) 2003 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

public class ChatServer extends ChatRoom {
	
	public ChatServer() {
		connectUser("anna");
		userCreatesRoom("anna", "lotr");
		userEntersRoom("anna","lotr");
		connectUser("luke");
		userEntersRoom("luke","lotr");
	}
}
