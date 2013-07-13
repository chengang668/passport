package com.cg.passportmanagement.digi;

/*
C:\work\PassportManagement\WebRoot\admin\python>ppt_who.py 192.168.161.5 23 root dbps
login successfully
USER       TTY      IDLE      FROM           HOST
root       pts/0    00:00m    Nov  9 06:57   192.168.161.11
*/

public class DigiUser {

	private String userid;
	private String tty;
	private String idle;
	private String from;
	private String host;
	
	public DigiUser(){
		;
	}
	public DigiUser(String userid, String tty, String idle, String from, String host){
		this.userid = userid;
		this.tty = tty;
		this.idle = idle;
		this.from = from;
		this.host = host;		
	}
	
	public static DigiUser fromTelnetLine(String line){
		int i = line.indexOf(' ');
		String userid = line.substring(0, i).trim();
		
		line = line.substring(i+1).trim();
		
		i =  line.indexOf(' ');
		String tty = line.substring(0, i);
		
		line = line.substring(i+1).trim();
		i = line.indexOf(' ');
		String idle = line.substring(0, i);
		
		line = line.substring(i+1).trim();
		i = line.lastIndexOf(' ');
		String from = line.substring(0, i).trim();
		String host = line.substring(i+1).trim();
		
		DigiUser obj = new DigiUser(userid, tty, idle, from, host);
		return obj;
	}
	
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getTty() {
		return tty;
	}
	public void setTty(String tty) {
		this.tty = tty;
	}
	public String getIdle() {
		return idle;
	}
	public void setIdle(String idle) {
		this.idle = idle;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}

}
