package com.cg.passportmanagement.common;

import java.util.List; 
import java.util.Set; 
import java.util.TreeSet;

import com.cg.passportmanagement.dao.IpfilterDAO;
import com.cg.passportmanagement.database.Ipfilter;

public final class IpFilterConfig {
	
	private Set<String> allowIPs = new TreeSet<String>(); 
	private boolean bInitialized = false;
	
	private static IpFilterConfig instance = new IpFilterConfig();
	
	private IpFilterConfig(){

	}
	public static IpFilterConfig getInstance(){
		if (!instance.bInitialized){
			instance.reload();
			instance.bInitialized = true;
		}
		return instance;
	}
	
	public void add(String ip){
		if (ip!=null)
			allowIPs.add(ip);
	}

	public void reload(){
		allowIPs.clear();
		allowIPs.add("127.0.0.1"); // always allow localhost
		List<Ipfilter> list = IpfilterDAO.getInstance().findAll();
		for (Ipfilter it : list){
			if (it.getip().indexOf("-") < 0)
				allowIPs.add(it.getip());
			else {
				// for case:  192.168.0.1 - 192.168.0.100
				int i = it.getip().indexOf("-");
				String start = it.getip().substring(0, i).trim();
				String end = it.getip().substring(i+1).trim();
				
				if (start.length() > 1)
					allowIPs.add(start);
				if (end.length() >1)
					allowIPs.add(end);
				
				int j = start.lastIndexOf('.');
				int k = end.lastIndexOf('.');
				if (j != k )
					return;

				String bs = start.substring(0, j);
				String be = end.substring(0, j);
				if ( bs.compareTo(be) != 0){
					return;
				}
				
				try {
					int ss = Integer.parseInt(start.substring(j+1));
					int ee = Integer.parseInt(end.substring(j+1));
					String base = start.substring(0, j+1);
					
					for (int aa = ss +1; aa < ee; aa ++){
						allowIPs.add(base+aa);
					}
				}
				catch (NumberFormatException e){
					;
				}
			}
		}
	}

	public Set<String> getAllowIPs(){
		return allowIPs;
	}
	
	public boolean allowIP(String clientip) {
		if (allowIPs.contains(clientip))
			return true;
		
		if (allowIPs.size()==0) // ipfilter not configured. no ip in the table.
			return true;
		
		if (allowIPs.size()==1 && allowIPs.contains("127.0.0.1"))
			return true;
		
		String ipSeg = clientip;
		for (int i=0; i<3; i++){
			ipSeg = ipSeg.substring(0, ipSeg.lastIndexOf('.'));
			String ipw = ipSeg + ".*";
			if (allowIPs.contains(ipw)){
				return true;
			}
		}
		return false;
	}

}
