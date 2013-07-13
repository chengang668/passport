package com.cg.passportmanagement.digi;

public class DigiPort {
	private Integer portNo;
	private String group;
	private String title;
	private String mode;
	private String port;
	private String protocol;
	private String serial_setting;

	public DigiPort(){
		;
	}
	
	public DigiPort(Integer portNo, String group, String title, String mode, String port, String protocol, String serial_setting){
		this.portNo = portNo;
		this.group = group;
		this.title = title;
		this.mode = mode;
		this.port = port;
		this.protocol = protocol;
		this.serial_setting = serial_setting;
	}
	
	/*
	 No. Group      Title              Mode Port  Protocol Serial-Settings
	  1. NONE       abcdefghijklmnopqr CS   7001  Telnet   9600-N-8-1-NO
	  2. NONE       Port Title #2      CS   7002  Telnet   9600-N-8-1-NO
	  3. NONE       Port Title #3      CS   7003  Telnet   9600-N-8-1-NO
	  4. NONE       Port Title #4      PPP                 9600-N-8-1-NO
	  5. NONE       Remote Port        CS   7008  Telnet   0.0.0.0/0
	  
      9. NONE       Port Title #9      CS   7009  SSH      9600-N-8-1-NO 
     10. NONE       Port Title #10     CS   7010  SSH      9600-N-8-1-NO 
     11. NONE       Port Title #11     CS   7011  SSH      9600-N-8-1-NO 
     12. NONE       Port Title #12     CS   7012  SSH      9600-N-8-1-NO 
     13. NONE       Port Title #13     CS   7013  SSH      9600-N-8-1-NO 
     14. NONE       Port Title #14     CS   7014  SSH      9600-N-8-1-NO 
     15. NONE       Port Title #15     CS   7015  SSH      9600-N-8-1-NO 
     16. NONE       Port Title #16     CS   7016  SSH      9600-N-8-1-NO 
	 */ 
	public static DigiPort fromTelnetLine(String line){
		int i = line.indexOf('.');
		String portno = line.substring(0, i).trim();
		
		line = line.substring(i+2);
		
		int g_end =  10;
		String group = line.substring(0, g_end);
		
		int title_end = g_end + 20;
		String title = line.substring(g_end, title_end).trim();
		
		int mode_end = title_end + 5;
		String mode = line.substring(title_end, mode_end).trim();

		int port_end = mode_end + 6;
		String port = line.substring(mode_end, port_end).trim();

		int protocol_end = port_end + 9;
		String protocol = line.substring(port_end, protocol_end).trim();
		
		String serial_setting = line.substring(protocol_end);
		
		DigiPort obj = new DigiPort(Integer.parseInt(portno), group, title, mode, port, protocol, serial_setting);
		return obj;
	}

	public Integer getPortNo() {
		return portNo;
	}

	public void setPortNo(Integer portNo) {
		this.portNo = portNo;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getSerial_setting() {
		return serial_setting;
	}

	public void setSerial_setting(String serial_setting) {
		this.serial_setting = serial_setting;
	}

}
