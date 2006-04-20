/*
 * @author Rick Mugridge 11/10/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class ParamRowFixture extends fit.RowFixture { //COPY:ALL
	private Object[] collection; //COPY:ALL
	private Class targetClass; //COPY:ALL
	 //COPY:ALL
	public ParamRowFixture(Object[] collection, Class targetClass) { //COPY:ALL
		this.collection = collection; //COPY:ALL
		this.targetClass = targetClass; //COPY:ALL
	} //COPY:ALL
	public Object[] query() throws Exception { //COPY:ALL
		return collection; //COPY:ALL
	} //COPY:ALL
	public Class getTargetClass() { //COPY:ALL
		return targetClass; //COPY:ALL
	} //COPY:ALL
} //COPY:ALL
