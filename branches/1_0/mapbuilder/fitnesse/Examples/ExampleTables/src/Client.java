/*
 * @author Rick Mugridge 1/05/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 *
 */
public class Client {
	private String[] phones;

	public void setPhones(String[] phones) {
		this.phones = phones;
	}
	public String firstPhone() {
		return phones[0];
	}
}
