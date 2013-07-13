package com.cg.test; 

import java.awt.Rectangle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;


public class RectangleSimpleSorter {

	public static Rectangle[] ORIG_RECTS ={
		new Rectangle(4, 1, 3,1), new Rectangle(2, 4, 1, 1),
		new Rectangle(1, 6, 1,1), new Rectangle(1, 8, 1,1),   new Rectangle(3, 6, 2,6), 		
		new Rectangle(1, 13, 3,1), new Rectangle(6,6,2,8),    new Rectangle(9, 6, 1,1), 
		new Rectangle(11, 6, 2,2),  new Rectangle(14,6, 1,1), new Rectangle(9, 8, 1,1), 
		new Rectangle(14, 8, 1,1), new Rectangle(9, 10, 1,1), new Rectangle(11,10, 1,1), 
		new Rectangle(14,10, 1,1), new Rectangle(9, 13, 1,1), new Rectangle(11,13, 1,1), 
		new Rectangle(13,13, 1,1), new Rectangle(2,15, 1,2),  new Rectangle(4,15, 1,2),
		new Rectangle(2,18, 1,2), new Rectangle(2,19, 1,3),   new Rectangle(5,18, 3,4), 
		new Rectangle(2,21, 1,3),  new Rectangle(9,15, 5, 9),  new Rectangle(13,15, 1,4), 
	};

	private static Comparator<Rectangle> upToDownLeftToRightComparator = new Comparator<Rectangle>() {
		public int compare(Rectangle o1, Rectangle o2) {
			 if ( o1.y == o2.y) {
				 return o1.x - o2.x;
			 } else {
				 return o1.y - o2.y;
			 }
		}			
	};
	
	private static Comparator<Rectangle> comparator = new Comparator<Rectangle>() {

		public int compare(Rectangle rec1, Rectangle rec2) {

			if (rec1.y == rec2.y) // same y
			{
				return rec1.x - rec2.x;
			} else if (rec1.y < rec2.y) {
				if (rec1.x == rec2.x)
					return -1;
				else if (rec1.x < rec2.x)
					return -1;
				else {
					if ((rec1.y + rec1.height) >= (rec2.y + rec2.height))
						return 1;
					else
						return -1;
				}
			} else { // rec1.y > rec2.y

				if (rec1.x == rec2.x)
					return 1;
				else if (rec1.x > rec2.x)
					return 1;
				else {
					if ((rec2.y + rec2.height) >= (rec1.y + rec1.height))
						return -1;
					else
						return 1;
				}
			}
		}
	};
	
	
	public static Rectangle[] obfuscated(Rectangle[] rects) {
		int i = rects.length;
		int[] obsfucatedIndexs = randomSerial(i);
		Rectangle[] newRects = new Rectangle[i];
		for (int m = 0; m < i; m++) {
			newRects[m] = rects[obsfucatedIndexs[m]];
		}
		return newRects;
	}
	
	public static int[] randomSerial(int limit) {
		int[] result = new int[limit];
		for (int i = 0; i < limit; i++)
			result[i] = i;
		int w;
		Random rand = new Random();
		for (int i = limit - 1; i > 0; i--) {
			w = rand.nextInt(i);
			int t = result[i];
			result[i] = result[w];
			result[w] = t;
		}
		return result;
	}
	
	
	public static void print(Rectangle[] rects, List<Rectangle> sortedList, String description ) {
		System.out.println("+++ Start: " + description + " +++++");
		int seq = 0;
		for (int i =0; i< rects.length; i++ ){
			seq  = sortedList.indexOf(rects[i]);
			System.out.println(seq + ":   " + rects[i]);
		}
		System.out.println("+++ End;   " + description + " +++++\n");
	}
	
	public static void bubbleSort(Rectangle[] rects) {
		List<Rectangle> rectList = new LinkedList<Rectangle>();
		for(int i = 0; i < rects.length; i++){
			rectList.add(rects[i]);
		}
		for(int i = rects.length -1 ; i >= 0; i--) {
			for(int j = 0; j < i; j++) {
				if (rects[i].y > rects[j].y 
					&& (rects[i].y + rects[i].height <= rects[j].y + rects[j].height) 
					&& comparator.compare(rects[i], rects[j]) <=0) {
					int m = j-1;
					for (; comparator.compare(rects[i], rects[m])<0 && m >=0; m--);
					m++;
					rectList.remove(rects[i]);	
					rectList.add(m, rects[i]);
					rectList.toArray(rects);
					i++;
					
					break;
				}
			}			
		}
	}
	
	
	public static void main(String[] args) {
		List<Rectangle>  sortedRectList = new ArrayList<Rectangle>();		
		for (Rectangle rect : ORIG_RECTS) {
			sortedRectList.add(rect);			
		}	
		print(ORIG_RECTS, sortedRectList, "original");
		
		Rectangle[] unsorted = obfuscated(ORIG_RECTS);
		print(unsorted, sortedRectList, "obfuscated");
		
		Arrays.sort(unsorted, upToDownLeftToRightComparator);
		
		print(unsorted, sortedRectList,  "Sort by up to down, left to right");
		
		
		bubbleSort(unsorted);
		print(unsorted, sortedRectList,"Sort with bubble");

	
	}
	
}
