/*
 * @author Rick Mugridge on Nov 14, 2004
 *
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */
package sokoban;

/**
 *
 */
public class Sokoban {
	public static final int
		s = 0,
		e = 1,
		f = 2,
		b = 3,
		w = 4,
		W = 5;

	public int[][] ge2DArrayOfValues() {
		return new int[][] {
			{W,W,W,W,W,W,W,W,W,W},
			{W,s,s,s,e,s,s,s,s,W},
			{W,s,s,s,b,s,s,s,s,W},
			{W,e,b,s,s,s,s,s,s,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,w,b,s,s,s,e,W},
			{W,s,s,s,b,s,s,s,e,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,b,s,s,s,s,s,W},
			{W,s,s,e,s,s,s,b,e,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,s,s,s,s,s,s,s,s,W},
			{W,W,W,W,W,W,W,W,W,W}
		};
	}

	public void quit() {
	}
	public boolean gameover() {
		return true;
	}
	public String promptplayername() {
		return null;
	}
	public String hof() {
		return null;
	}
	public void north() {
	}
	public void south() {
	}
	public void east() {
	}
	public void west() {
	}
}
