package com.cg.passportmanagement.common;

import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Util {

	/**
	 * MD5 º”√‹
	 */
	public static String getMD5HexStr(String str) {
		MessageDigest messageDigest = null;

		try {
			messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.reset();
			messageDigest.update(str.getBytes("UTF-8"));
		} catch (NoSuchAlgorithmException e) {
			System.out.println("NoSuchAlgorithmException caught!");
			// throw e;
			// System.exit(-1);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			// throw e;
		}

		byte[] byteArray = messageDigest.digest();

		StringBuffer md5StrBuff = new StringBuffer();

		for (int i = 0; i < byteArray.length; i++) {
			if (Integer.toHexString(0xFF & byteArray[i]).length() == 1)
				md5StrBuff.append("0").append(
						Integer.toHexString(0xFF & byteArray[i]));
			else
				md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
		}

		return md5StrBuff.toString();
	}

    public static boolean validIP_not_work(String ip) {
		boolean isIP = true;
		String   regx="([1-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])(\\.(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])){3}";   
       Pattern pattern = Pattern.compile(regx);    
       Matcher matcher = pattern.matcher(ip);    
       return matcher.matches();
	}   

    public static boolean isValidIP(String ip) {
    	String[] items = ip.split("\\.");
    	if (items.length != 4)
    		return false;
    	int aa;
    	
    	try {
    		int i=0;
	    	for (String s:items){
	    		aa = Integer.parseInt(s, 10);
	    		if ( aa > 255 || aa < 0 )
	    			return false; 

	    		//if (i==0 && aa == 0)
	    		//	return false;	    			
	    		++i;
	    	}
    	}catch(NumberFormatException e){
    		return false;
    	}
       return true;
	} 

	public static boolean ping(String host) { //throws Exception 
		try {
			InetAddress addr = InetAddress.getByName(host);
			return addr.isReachable(6000);
		} catch (Exception e) { 
			// e.printStackTrace();
			System.out.println(host + " is not reachable...");
		} 
		return false;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// Md5("12312312312312"); Ω·π˚: 
		// ba56bab91016bcb37878e06c16e9e68f 
		String str = "12312312312312";
		String md5 = Util.getMD5HexStr(str);
		
		System.out.println(md5);
		
		String ip = "192.168.123.123";
		if (isValidIP(ip)){
			System.out.println(ip + " is valid IP");
		}
		ip = "192.168.0.256";
		if (!isValidIP(ip)){
			System.out.println(ip + " is  not valid IP");
		}
	}

}
