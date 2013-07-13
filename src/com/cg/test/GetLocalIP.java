package com.cg.test;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;

public class GetLocalIP {

	/**
	 * @param args
	 * @throws SocketException 
	 */
	public static void main(String[] args) throws UnknownHostException, SocketException
    {
		InetAddress inet = InetAddress.getLocalHost();
		System.out.println("本机的ip=" + inet.getHostAddress());
		
/*		Enumeration netInterfaces = NetworkInterface.getNetworkInterfaces();
		InetAddress ip = null;
		while (netInterfaces.hasMoreElements()) {
			NetworkInterface ni = (NetworkInterface) netInterfaces
					.nextElement();
			System.out.println(ni.getName());
			ip = (InetAddress) ni.getInetAddresses().nextElement();
			if (!ip.isSiteLocalAddress() && !ip.isLoopbackAddress()
					&& ip.getHostAddress().indexOf(":") == -1) {
				System.out.println("本机的ip=" + ip.getHostAddress());
				break;
			} else {
				ip = null;
			}
		}   */
		Enumeration<NetworkInterface> netInterfaces = null;   
		try {   
		    netInterfaces = NetworkInterface.getNetworkInterfaces();   
		    while (netInterfaces.hasMoreElements()) {   
		        NetworkInterface ni = netInterfaces.nextElement();   
		        System.out.println("DisplayName:" + ni.getDisplayName());   
		        System.out.println("Name:" + ni.getName());   
		        Enumeration<InetAddress> ips = ni.getInetAddresses();   
		        while (ips.hasMoreElements()) { 
		        	InetAddress ip = ips.nextElement();
		            System.out.println("IP:" + ip.getHostAddress());   
		            if (!ip.isLoopbackAddress() && !ip.isSiteLocalAddress()){
		            	System.out.println("本机的ip=" + ip.getHostAddress());
		            }
		        } 
		    }   
		} catch (Exception e) {   
		    e.printStackTrace();   
		} 

    
    } 
}
