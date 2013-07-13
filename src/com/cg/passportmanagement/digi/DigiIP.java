package com.cg.passportmanagement.digi;

/*
C:\work\PassportManagement\WebRoot\admin\python>python ppt_ip_list.py 192.168.161.5 23 root dbps
login successfully
 1. IP mode                     : static IP
 2. IP address                  : 192.168.161.5
 3. Subnet mask                 : 255.255.255.0
 4. Default gateway             : 192.168.161.1
 5. Enable/Disable secondary IP address  : Disable


*/

public class DigiIP {

	private int ipmode;
	private String ip;
	private String mask;
	private String gateway;
	
	public DigiIP(){
		;
	}
	public DigiIP(int ipmode, String ip, String mask, String gateway){
		this.ipmode = ipmode;
		this.ip = ip;
		this.mask = mask;
		this.gateway = gateway; 
	}
	
	public int getIpmode() {
		return ipmode;
	}
	public void setIpmode(int ipmode) {
		this.ipmode = ipmode;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getMask() {
		return mask;
	}
	public void setMask(String mask) {
		this.mask = mask;
	}
	public String getGateway() {
		return gateway;
	}
	public void setGateway(String gateway) {
		this.gateway = gateway;
	}
}
