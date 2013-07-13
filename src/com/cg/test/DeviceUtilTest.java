package com.cg.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;

import com.cg.passportmanagement.digi.DigiPort;
 

public class DeviceUtilTest {
 
	public static String getLogFilename(String ip, int port, String user, String pwd)  throws IOException {
		
		String strCmd = "C:\\work\\PassportManagement\\WebRoot\\admin\\python\\ppt_log_file.py" ;
		
		// start command running
		Process proc = Runtime.getRuntime().exec("python " + strCmd + " " + ip + " " + port + " " + user + " " + pwd);

		// get command's output stream and put a buffered reader input stream on it
		InputStream istr = proc.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(istr));

		// read output lines from command
		String str = br.readLine().trim();
		if(!("login successfully".equals(str))){
			return null;
		}
		
		String fn = "";
		if ((str = br.readLine()) != null)
		{
			fn = str.trim();
		} 
		
		// wait for command to terminate
		try {
			proc.waitFor();
		} catch (InterruptedException e) {
			System.err.println("process was interrupted");
		}
		// close stream
		br.close();
		
		return fn;
	}

 
	public static Object[] getLog(String ip, int port, String user, String pwd, String filename)  throws IOException {
 
		String strCmd = "C:\\work\\PassportManagement\\WebRoot\\admin\\python\\ppt_sys_log.py" ;
		
		// start command running
		Process proc = Runtime.getRuntime().exec("python " + strCmd + " " + ip + " " + port + " " + user + " " + pwd + " " + filename);

		// get command's output stream and put a buffered reader input stream on it
		InputStream istr = proc.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(istr));

		// set up list to capture command output lines
		ArrayList<String> list = new ArrayList<String>();
		
		// read output lines from command
		String str = br.readLine().trim();
		if(!("login successfully".equals(str))){
			return null;
		}
		
		while ((str = br.readLine()) != null)
			if (str.trim().length()!=0 && !(str.startsWith("["))) 
				list.add(str);
		
		// wait for command to terminate
		try {
			proc.waitFor();
		} catch (InterruptedException e) {
			System.err.println("process was interrupted");
		}
		// close stream
		br.close();
		
		// return list of strings to caller
		return list.toArray();
	}
	
	public static void main(String[] args) throws Exception {
 
		System.out.println("Test ppt_log_file.py");
		String fn = getLogFilename("192.168.161.5", 23, "root", "dbps");
		
		System.out.println(fn); 
		
		///////////////////////////////////
		
		System.out.println("Test ppt_sys_log.py");
		Object[] lines = getLog("192.168.161.5", 23, "root", "dbps", "messages");
		 
		for (Object line : lines)
			System.out.println((String)line);
		
	}  
}
