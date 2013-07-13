package com.cg.passportmanagement.digi;

/*
C:\work\PassportManagement\WebRoot\admin\python>python ppt_ppp_list.py 192.168.161.5 23 root dbps
login successfully
 1. Dynamic IP address pool for incomming connections  : Enable
 2. First IP address            : 192.168.161.168
 3. Number of address           : 4
*/

public class DigiPPP {
	private int ipPoolEnable;
	private String firstip;
	private int numberOfIP; 

	public DigiPPP(){
		;
	}

	public int getIpPoolEnable() {
		return ipPoolEnable;
	}

	public void setIpPoolEnable(int ipPoolEnable) {
		this.ipPoolEnable = ipPoolEnable;
	}

	public String getFirstip() {
		return firstip;
	}

	public void setFirstip(String firstip) {
		this.firstip = firstip;
	}

	public int getNumberOfIP() {
		return numberOfIP;
	}

	public void setNumberOfIP(int numberOfIP) {
		this.numberOfIP = numberOfIP;
	} 
}
