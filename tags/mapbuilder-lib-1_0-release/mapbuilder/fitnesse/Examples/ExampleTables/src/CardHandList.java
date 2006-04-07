/*
 * Created on Jun 4, 2005
 *
 * Copyright (c) 2005 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 */

public class CardHandList extends fit.RowFixture {
	public Object[] query() throws Exception {
		return new Card[] {
				new Card("spade", "ace")
		};
	}
	public Class getTargetClass() {
		return Card.class;
	}
	public class Card {
		public String suit;
		public String card;
		
		public Card(String suit, String card) {
			this.suit = suit;
			this.card=card;
		}
	}
}
