/*
 * @author Rick Mugridge 10/07/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */
package accounts;

/**
 * 
 */
public class Order {

	private int quantity;
	private String part;
	private String description;
	private int dispatched;
	private double price;
	private double total;

	public Order(int quantity, String part, String description, int dispatched, double price, double total) {
		this.quantity = quantity;
		this.part = part;
		this.description = description;
		this.dispatched = dispatched;
		this.price = price;
		this.total = total;
	}
	public int getDispatched() {
		return dispatched;
	}
	public String getPart() {
		return part;
	}
	public double getPrice() {
		return price;
	}
	public int getQuantity() {
		return quantity;
	}
	public double getTotal() {
		return total;
	}
	public String getDescription() {
		return description;
	}
}
