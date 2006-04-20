import sokoban.Sokoban;
import fitlibrary.DoFixture;
import fitlibrary.ImageFixture;
import fit.Fixture;

/*
 * @author Rick Mugridge on Nov 14, 2004
 *
 * Copyright (c) 2004 Rick Mugridge, University of Auckland, NZ
 * Released under the terms of the GNU General Public License version 2 or later.
 *
 */

/**
 *
 */
public class StartSokoban extends DoFixture { //COPY:ALL
    private static final String PREFIX = "/files/gameImages/"; //COPY:ALL
    private Sokoban sokoban = new Sokoban(); //COPY:ALL
    //COPY:ALL
    public Fixture board() { //COPY:ALL
        int[][] pieces = sokoban.ge2DArrayOfValues(); //COPY:ALL
        String[][]imageFileName = new String[pieces.length][]; //COPY:ALL
        for (int row = 0; row < pieces.length; row++) { //COPY:ALL
            imageFileName[row] = new String[pieces[row].length]; //COPY:ALL
            for (int col = 0; col < pieces[row].length; col++) //COPY:ALL
                imageFileName[row][col] = PREFIX+map(pieces[row][col]); //COPY:ALL
        } //COPY:ALL
        return new ImageFixture(imageFileName); //COPY:ALL
    } //COPY:ALL
    private String map(int piece) { //COPY:ALL
        switch(piece) { //COPY:ALL
    		case Sokoban.s: return "space.jpg"; //COPY:ALL
        	case Sokoban.e: return "shelf.jpg"; //COPY:ALL
        	case Sokoban.f: return "shelfwithbox.jpg"; //COPY:ALL
        	case Sokoban.b: return "box.jpg"; //COPY:ALL
        	case Sokoban.w: return "worker.jpg"; //COPY:ALL
        	case Sokoban.W: return "wall.jpg"; //COPY:ALL
        } //COPY:ALL
        throw new RuntimeException("Unknown piece"); //COPY:ALL
    } //COPY:ALL
} //COPY:ALL
