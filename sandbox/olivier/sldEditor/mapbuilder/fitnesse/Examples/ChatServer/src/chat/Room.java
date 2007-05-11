package chat;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/*
 * @author Rick Mugridge 21/04/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class Room {
	private String name;
	private User owner;
	private ChatRoom chat;
	private Set users = new HashSet();

	public Room(String roomName, User owner, ChatRoom chat) {
		this.name = roomName;
		this.owner = owner;
		this.chat = chat;
	}
	public Iterator users() {
		return users.iterator();
	}
	public void add(User user) {
		users.add(user);
	}
	public boolean remove(User user) {
		return users.remove(user);
	}
	public String getName() {
		return name;
	}
	public int occupantCount() {
		return users.size();
	}
	public Set usersIn() {
		return users;
	}
	public boolean isOpen() {
		return true;
	}
	public String getOwner() {
		return owner.getName();
	}
	public void rename(String name) {
		chat.renameRoom(this,name);
		this.name = name;
	}
}
