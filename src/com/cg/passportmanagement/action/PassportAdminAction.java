package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;
import net.sf.json.JSONArray;
import com.cg.passportmanagement.common.DeviceUtil;
import com.cg.passportmanagement.common.SessionUtil;
import com.cg.passportmanagement.common.Util;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.District;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.Site;
import com.cg.passportmanagement.database.User; 
import com.cg.passportmanagement.database.UserPassportAcl;
import com.cg.passportmanagement.digi.DigiBaudRate;
import com.cg.passportmanagement.digi.DigiConnectionError;
import com.cg.passportmanagement.digi.DigiIP;
import com.cg.passportmanagement.digi.DigiPPP;
import com.cg.passportmanagement.digi.DigiUser;
import com.cg.passportmanagement.service.IDeviceService;
import com.cg.passportmanagement.service.IPassportService;
import com.cg.passportmanagement.service.IUserService;
import com.opensymphony.xwork2.ActionSupport;

/*
 *  PassportAdminAction is configured as prototype in spring IoC 
 */

public class PassportAdminAction extends ActionSupport {
	private static final long serialVersionUID = 1L;
	private User user = null; 
	private IUserService userService = null;
	
	private transient Passport passport = null; 
	
	// for change port title
	private transient Integer passportid = null; 
	private transient Integer portid = null; 
	private transient String newtitle = null;
	
	// for change port baudrate
	private transient DigiBaudRate baudrate = null;
	
	// for change ip address
	private transient String newIP = null;
	private transient String newNetMask = null;
	private transient String newGateway = null;
	
	private IPassportService passportService = null;
	private IDeviceService deviceService = null;
	
	private String jsonString = "";

	public String execute(){	
		return SUCCESS;
	}

	/**
	 * Passport Administrator Tree Initialize
	 * @return Action.SUCCESS or ....
	 * @jsonString : property of this object:
	 * [{
	        id: 1,
	        text: 'A leaf Node',
	        leaf: true
	    	},{
	        id: 2,
	        text: 'A folder Node',
	        children: [{
	            id: 3,
	            text: 'A child Node',
	            leaf: true
	        }]
   		}]
	 * @throws Exception
	 */
	public String loadPassportTree2() throws Exception { 
		User sUser = SessionUtil.getLoginUser();

		if (sUser == null)
		{
			System.out.println("========== Initializing Passport Tree failed, not logged in =============");
			return SUCCESS;
		}

		user = sUser;
		System.out.println("======= Initializing Passport Tree.  Userid = " + this.user.getUserid() + "=============");

		List<UserPassportAcl> lists;
		List<Passport> passportLists = new ArrayList<Passport>(0);
		
		try {
			lists = this.getUserService().findPassportsByUserId(this.user.getUserid());
			
			if (lists != null){
				for (int i=0; i < lists.size(); i++) {
					passportLists.add(lists.get(i).getPassport());
				}				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		String jsRoot = 
				"id: 'passport-admin-root' , " +
				"text: '应急通道设备', " +
				"leaf: false, " +
				"expanded: true"; // children
		
		String jsPassports = "";
		
		for(int i=0; i < passportLists.size(); i++){
			if ( i>0 ) jsPassports += ", "; 
			jsPassports += 
				"{" +
				"id: 'passport_" + i + "'," +
				"text: '" + passportLists.get(i).getGivenname() + " (" + passportLists.get(i).getIp() + ")" + "', " +
				"leaf:true, " + 
				"ip: '" + passportLists.get(i).getIp() + "'," + 
				"givenname: '" + passportLists.get(i).getGivenname() + "'" + 
				"}"; 	
		}
		String jsTree = "[{" + jsRoot + ", " + "children: [" + jsPassports + "]" + " }]";
		this.setJsonString(jsTree);

		System.out.println(this.getJsonString());
		return SUCCESS;  
	}

	/*
	 * Action: passportTreeLoader.action
	 * group by district/site
	 */
	public String loadPassportTree() throws Exception { 
		System.out.println("======= Initializing Passport Tree ==========");

		List<Passport> passportLists = this.getPassportService().findAll();
		
		List<District> districtList = new ArrayList<District>(10);
		List<Site> siteList = new ArrayList<Site>(0);
		
		Site site = null;
		for (int i=0; i < passportLists.size(); i++){
			site = passportLists.get(i).getSite();
			if (site!=null && !siteList.contains(site))
				siteList.add(site);
		}

		District district = null;
		for (int i=0; i < siteList.size(); i++){
			district = siteList.get(i).getDistrict();
			if (district!=null && !districtList.contains(district))
				districtList.add(district);
		}

		String jsSite="";
		String jsPassport=new String();
		String jsDistrict="";
		
		for (int i=0; i < districtList.size(); i++ ){
			jsSite = "";
			district = districtList.get(i);
			for (int j=0; j < siteList.size(); j++){
				site = siteList.get(j);
				if (site.getDistrict() == district){	
					jsPassport = "";
					for (int k=0; k < passportLists.size(); k++)
					{
						Passport ppt = passportLists.get(k);				
						if (ppt.getSite() == site){
							if ( jsPassport.length()>0 ) jsPassport += ",\n\t\t"; 
							jsPassport += 
								"{" +
								// "id: 'passport_" + k + "'," +
								"text: '" + ppt.getGivenname() + " (" + ppt.getIp() + ")" + "', " +
								"leaf:true, " + 
								"ntype : 'passport', " + 
								"passportid : '" +  ppt.getPassportid()  + "', " + 
								"ip: '" + ppt.getIp() + "', " + 
								"givenname: '" + ppt.getGivenname() + "'" + 
								"}";

							passportLists.remove(k);
							--k; 
						}
					}

					if (jsSite.length()>0) jsSite += ",\n\t";
					jsSite += "{ text : '" + site.getSitename() + "', leaf : false, " + 
							"ntype : 'site', " + 
							"siteid : '" + site.getSiteid() + "', expanded: true, children : [\n\t\t" + jsPassport + "]}";

					siteList.remove(j);
					--j;
				}
			}
			if (i!=0)
				jsDistrict += ",\n";
			jsDistrict += "{ text : '" + district.getDistrictname() + "', leaf : false, " + 
							"ntype : 'district', " +
							"districtid : '" + district.getDistrictid() + 
							"', expanded:true, children : [\n\t" + jsSite + "]}";
		}
		
		String jsRoot = 
				// "id: 'passport-admin-root' , \n" +
				"text: '应急通道设备', \n" +
				"leaf: false, \n" +
				"ntype: 'root', \n" + 
				"expanded: true, \n"; // children
		
		String jsTree = "[{" + jsRoot + "children: [ \n" + jsDistrict + "]" + " }]";
		this.setJsonString(jsTree);

		// System.out.println(this.getJsonString());
		return SUCCESS;  
	}	

	/*
	 * Action: loadPptTreeForLogview.action
	 * group by district/site
	 */ 
	public String loadPptTreeForLogview() throws Exception { 
		System.out.println("======= Load Passport Tree for logview ==========");

		List<Passport> passportLists = this.getPassportService().findAll();
		
		List<District> districtList = new ArrayList<District>(10);
		List<Site> siteList = new ArrayList<Site>(0);
		
		Site site = null;
		for (int i=0; i < passportLists.size(); i++){
			site = passportLists.get(i).getSite();
			if (site!=null && !siteList.contains(site))
				siteList.add(site);
		}

		District district = null;
		for (int i=0; i < siteList.size(); i++){
			district = siteList.get(i).getDistrict();
			if (district!=null && !districtList.contains(district))
				districtList.add(district);
		}

		String jsSite="";
		String jsPassport=new String();
		String jsDistrict="";
		
		for (int i=0; i < districtList.size(); i++ ){
			jsSite = "";
			district = districtList.get(i);
			for (int j=0; j < siteList.size(); j++){
				site = siteList.get(j);
				if (site.getDistrict() == district){	
					jsPassport = "";
					for (int k=0; k < passportLists.size(); k++)
					{
						Passport ppt = passportLists.get(k);				
						if (ppt.getSite() == site){
							if ( jsPassport.length()>0 ) jsPassport += ",\n\t\t"; 
							jsPassport += 
								"{" +
								// "id: 'passport_" + k + "'," +
								"text: '" + ppt.getGivenname() + " (" + ppt.getIp() + ")" + "', " +
								"leaf:true, " + 
								"ntype : 'passport', " + 
								"passportid : '" +  ppt.getPassportid()  + "', " + 
								"ip: '" + ppt.getIp() + "', " + 
								"givenname: '" + ppt.getGivenname() + "'" + 
								"}";

							passportLists.remove(k);
							--k; 
						}
					}

					if (jsSite.length()>0) jsSite += ",\n\t";
					jsSite += "{ text : '" + site.getSitename() + "', leaf : false, " + 
							"ntype : 'site', " + 
							"siteid : '" + site.getSiteid() + "', expanded: true, children : [\n\t\t" + jsPassport + "]}";

					siteList.remove(j);
					--j;
				}
			}
			if (i!=0)
				jsDistrict += ",\n";
			jsDistrict += "{ text : '" + district.getDistrictname() + "', leaf : false, " + 
							"ntype : 'district', " +
							"districtid : '" + district.getDistrictid() + 
							"', expanded:true, children : [\n\t" + jsSite + "]}";
		}
		
		String jsRoot = 
				// "id: 'passport-admin-root' , \n" +
				"text: '应急通道设备日志', \n" +
				"leaf: false, \n" +
				"ntype: 'root', \n" + 
				"expanded: true, \n"; // children
		
		String jsTree = "[{text: '管理平台日志', leaf: true, ntype: 'platform' }, {" + jsRoot + "children: [ \n" + jsDistrict + "]" + " }]";
		this.setJsonString(jsTree);

		// System.out.println(this.getJsonString());
		return SUCCESS;  
	}
	
	public String loadDeviceTree() throws Exception {

		User sUser = SessionUtil.getLoginUser();
		if (sUser == null)
		{
			System.out.println("========== Initializing Device Tree failed, not logged in =============");
			return SUCCESS;
		}

		user = sUser;
		System.out.println("======= Initializing Device Tree.  Userid = " + this.user.getUserid() + "=============");

		String jsRoot = 
			"id: 'device-operation-root' , \n" +
			"text: '应急通道设备', \n" +
			"leaf: false, \n" +
			"ntype: 'root', \n" + 
			"expanded: true, \n"; // children
	
		List<Device> deviceLists;
		
		try {
			if ("root".compareTo(user.getUserid())==0)
				deviceLists = getDeviceService().findAll();
			else
				deviceLists = this.getDeviceService().findByUserId(this.user.getUserid());
		} catch (Exception e) {
			e.printStackTrace();
			
			String jsTree = "[{" + jsRoot + "children: []" + " }]";
			this.setJsonString(jsTree);
			
			return SUCCESS;
		}
		
		List<District> districtList = new ArrayList<District>(10);
		List<Site> siteList = new ArrayList<Site>(0);
		
		Site site = null;
		for (int i=0; i < deviceLists.size(); i++){
			site = deviceLists.get(i).getId().getPassport().getSite();
			if (site!=null && !siteList.contains(site))
				siteList.add(site);
		}

		District district = null;
		for (int i=0; i < siteList.size(); i++){
			district = siteList.get(i).getDistrict();
			if (district!=null && !districtList.contains(district))
				districtList.add(district);
		}

		String jsSite="";
		String jsDevice=new String();
		String jsDistrict="";
		
		for (int i=0; i < districtList.size(); i++ ){
			jsSite = "";
			district = districtList.get(i);
			for (int j=0; j < siteList.size(); j++){
				site = siteList.get(j);
				if (site.getDistrict() == district){	
					jsDevice = "";
					for (int k=0; k < deviceLists.size(); k++)
					{
						Device dvc = deviceLists.get(k);
						Passport pt = dvc.getId().getPassport();
						if (pt.getSite() == site){
							if ( jsDevice.length()>0 ) jsDevice += ",\n\t\t"; 
							jsDevice += 
								"{" +
								// "id: 'passport_" + k + "'," +
								"text: '" + dvc.getTitle() + " (" + pt.getIp() + ")" + "', " +
								"leaf:true, " + 
								"ntype : 'device', " + 
								"ip: '" + pt.getIp() + "', " +
								"port: '" + dvc.getPort() + "', " +
								"passportid: '" + pt.getPassportid() + "', " +
								"portid: '" + dvc.getId().getPortid() + "' " +
								"}";

							deviceLists.remove(k);
							--k; 
						}
					}

					if (jsSite.length()>0) jsSite += ",\n\t";
					jsSite += "{ text : '" + site.getSitename() + "', leaf : false, " + 
							"ntype : 'site', " + 
							"siteid : '" + site.getSiteid() + "', expanded: "+ ((i+j)==0? "true":"false") + ", children : [\n\t\t" + jsDevice + "]}";

					siteList.remove(j);
					--j;
				}
			}
			if (i!=0)
				jsDistrict += ",\n";
			jsDistrict += "{ text : '" + district.getDistrictname() + "', leaf : false, " + 
							"ntype : 'district', " +
							"districtid : '" + district.getDistrictid() + 
							"', expanded:true, children : [\n\t" + jsSite + "]}";
		}
		
		String jsTree = "[{" + jsRoot + "children: [ \n" + jsDistrict + "]" + " }]";
		this.setJsonString(jsTree);

		// System.out.println(this.getJsonString());
		return SUCCESS;  
	}
	
	public String getLoggedUser() throws Exception { 
		List logins = null;
		try {
			passport = this.passportService.findById(passport.getPassportid());
			if (passport!=null)
				logins = DeviceUtil.getLoggedUser(passport);
		} catch (DigiConnectionError e) {
			this.setJsonString("{success:false, error:{reason:'错误原因: " + e.getMessage() + "'}}");
			return SUCCESS ;
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false, error:{reason:'错误原因: 程序异常'}}");
		}
		
		if (logins == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}
 
		JSONArray array = JSONArray.fromObject(logins); 
		this.setJsonString("{success:true,totalCount : " + logins.size()
				+ ", list:" + array.toString() + "}"); 

		return SUCCESS ; 
	}
	
	public String getPortLoggedUser() throws Exception { 
		List<DigiUser> loginsAll = null;
		List<DigiUser> logins = null;
		try {
			passport = this.passportService.findById(passport.getPassportid());
			if (passport!=null)
				loginsAll = DeviceUtil.getLoggedUser(passport);

			String portFilter = "ttyC" + (portid-1);
			logins = new ArrayList<DigiUser>(5);
			for (DigiUser u:loginsAll){
				if(u.getTty().indexOf(portFilter)>=0){
					logins.add(u);
				}
			}
		} catch (DigiConnectionError e) {
			this.setJsonString("{success:false, error:{reason:'错误原因: " + e.getMessage() + "'}}");
			return SUCCESS ;
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false, error:{reason:'错误原因: 程序异常'}}");
		}
		
		if (logins == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}
 
		JSONArray array = JSONArray.fromObject(logins); 
		this.setJsonString("{success:true,totalCount : " + logins.size()
				+ ", list:" + array.toString() + "}"); 

		return SUCCESS ; 
	}
	
	public String getDigiLog() throws Exception{
		List loglines = null;
		try {
			passport = this.passportService.findByIP(passport.getIp());
			if (passport!=null)
				loglines = DeviceUtil.getDigiLog(passport.getIp(), 23, "root", passport.getRootpwd(), "Nov 15 20:12:08");
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}
		
		if (loglines == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}
 
		JSONArray array = JSONArray.fromObject(loglines); 
		this.setJsonString("{success:true,totalCount : " + loglines.size()
				+ ", list:" + array.toString() + "}"); 
		
		return SUCCESS;
	}
	/*
	 *  parameters:
	 *  	passport.passportid
	 */
	public String getDigiIP() throws Exception{
		DigiIP di = null;
		try {
			passport = this.passportService.findById(passport.getPassportid());
			if (passport!=null)
				di = DeviceUtil.getDigiIP(passport);
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}
		
		if (di == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}
 
		JSONArray array = JSONArray.fromObject(di); 
		this.setJsonString("{success:true,totalCount : 1, list:" + array.toString() + "}"); 
		
		return SUCCESS;
	}
	/*
	 *  parameters:
	 *  	passport.passportid
	 */
	public String getDigiPPP() throws Exception{
		DigiPPP ppp = null;
		try {
			passport = this.passportService.findById(passport.getPassportid());
			if (passport!=null)
				ppp = DeviceUtil.getDigiPPP(passport);
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}
		
		if (ppp == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}
 
		JSONArray array = JSONArray.fromObject(ppp); 
		this.setJsonString("{success:true,totalCount : 1, list:" + array.toString() + "}"); 
		
		return SUCCESS;
	}
	/*
	 *  parameters:
	 *  	passport.passportid
	 */
	public String getDigiIpFilter()  
	{
		List filters = null;
		try {
			passport = this.passportService.findById(passport.getPassportid());
			if (passport!=null)
				filters = DeviceUtil.getDigiIpFilter(passport );
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}
		
		if (filters == null){
			this.setJsonString("{success:true,totalCount : 0, list:[]}");
			return SUCCESS ;
		}
 
		JSONArray array = JSONArray.fromObject(filters); 
		this.setJsonString("{success:true,totalCount : " + filters.size()
				+ ", list:" + array.toString() + "}"); 

		return SUCCESS ;
	}
	/*
	 *  parameters:
	 *  	passport.passportid
	 */
	public String populateDevices()  
	{
		try {
			passport = this.passportService.findById(passport.getPassportid());
			deviceService.populateDevices(passport);
		} catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false}");
		}
		this.setJsonString("{success:true}");
		return SUCCESS ;
	}
	/*
	 *  parameters:
	 *  	passportid
	 *  	portid
	 *  	newtitle
	 */
	public String renamePortTitle(){
		try {
			if (passportid != null && portid != null && newtitle != null ){
				passport = this.passportService.findById( passportid ); 

				Device device = this.deviceService.findById(passport, portid);
				if (device.getTitle().compareToIgnoreCase(newtitle)==0){
					this.setJsonString("{success:false}");
					return SUCCESS ;
				}
				String[] extraPara = new String[2];
				extraPara[0] = portid.toString();
				extraPara[1] = newtitle;

				int res = DeviceUtil.renamePortTitle(passport, extraPara);
				if (res == 0) {// success
					device.setTitle(newtitle);
					deviceService.save(device);
					this.setJsonString("{success:true}"); 
					return SUCCESS ;
				}
			}
		}catch (DigiConnectionError e) {
			this.setJsonString("{success:false, error:{reason:'错误原因: " + e.getMessage() + "'}}");
			return SUCCESS ;
		}catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false, error:{reason:'程序错误, 请重试'}}");
			return SUCCESS ;
		}
		this.setJsonString("{success:false}");
		return SUCCESS ;
	}

	/*
	 *  parameters:
	 *  	passportid
	 *  	portid
	 *  	newtitle
	 */
	public String setPortBaudrate(){
		try {
			if (passportid != null && portid != null && 
					baudrate != null && 
					baudrate.baudrate != null &&  baudrate.databit != null &&
					baudrate.parity != null && baudrate.stopbit != null &&
					baudrate.flowcontrol != null ){
				passport = this.passportService.findById( passportid ); 

				Device device = this.deviceService.findById(passport, portid);
				if (device==null){
					this.setJsonString("{success:false, error{reason:{not found}}");
					return SUCCESS ;
				}
				DigiBaudRate selector = baudrate.translate();
				if (selector==null){
					this.setJsonString("{success:false, error{reason:{parameter error}}");
					return SUCCESS ;
				}
				
				String[] extraPara = new String[6];
				extraPara[0] = portid.toString();
				extraPara[1] = selector.baudrate;
				extraPara[2] = selector.databit;
				extraPara[3] = selector.parity;
				extraPara[4] = selector.stopbit;
				extraPara[5] = selector.flowcontrol;

				int res = DeviceUtil.setPortBaudrate(passport, extraPara);
				if (res == 0) {// success
					String serial_setting = baudrate.getDescString();
					device.setSerial_setting(serial_setting);
					deviceService.save(device);
					this.setJsonString("{success:true, new_serial_setting:'" + serial_setting +"'}"); 
					return SUCCESS ;
				}
			}
		} catch (DigiConnectionError e) {
			this.setJsonString("{success:false, error:{reason:'错误原因: " + e.getMessage() + "'}}");
			return SUCCESS ;
		}
		catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false, error:{reason:'程序错误, 请重试'}}");
			return SUCCESS ;
		}
		this.setJsonString("{success:false, error:{reason:'程序错误'}}");
		return SUCCESS ;
	}
	/*
	 *  parameters:
	 *  	passportid
	 *  	new ip
	 *  	new net mask
	 *  	new gateway
	 */
	public String setPassportIP(){
		try {
			if (passportid != null && newIP != null && 
					newNetMask != null && newGateway != null ){

				if (!Util.isValidIP(newIP) || !Util.isValidIP(newNetMask) || !Util.isValidIP(newGateway) ){
					this.setJsonString("{success:false, error:{reason:'无效IP地址或者掩码'}}");
					return SUCCESS ;
				}
				
				passport = this.passportService.findById( passportid ); 
				Passport passport2 = null;
				try{
					passport2 = passportService.findByIP(newIP);
				}catch (Exception e){
					passport2 = null;
				}
				if (passport2!=null && 
						passport2.getPassportid().intValue() != passport.getPassportid().intValue()){
					this.setJsonString("{success:false, error:{reason:'IP地址已经被系统内其他设备使用'}}");
					return SUCCESS ;
				}

				String[] extraPara = new String[3];
				extraPara[0] = newIP;
				extraPara[1] = newNetMask;
				extraPara[2] = newGateway;

				int res = DeviceUtil.ipconfig(passport, extraPara);
				if (res == 0) {// success
					
					passport.setIp(newIP);
					passport.setSetip(newIP);
					passport.setGateway(newGateway);
					passport.setNetmask(newNetMask);
					passportService.save(passport);

					this.setJsonString("{success:true}"); 
					return SUCCESS ;
				}
			}
		}catch (DigiConnectionError e) {
			this.setJsonString("{success:false, error:{reason:'错误原因: " + e.getMessage() + "'}}");
			return SUCCESS ;
		}catch (Exception e) {
			e.printStackTrace();	
			this.setJsonString("{success:false, error:{reason:'程序错误, 请重试'}}");
			return SUCCESS ;
		}
		this.setJsonString("{success:false, error:{reason:'输入无效, 请重试'}}}");
		return SUCCESS ;
	}
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getJsonString() {
		return jsonString;
	}

	public void setJsonString(String jsonString) {
		this.jsonString = jsonString;
	}
	public IUserService getUserService() {
		return userService;
	}

	public void setUserService(IUserService userService) {
		this.userService = userService;
	}

	public Passport getPassport() {
		return passport;
	}

	public void setPassport(Passport passport) {
		this.passport = passport;
	}

	public IPassportService getPassportService() {
		return passportService;
	}

	public void setPassportService(IPassportService passportService) {
		this.passportService = passportService;
	}

	public IDeviceService getDeviceService() {
		return deviceService;
	}

	public void setDeviceService(IDeviceService deviceService) {
		this.deviceService = deviceService;
	}

	public String getNewtitle() {
		return newtitle;
	}

	public void setNewtitle(String newPortTitle) {
		this.newtitle = newPortTitle;
	}

	public Integer getPassportid() {
		return passportid;
	}

	public void setPassportid(Integer passportid) {
		this.passportid = passportid;
	}

	public Integer getPortid() {
		return portid;
	}

	public void setPortid(Integer portid) {
		this.portid = portid;
	}

	public DigiBaudRate getBaudrate() {
		return baudrate;
	}

	public void setBaudrate(DigiBaudRate baudrate) {
		this.baudrate = baudrate;
	}

	public String getNewIP() {
		return newIP;
	}

	public void setNewIP(String newIP) {
		this.newIP = newIP;
	}

	public String getNewNetMask() {
		return newNetMask;
	}

	public void setNewNetMask(String newNetMask) {
		this.newNetMask = newNetMask;
	}

	public String getNewGateway() {
		return newGateway;
	}

	public void setNewGateway(String newGateway) {
		this.newGateway = newGateway;
	}

}
