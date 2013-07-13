package com.cg.passportmanagement.digi;

/*
C:\work\PassportManagement\WebRoot\admin\python>python ppt_ip_filter_list.py 192.168.161.5 23 root dbps
login successfully

  1. all        Normal  anywhere                  Telnet    23     ACCEPT
  2. all        Normal  192.168.0.45/255.255.255. Telnet    23     ACCEPT
  3. all        Normal  192.168.161.245/255.255.2 SSH       22     ACCEPT
*/
/* columns' title
 * No. Interface  Option  IP address/mask           Protocol  Port   Chain rule
 */

public class DigiIpFilter {

	private int num;
	private String intface; // interface of the digi,
	private String option;
	private String ipaddress;
	private String protocol;
	private String port;
	private String rule;
	
	public DigiIpFilter(){
		;
	}
	public DigiIpFilter(int num, String intface, String option, String ipaddress, String protocol, String port, String rule){
		this.num = num;
		this.intface = intface;
		this.option = option;
		this.ipaddress = ipaddress;
		this.protocol = protocol;
		this.port = port;	
		this.rule = rule;			
	}
	
	/* 
	  1. all        Normal  anywhere                  Telnet    23     ACCEPT
	  2. all        Normal  192.168.0.45/255.255.255. Telnet    23     ACCEPT
	  3. all        Normal  192.168.161.245/255.255.2 SSH       22     ACCEPT
	*/
	
	public static DigiIpFilter fromTelnetLine(String line){
		int i = line.indexOf('.');
		String no = line.substring(0, i).trim();
		
		line = line.substring(i+2);
		
		int inface_end =  10;
		String inface = line.substring(0, inface_end);
		
		int opt_end = inface_end + 8;
		String option = line.substring(inface_end, opt_end).trim();
		
		int ip_end = opt_end + 26;
		String ip = line.substring(opt_end, ip_end).trim();
		i = ip.indexOf('/');
		if (i!=-1)
		    ip = ip.substring(0, i);

		int protocol_end = ip_end + 10;
		String protocol = line.substring(ip_end, protocol_end).trim();

		int port_end = protocol_end + 6;
		String port = line.substring(protocol_end, port_end).trim();
 
		String rule = line.substring(port_end).trim();
		
		DigiIpFilter obj = new DigiIpFilter(Integer.parseInt(no), inface, option, ip, protocol, port, rule);
		return obj;
	}
	public String getIntface() {
		return intface;
	}
	public void setIntface(String intface) {
		this.intface = intface;
	}
	public String getOption() {
		return option;
	}
	public void setOption(String option) {
		this.option = option;
	}
	public String getIpaddress() {
		return ipaddress;
	}
	public void setIpaddress(String ipaddress) {
		this.ipaddress = ipaddress;
	}
	public String getProtocol() {
		return protocol;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	public String getPort() {
		return port;
	}
	public void setPort(String port) {
		this.port = port;
	}
	public String getRule() {
		return rule;
	}
	public void setRule(String rule) {
		this.rule = rule;
	}
	 
}
