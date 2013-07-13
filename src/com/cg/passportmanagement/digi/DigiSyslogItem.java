package com.cg.passportmanagement.digi;

/*
	ppt_syslogng_list.py 192.168.0.5 23 root dbps
	login successfully
	  1. F-Local0             UDP             192.168.0.126
	  2. F-Local1             UDP             192.168.0.126
	  3. F-Local3             TCP             192.168.0.126
	  4. F-Local0             systemlog       /var/log/messages
*/
 
public class DigiSyslogItem {
	private int 	num;
	private String filter;
	private String destination;
	private String serverip;
	
	public DigiSyslogItem(){
		;
	}
	public DigiSyslogItem(int num, String filter, String destination, String serverip){
		this.num = num;
		this.filter = filter;
		this.destination = destination;
		this.serverip = serverip;
	}
	
	/* 1. F-Local0             UDP             192.168.0.126 */
	public static DigiSyslogItem fromTelnetLine(String line){
		int i = line.indexOf('.');
		String num = line.substring(0, i).trim();
		
		line = line.substring(i+2+2); // skip "F-"
		
		int filter_end =  18;
		String filter = line.substring(0, filter_end).trim();
		
		int dest_end = filter_end + 16;
		String dest = line.substring(filter_end, dest_end).trim();
		
		String serverip = line.substring(dest_end).trim();
		
		DigiSyslogItem obj = new DigiSyslogItem(Integer.parseInt(num), filter, dest, serverip);
		return obj;
	}
	
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public String getFilter() {
		return filter;
	}
	public void setFilter(String filter) {
		this.filter = filter;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
	}
	public String getServerip() {
		return serverip;
	}
	public void setServerip(String serverip) {
		this.serverip = serverip;
	}
}
