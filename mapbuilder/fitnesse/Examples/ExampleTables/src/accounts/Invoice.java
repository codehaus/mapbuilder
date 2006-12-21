/*
 * @author Rick Mugridge 10/07/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */
package accounts;

/**
 * 
 */
public class Invoice {
	private String[] address = { "Uni of Auckland", "Private Bag 92019", "Auckland", ""};
	private String[] delivery = { "Attn: Sal Mayha", "Uni of Auckland", "" };
	private String date = "05/01/04";
	private String account = "216017-01";
	private String orderNo = "TC000015473-REPL";
	private String cust = "UNI34";

	public String[] getAddress() {
		return address;
	}
	public String[] getDelivery() {
		return delivery;
	}
	public String getDateAsString() {
		return date;
	}
	public String getAccountNumber() {
		return account;
	}
	public String getOrderNo() {
		return orderNo;
	}
	public String getCustomer() {
		return cust;
	}
	public Order[] getOrders() {
		return new Order[] {
				new Order(1, "CAT 98142-00-GH", "L3 Switch 32x1000T", 1, 6804.00, 6804.00),
				new Order(2, "CAT 99000-01-PH", "Macronetic switch", 2, 2317.00, 2317.00)};
	}
	public String getSpecialDelivery() {
		return "AS0555P";
	}
	public double getTotal() {
		double total = 0.0;
		Order[] orders = getOrders();
		for (int i = 0; i < orders.length; i++)
			total += orders[i].getTotal();
		return total;
	}
}
