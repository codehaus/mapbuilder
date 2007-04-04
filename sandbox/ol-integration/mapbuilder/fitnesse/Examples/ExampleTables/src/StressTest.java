/*
 * @author Rick Mugridge 12/07/2004
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

/**
 * 
 */
public class StressTest extends fit.ColumnFixture {
	public int clients = 0;
	public int maxReactionTime = 0;
	
	public long reactionTime() {
		return applicationReactionTime();
	}
	public boolean withinTime() {
		return applicationReactionTime() < maxReactionTime;
	}
	private long applicationReactionTime() {
		return Math.round(clients * 0.1);
	}
	
}
