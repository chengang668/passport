package com.cg.test;

import java.net.InetAddress;

public class pingTest {
	public static void main(String args[]) throws Exception {
		InetAddress address1 = InetAddress.getLocalHost();
		InetAddress address2 = InetAddress.getByName("banana30"); //www.baidu.com 
		System.out.println(address1.isReachable(5000));
		System.out.println(address2.isReachable(5000));
	}
}