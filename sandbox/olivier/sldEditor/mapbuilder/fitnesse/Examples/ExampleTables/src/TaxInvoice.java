import accounts.Invoice;
import accounts.Order;

/*
 * @author Rick Mugridge 10/07/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class TaxInvoice extends fitnesse.fixtures.TableFixture { //COPY:ALL
	private Invoice invoice = new Invoice(); //COPY:ALL
	 //COPY:ALL
	protected void doStaticTable(int rows) { //COPY:ALL
		check(3,3,invoice.getCustomer()); //COPY:ALL
		checkAddress(); //COPY:ALL
		checkDelivery(); //COPY:ALL
		check(0,3,invoice.getAccountNumber()); //COPY:ALL
		check(1,3,invoice.getDateAsString()); //COPY:ALL
		check(2,3,invoice.getOrderNo()); //COPY:ALL
		Order[] orderItems = invoice.getOrders(); //COPY:ALL
		checkOrderItems(orderItems); //COPY:ALL
		checkSpecialDelivery(orderItems.length); //COPY:ALL
		checkTotal(orderItems.length); //COPY:ALL
	} //COPY:ALL
	private void checkOrderItems(Order[] orderItems) { //COPY:ALL
		int firstRow = 5; //COPY:ALL
		for (int row = 0; row < orderItems.length; row++) { //COPY:ALL
			Order item = orderItems[row]; //COPY:ALL
			check(firstRow+row,0,""+item.getQuantity()); //COPY:ALL
			check(firstRow+row,1,item.getPart()); //COPY:ALL
			check(firstRow+row,2,""+item.getDescription()); //COPY:ALL
			check(firstRow+row,3,""+item.getDispatched()); //COPY:ALL
			check(firstRow+row,4,item.getPrice()); //COPY:ALL
			check(firstRow+row,5,item.getTotal()); //COPY:ALL
		} //COPY:ALL
	} //COPY:ALL
	private void check(int row, int column, String expected) { //COPY:ALL
		if (expected.equals(getText(row,column))) //COPY:ALL
			right(row,column); //COPY:ALL
		else //COPY:ALL
			wrong(row,column,expected); //COPY:ALL
	} //COPY:ALL
	private void check(int row, int column, double expected) { //COPY:ALL
		double actual = Double.valueOf(getText(row,column)).doubleValue(); //COPY:ALL
		if (expected == actual) //COPY:ALL
			right(row,column); //COPY:ALL
		else //COPY:ALL
			wrong(row,column,""+expected); //COPY:ALL
	} //COPY:ALL
	// ...  //COPY:ALL
	private void checkTotal(int orderItems) {
		check(5+orderItems,5,invoice.getTotal());
	}
	private void checkSpecialDelivery(int orderItems) {
		check(6+orderItems,1,invoice.getSpecialDelivery());
	}
	private void checkAddress() {
		String[] address = invoice.getAddress();
		if (address.length == 4)
			checkColumn(address,0,0);
		else
			wrong(0,0,"Address too short");
	}
	private void checkColumn(String[] s, int column, int startRow) {
		for (int row = startRow; row < s.length+startRow; row++)
			if (s[row-startRow].equals(getText(row,column)))
				right(row,column);
			else
				wrong(row,column,s[row-startRow]);
	}
	private void checkDelivery() {
		String[] delivery = invoice.getDelivery();
		if (delivery.length == 3)
			checkColumn(delivery,1,1);
		else
			wrong(1,1,"Delivery too short");
	}
} //COPY:ALL
