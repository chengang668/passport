package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;
import com.cg.passportmanagement.common.Config;
import com.cg.passportmanagement.common.DeviceUtil;
import com.cg.passportmanagement.database.Dept;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.Site;
import com.cg.passportmanagement.service.DeviceService;
import com.cg.passportmanagement.service.IDeptService;
import com.cg.passportmanagement.service.IPassportService;
import com.cg.passportmanagement.service.ISiteService;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  PassportAction is configured as prototype in spring IoC 
 */

public class PassportAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private transient Passport passport = null;
	private transient Passport passport2 = null; // used for update passport
	private List<Passport> passports = new ArrayList<Passport>(0);
	private IPassportService passportService = null;
	private IDeptService deptService = null;
	private ISiteService siteService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {		
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.passportService.deleteById(Integer.parseInt(this.getDelData()));
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					this.passportService.deleteById(Integer.parseInt((id[i])));
				}
			}
		}
		try {
			this.passports = this.getPassportService().findAll(); 
			System.out.println("query database");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		JsonConfig config = new JsonConfig();
		config.setJsonPropertyFilter(new PropertyFilter(){
		    public boolean apply(Object source, String name, Object value) {
		        if(name.equals("userPassportAcls")) { //Òª¹ýÂËµÄ 
		            return true;
		        } else {
		            return false;
		        }
		    }
		});  

		this.setTotalCount(this.passports.size());
		JSONArray array = JSONArray.fromObject(this.passports, config);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}


	/**
	 * @return Return all persistent instances of the <code>Passport</code> entity.
	 */
	public String getAllPassports() {
		try {
			this.passports = this.getPassportService().findAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}


	public String findById() {
		System.out.println(this.passport.getPassportid());
		try {
			this.passport = this.getPassportService().findById(	this.passport.getPassportid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.passport);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}

	/**
	 * Make the given instance managed and persistent.
	 * 
	 * @return
	 */
	public String addPassport() {
		
		String deptname = this.passport.getDept().getDeptname().trim();
		String sitename = this.passport.getSite().getSitename().trim();
		
		System.out.println(this.passport.getIp() + "---"
				+ this.passport.getHostname()  + "---" 
				+ deptname + "---" + sitename);

		this.setJsonString("{success:true}");
		try {
			if(deptname.length()>0)
			{
				Dept dept = deptService.findDeptByDeptname(deptname);
				this.passport.setDept(dept);
			}
			else 
				this.passport.setDept(null);
			
			if (sitename.length()>0)
			{
				Site site= siteService.findBySitename(sitename);
				this.passport.setSite(site);
			}
			else
				this.passport.setSite(null);
			
			// check passport validation
			// if passport cannot be connected, report error
			// if valid, retrieve its information and save them.
			// Set all ports SSH, syslogng:Local1
			DeviceUtil.initAllPorts(passport, null);

			String[] extraPara = new String[1];
			extraPara[0] = Config.getInstance().getServerIP();
			DeviceUtil.initSyslogngConfig(passport, extraPara);
			
			List<Device> dvlist = DeviceService.getInstance().retrieveDevicesFromDigi(passport);

			this.getPassportService().populateDigiIP(passport);
			this.getPassportService().populateDigiPPP(passport);
			
			this.getPassportService().populateSyslogngSetting(passport);
			// this.getPassportService().populateIpFilterSetting(passport);

			this.getPassportService().save(passport); 
			DeviceService.getInstance().save(dvlist);
			
		} catch (Exception e) {
			// e.printStackTrace();
			this.setJsonString("{success:false, error:{reason:'" + e.getMessage()+"'}}" );
		}
		return SUCCESS;
	}
	
	public String updatePassport(){
		String deptname = this.passport2.getDept().getDeptname().trim();
		String sitename = this.passport2.getSite().getSitename().trim();
		
		System.out.println(this.passport2.getIp() + "---"
				+ this.passport2.getHostname()  + "---" 
				+ deptname + "---" + sitename);

		this.setJsonString("{success:true}");
		
		try {
			this.passport = this.passportService.findById(passport2.getPassportid());
			if (null == passport)
				return INPUT;
			
			if(deptname.length()>0)
			{
				Dept dept = deptService.findDeptByDeptname(deptname);
				this.passport.setDept(dept);
			}
			else 
				this.passport.setDept(null);
			
			if (sitename.length()>0)
			{
				Site site= siteService.findBySitename(sitename);
				this.passport.setSite(site);
			}
			else
				this.passport.setSite(null);
			
			this.passport.setGivenname(passport2.getGivenname());
			this.passport.setHostname(passport2.getHostname());
			this.passport.setIp(passport2.getIp());
			this.passport.setOwner(passport2.getOwner());
			this.passport.setRootpwd(passport2.getRootpwd());
			this.passport.setPppnumber(passport2.getPppnumber());
			
			this.getPassportService().save(passport); 
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
	public String removePassport()
	{
		try { 
			// this.getPassportService().removeById();
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
	/* input from request:  passportIP
	 * read information from digi passport.
	 */
	@SuppressWarnings("unchecked")
	public String getPassportPortsList22()  
	{
		List ports = null;
		try {
			passport = this.passportService.findByIP(passport.getIp());
			if (passport!=null)
				ports = DeviceUtil.getPassportPortsList(passport);
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}

		if (ports == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}

		this.setTotalCount(ports.size());
		JSONArray array = JSONArray.fromObject(ports); 
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}"); 

		return SUCCESS ;
	}
	
	/* input from request:  passportIP
	 * read information from database.
	 */
	public String getPassportPortsList()  
	{
		List<Device> ports = null;
		try {
			passport = this.passportService.findByIP(passport.getIp());
			if (passport!=null)
				ports = DeviceService.getInstance().findByPassportId(passport.getPassportid());
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}
		
		if (ports == null){
			this.setJsonString("{success:false,totalCount : 0, list:[]}");
			return SUCCESS ;
		}

		this.setTotalCount(ports.size());
		JSONArray array = JSONArray.fromObject(ports); 
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}"); 

		return SUCCESS ;
	}
	
	public String getPassportIpList()  
	{
		List<String> iplist = null;
		try {
			iplist = this.passportService.findAllIP(); 
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}

		if (iplist == null || iplist.isEmpty()){
			this.setJsonString("{success:false,totalCount : 0, list:[]}");
			return SUCCESS ;
		}

		this.setTotalCount(iplist.size());
		// JSONArray array = JSONArray.fromObject(iplist); 
		// list:["192.168.0.8","192.168.161.5","192.168.0.170","16.157.130.4","210.82.86.188"]
		StringBuilder sb = new StringBuilder(500);
		int i = 0;
		for (String ip : iplist){
			if (i!=0)
				sb.append(", ");
			sb.append("{ip : '");
			sb.append(ip);
			sb.append("'}");
			++i;
		}
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:[" + sb.toString() + "]}"); 

		return SUCCESS ;
	}
	public Passport getPassport() {
		return passport;
	}

	public void setPassport(Passport passport) {
		this.passport = passport;
	}

	public Passport getPassport2() {
		return passport2;
	}

	public void setPassport2(Passport passport) {
		this.passport2 = passport;
	}
	
	public List<Passport> getPassports() {
		return passports;
	}

	public void setPassports(List<Passport> passports) {
		this.passports = passports;
	}

	public IPassportService getPassportService() {
		return passportService;
	}

	public void setPassportService(IPassportService passportService) {
		this.passportService = passportService;
	}
	public IDeptService getDeptService() {
		return deptService;
	}

	public void setDeptService(IDeptService deptService) {
		this.deptService = deptService;
	}

	public ISiteService getSiteService() {
		return siteService;
	}

	public void setSiteService(ISiteService siteService) {
		this.siteService = siteService;
	}
	
	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
