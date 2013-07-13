package com.cg.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

public class HttpConnectionTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("Test HTTPConnection");
		URL url;
		// url = new URL("http://www.google.cn"); 
		url = new URL("https://192.168.161.5"); 

		URLConnection uc = url.openConnection();
		BufferedReader br = new BufferedReader(new InputStreamReader(uc
				.getInputStream()));
		while (true) {
			String temp = br.readLine();
			if (temp == null)
				break;
			System.out.println(temp);
		}
		br.close();
	}
}
