import java.util.Arrays;
import java.util.List;

import fitlibrary.ArrayFixture;
import fit.Fixture;
import fitlibrary.ParamRowFixture;
import fitlibrary.SetFixture;
import fitlibrary.SubsetFixture;

/*
 * @author Rick Mugridge on Dec 23, 2004
 *
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
 *
 */
public class StartListing extends fitlibrary.DoFixture {
    private int[] ints;

    public void listIs(int[] ints) { 
        this.ints = ints;
    }
    public Fixture orderedList() {
        return new ArrayFixture(itemList());
    }
    public Fixture rowList() {
        return new ItemRowFixture();
    }
    public Fixture set() {
        return new SetFixture(itemList());
    }
    public Fixture subset() {
        return new SubsetFixture(itemList());
    }
    public Fixture paramRowList() {
        return new ParamRowFixture(itemArray(),Item.class);
    }
    private List itemList() {
        return Arrays.asList(itemArray());
    }
    private Object[] itemArray() {
        Object[] result = new Object[ints.length];
        for (int i = 0; i < ints.length; i++)
            result[i] = new Item(ints[i]);
        return result;
    }
    public static class Item {
        public int item;
        public Item(int item) {
            this.item = item;
        }
    }
    public class ItemRowFixture extends fit.RowFixture {
        public Object[] query() throws Exception {
            return itemArray();
        }
        public Class getTargetClass() {
            return Item.class;
        }
    }
}
