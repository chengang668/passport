package com.cg.passportmanagement.common;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Date;
import java.util.Enumeration;

public class Config {
	public static Config instance = null;
	public final static String beanid = "config";  
	
	private String serverIP;
	private String sshUser;
	private String sshPassword;
	private Boolean directConnectToPassport;
	private Boolean syncPortAcl;
	private Integer maxPasswordRetry=3;
	private Integer unlockInterval=3;  // hours
	private Integer pwdExpireDays=365;

	public Config(){
		directConnectToPassport = true;
		syncPortAcl = false;
		maxPasswordRetry = 3;
		unlockInterval = 3; 
		pwdExpireDays=365;
	}
	public String getSshUser() {
		return sshUser;
	}
	public void setSshUser(String sshUser) {
		this.sshUser = sshUser;
	}
	public String getSshPassword() {
		return sshPassword;
	}
	public void setSshPassword(String sshPassword) {
		this.sshPassword = sshPassword;
	}
	public Boolean getDirectConnectToPassport() {
		return directConnectToPassport;
	}
	public void setDirectConnectToPassport(Boolean dcp) {
		this.directConnectToPassport = dcp;
	}
	
	public String getServerIP() {
		return serverIP;
	}
	public void setServerIP(String serverIP) {
		this.serverIP = serverIP;
	}
	
	public Boolean getSyncPortAcl() {
		return syncPortAcl;
	}
	public void setSyncPortAcl(Boolean syncPortAcl) {
		this.syncPortAcl = syncPortAcl;
	}
	
	
	
	public Integer getMaxPasswordRetry() {
		return maxPasswordRetry;
	}
	public void setMaxPasswordRetry(Integer maxPasswordRetry) {
		this.maxPasswordRetry = maxPasswordRetry;
	}
	public Integer getUnlockInterval() {
		return unlockInterval;
	}
	public void setUnlockInterval(Integer unlockInterval) {
		this.unlockInterval = unlockInterval;
	}
	
	
	
	public Integer getPwdExpireDays() {
		return pwdExpireDays;
	}
	public void setPwdExpireDays(Integer pwdExpireDays) {
		this.pwdExpireDays = pwdExpireDays;
	}
	
	public Date getPwdexpiredate() {
		Date pwdexpiredate = new Date();
		long t = pwdexpiredate.getTime();
		t += Config.getInstance().getPwdExpireDays().longValue() * 24 * 3600000;
		pwdexpiredate.setTime( t );
		return pwdexpiredate;
	}
	
	public static Config getInstance(){
		if (instance == null){
			instance = (Config)SpringContextUtil.getBean(beanid);

			if (instance != null) {
				if (instance.getServerIP() == null
						|| instance.getServerIP().isEmpty()) {
					// set serverIP to the host IP if not specified.
					Enumeration<NetworkInterface> netInterfaces = null;
					try {
						netInterfaces = NetworkInterface.getNetworkInterfaces();
						while (netInterfaces.hasMoreElements()) {
							NetworkInterface ni = netInterfaces.nextElement();
							System.out.println("DisplayName:"
									+ ni.getDisplayName());
							System.out.println("Name:" + ni.getName());
							Enumeration<InetAddress> ips = ni
									.getInetAddresses();
							while (ips.hasMoreElements()) {
								InetAddress ip = ips.nextElement();
								System.out.println("IP:" + ip.getHostAddress());
								if (!ip.isLoopbackAddress()
										&& !ip.isSiteLocalAddress()) {
									instance.setServerIP(ip.getHostAddress());
									System.out.println("±¾»úµÄip="
											+ ip.getHostAddress());
									break;
								}
							}
						}

					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}
		return instance;
	}
}
