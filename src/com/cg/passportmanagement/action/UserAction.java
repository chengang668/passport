package com.cg.passportmanagement.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import org.apache.struts2.ServletActionContext;

import com.cg.passportmanagement.common.DeviceUtil;
import com.cg.passportmanagement.common.SessionUtil;
import com.cg.passportmanagement.common.Config;
import com.cg.passportmanagement.common.Util;
import com.cg.passportmanagement.dao.LogsDAO;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.Groups;
import com.cg.passportmanagement.database.Logs;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.database.UserGroup;
import com.cg.passportmanagement.database.UserPassportAcl;
import com.cg.passportmanagement.database.UserPassportAclId;
import com.cg.passportmanagement.service.DeviceService;
import com.cg.passportmanagement.service.GroupService;
import com.cg.passportmanagement.service.IUserService;
import com.cg.passportmanagement.service.PassportService;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  UserAction is configured as prototype in spring IoC 
 */

public class UserAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private User user = null;
	private User user2 = null; // used for update user
	private List<User> users = new ArrayList<User>(0);
	private IUserService userService = null;
	private String delData;
	private String groupIDs;
	private String passportIDs;
	private int hasDeviceData;
	private String deviceIDs;
	private int passportid;  // for get user-device-acl info.
	private int portid;      // for get user-device-acl info.
	private UserDeviceAcl ud_acl;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.userService.removeUserById(this.getDelData());
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					this.userService.removeUserById(id[i]);
				}
			}
		}
		// HttpSession session = ServletActionContext.getRequest().getSession();
		// Object o = null;// session.getAttribute("User_Data1");
		try {
			this.users = this.getUserService().findAllUsers();
			// session.setAttribute("User_Data1", this.users);
			System.out.println("query database");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		JsonConfig config = new JsonConfig();
		config.setJsonPropertyFilter(new PropertyFilter(){
		    public boolean apply(Object source, String name, Object value) {
		        if(name.equals("passwd") || name.equals("oldpasswds")) { //要过滤的 
		            return true;
		        } else {
		            return false;
		        }
		    }
		});           
		
		this.setTotalCount(this.users.size());
		JSONArray array = JSONArray.fromObject(this.users, config);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}

	/**
	 * Find an entity by its id (primary key).
	 * 
	 * @param id
	 * @return The found entity instance or null if the entity does not exist.
	 */
	public String findUserById(String id) {
		try {
			this.user = this.getUserService().findUserById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.users);
		this.setJsonString(array.toString());
		return SUCCESS;
	}

	public String findUserById() {
		System.out.println(this.user.getUserid());
		try {
			this.user = this.getUserService().findUserById(	this.user.getUserid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.user);
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}
	
	public String getCurrentUser(){
		HttpSession session = ServletActionContext.getRequest().getSession();
		Object sUser = SessionUtil.getLoginUser(session);

		if (sUser == null || ! (sUser instanceof User) )
		{
			this.setJsonString("{success:false,totalCount:0,list:[]}");
 			return SUCCESS;
		}
		
		JsonConfig config = new JsonConfig();
		config.setJsonPropertyFilter(new PropertyFilter(){
		    public boolean apply(Object source, String name, Object value) {
		        if(name.equals("passwd") || name.equals("oldpasswds")) { //要过滤的 
		            return true;
		        } else {
		            return false;
		        }
		    }
		}); 
		
		JSONArray array = JSONArray.fromObject(sUser, config);
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		
		System.out.println(array.toString());
		
		return SUCCESS;
	}

	/*
	 * Action : "GetPassportsOfUser"
	 */
	private List<Passport> findPassportsByUserId(String userid){
		List<UserPassportAcl> lists;
		List<Passport> passportLists = new ArrayList<Passport>(0);
		try {
			lists = this.getUserService().findPassportsByUserId(userid);
			
			if (lists != null){
				for (int i=0; i < lists.size(); i++) {
					passportLists.add(lists.get(i).getPassport());
				}				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return passportLists;
	}
	
	private List<Device> findDevicesByUserId(String userid){
		List<UserDeviceAcl> lists;
		List<Device> deviceLists = new ArrayList<Device>(0);
		try {
			lists = this.getUserService().findDevicesByUserId(userid);
			
			if (lists != null){
				for (int i=0; i < lists.size(); i++) {
					deviceLists.add(lists.get(i).getDevice());
				}				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return deviceLists;
	}
	
	// for struts action 
	public String getUserDeviceInfo(){
		UserDeviceAcl acl = null; 
		String errorStr = "{success:false,totalCount:0,list:[], error:{reason:'您没有对该设备的访问权限，请联系系统管理员'}}";
		try {
			String userid;
			if (user==null){
				HttpSession session = ServletActionContext.getRequest().getSession();
				user = SessionUtil.getLoginUser(session);
			}
			userid = user.getUserid();

			System.out.println("======= getUserDeviceInfo: userid=" + userid + 
					", passportid: "+ passportid + ", portid: " + portid + " =============");
	 
			acl = DeviceService.getInstance().findUserDeviceInfo(userid, passportid, portid);
			
			if (acl != null){
				JSONArray array = JSONArray.fromObject(acl);
				this.setJsonString("{success:true,totalCount:1,list:" + array.toString() + "}");
				
				System.out.println(array.toString());
			}
			else 
				this.setJsonString(errorStr);
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString(errorStr);
		}
		return SUCCESS;
	}
	
	// for struts action 
	/* input:
	 *  user.userid  [optional]
	 *  passportid
	 *  portid
	 *  ud_acl.loginname
	 *  ud_acl.pwd
	 */
	
	public String saveUserDeviceInfo(){
		UserDeviceAcl acl = null; 
		try {
			String userid;
			if (user==null){
				HttpSession session = ServletActionContext.getRequest().getSession();
				user = SessionUtil.getLoginUser(session);
			}
			userid = user.getUserid();
			// passportid = ud_acl.getDevice().getId().getPassport().getPassportid();
			// portid = ud_acl.getDevice().getId().getPortid();
			String loginname = ud_acl.getUsername();
			String pwd = ud_acl.getPwd();

			System.out.println("======= saveUserDeviceInfo: userid=" + userid + 
					", passportid: "+ passportid + 
					", portid: " + portid + 
					", loginname: " + loginname +
					", password: " + pwd + " =============");
	 
			acl = DeviceService.getInstance().findUserDeviceInfo(userid, passportid, portid);
			
			if (acl != null){
				acl.setUsername(loginname);
				acl.setPwd(pwd);
				
				DeviceService.getInstance().saveUserDeviceInfo(acl);
				// JSONArray array = JSONArray.fromObject(acl);
				// this.setJsonString("{success:true,totalCount:1,list:" + array.toString() + "}");
				this.setJsonString("{success:true}"); 
			}
			else 
				this.setJsonString("{success:false, error:{reason:'您没有对该设备的访问权限，请联系系统管理员'}}");
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
	private String genPptUserPwd (String usrpwd){
		return "CDE#" + usrpwd + "xsw@";
	}
	
	// for struts action 
	public String getSSHinfo(){
		UserPassportAcl passportAcl = null; 
		UserDeviceAcl deviceAcl = null; 
		Passport passport = null;
		String errorStr = "您可能没有访问该设备的权限，请联系系统管理员。";

		try {
			String userid;
			if (user==null){
				HttpSession session = ServletActionContext.getRequest().getSession();
				user = SessionUtil.getLoginUser(session);
			}
			userid = user.getUserid();

			System.out.println("======= getSSHinfo: userid=" + userid + 
					", passportid: "+ passportid + ", portid: " + portid + " =============");

			deviceAcl = DeviceService.getInstance().findUserDeviceInfo(userid, passportid, portid);

			// if no user-device acl, and not root, reject 
			if (deviceAcl == null && userid.compareTo("root")!=0){
				this.setJsonErrorResponse(errorStr);
				return SUCCESS;
			}

			passportAcl = PassportService.getInstance().getUserPassportAcl(userid, passportid);
			if ((passportAcl == null || 
					passportAcl.getUsername()==null || 
					passportAcl.getUsername().trim().isEmpty() ||
					passportAcl.getPwd() == null ||
					passportAcl.getPwd().trim().isEmpty() ) 
				&& userid.compareTo("root")!=0 ){
				// non-root user accesses for the first time, the user has User-Device ACL,
				// so we should add a new user in passport system, and create a new User-Passport ACL
				
				passport = PassportService.getInstance().findById(passportid);
				
				// add a new user in passport and save in acl
				/* String pwdSuffix = "";
				if (user.getPasswd()!=null)
					pwdSuffix = user.getPasswd().trim().substring(0, 6);
				*/

				String pptPwd = genPptUserPwd(user.getPasswd());
				String[] extraPara = new String[2];
				extraPara[0] = userid;
				// extraPara[1] = "ZAQ!2wsxCDE#" + pwdSuffix + "";
				// extraPara[1] = user.DecodedPasswd();
				extraPara[1] = pptPwd;
				
				int res = DeviceUtil.addUser(passport, extraPara);
				if (res==0) // success
				{
					passportAcl = new UserPassportAcl();
					UserPassportAclId upaclid = new UserPassportAclId(userid, passportid);
					passportAcl.setId(upaclid);
					passportAcl.setPassport(passport);
					passportAcl.setUser(user);
					passportAcl.setUsername(userid);
					passportAcl.setPwd(pptPwd);
					PassportService.getInstance().saveUserPassportAcl(passportAcl);
				}
			}
			passport = passportAcl.getPassport();
			// if device has only telnet access, make it SSH
			Device device = deviceAcl.getDevice();
			if (device.getProtocol().trim().compareToIgnoreCase("SSH")!=0){
				String[] extraPara = new String[2];
				extraPara[0] = String.valueOf( portid );
				extraPara[1] = "SSH";
				DeviceUtil.changePortProtocol(passport, extraPara);
				
				device.setProtocol("SSH");
				DeviceService.getInstance().save(device);
			}

			// plink -pw root root@192.168.0.126 "plink -pw chengang2 chengang2@192.168.0.5 -P 7001"
			// String cmdline = buildCommandLineWithPlink(passportAcl, deviceAcl);
			// this.setJsonString("{success:true, commandline:'" + cmdline + "'}");
			String accessInfo = buildCommandLineWithSecureCRT(passportAcl, deviceAcl);
			System.out.println("SecureCRT Access Info: " + accessInfo);

			// check if the passport is alive by ping ...
			boolean pptReachable = Util.ping(passport.getIp());
			String strReachable = " pptReachable: " + pptReachable;
			
			this.setJsonString("{success:true, " + strReachable + ", " + accessInfo + "}");
			
			// log in the system log
			
			Logs loginLog = new Logs();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date now = new Date();
			loginLog.setDatetime(df.format(now));
			loginLog.setHost("platform");
			loginLog.setFacility("port login");
			loginLog.setLevel("info");
			loginLog.setPriority("1");
			loginLog.setTag("port");
			loginLog.setProgram(user.getUserid());
			String ipAddr = ServletActionContext.getRequest().getRemoteAddr(); 
			loginLog.setMsg("platform: " + user.getUserid() + 
					" login \"" + device.getTitle() + "\"" + 
					" (" + passport.getIp() + ":" + device.getPort() + ")" + 
					" from: \"" + ipAddr + "\" at: " + loginLog.getDatetime());
			LogsDAO.getInstance().save(loginLog);
		} catch (Exception e) {
			// e.printStackTrace();
			this.setJsonErrorResponse(errorStr + e.getMessage());
		}
		
		return SUCCESS;
	}
	
	@SuppressWarnings("unused")
	private String buildCommandLineWithPlink(UserPassportAcl passportAcl, UserDeviceAcl deviceAcl){
		// plink -pw root root@192.168.0.126 "plink -pw chengang2 chengang2@192.168.0.5 -P 7001"

		Passport passport = passportAcl.getPassport();
		
		String username = passportAcl.getUsername();
		String pwd = passportAcl.getPwd(); // DecodedPwd();
		if (pwd==null) // root can have an empty password
			pwd = "";

		StringBuilder sb = new StringBuilder(50);

		sb.append("plink -pw \"");
		sb.append(pwd + "\" ");
		sb.append(username);
		sb.append("@");
		sb.append(passport.getIp());
		sb.append(" -P ");
		sb.append(deviceAcl.getDevice().getPort());

		String cmdline = sb.toString();

		if (Config.getInstance().getDirectConnectToPassport() == false){
			sb = new StringBuilder(50);
			sb.append("plink -pw \"" + Config.getInstance().getSshPassword() + "\" ");
			sb.append(Config.getInstance().getSshUser());
			sb.append("@");
			sb.append(Config.getInstance().getServerIP());
			sb.append(" ");
			sb.append(cmdline);
			sb.append(" ");
			cmdline = sb.toString();
		}

		System.out.println("command line: " + cmdline);
		return cmdline;
	}
	
	
	//for Firefox: c:\windows\system32\cmd.exe /c start securecrt /T /script "c:\\cg.vbs" /ssh2 /password "qing$123" zhazhenz@16.157.129.205
	private String buildCommandLineWithSecureCRT(UserPassportAcl passportAcl, UserDeviceAcl deviceAcl){
		// c:\windows\system32\cmd.exe /c start securecrt /T /script "c:\\cg.vbs" /ssh2 /password "qing$123" zhazhenz@16.157.129.205

		Passport passport = passportAcl.getPassport();
		
		String username = passportAcl.getUsername();
		String pwd = passportAcl.getPwd(); // DecodedPwd(); 
		if (pwd==null) // root can have an empty password
			pwd = "";
		
		StringBuilder sb = new StringBuilder(50);

		sb.append("SecureCRT.exe /T /SSH2 /PASSWORD \"");
		sb.append(pwd + "\" ");
		sb.append(username);
		sb.append("@");
		sb.append(passport.getIp());
		sb.append(" /P ");
		sb.append(deviceAcl.getDevice().getPort()); 
		// String cmdline = sb.toString();
		System.out.println(sb);
		
		StringBuilder sbjson = new StringBuilder(50);
		sbjson.append("device: {");
		sbjson.append("username : '");
		sbjson.append(username);
		sbjson.append("', ");
		sbjson.append("pwd : '");
		sbjson.append(pwd);
		sbjson.append("', ");
		sbjson.append("pptip : '");
		sbjson.append(passport.getIp());
		sbjson.append("', ");
		sbjson.append("port : '");
		sbjson.append(deviceAcl.getDevice().getPort());
		sbjson.append("', ");
		sbjson.append("title : '");
		sbjson.append(deviceAcl.getDevice().getTitle());
		sbjson.append("'} ");		

		StringBuilder sbServerAccess = null;
		if (Config.getInstance().getDirectConnectToPassport() == false){
			sb = new StringBuilder(50);
			sb.append("SecureCRT.exe /T /SCRIPT /SSH2 /PASSWORD \"");
			sb.append(Config.getInstance().getSshPassword() + "\" ");
			sb.append(Config.getInstance().getSshUser());
			sb.append("@");
			sb.append(Config.getInstance().getServerIP());
			// sb.append(" ");
			// sb.append(cmdline);
			// sb.append(" ");
			// cmdline = sb.toString();
			System.out.println(sb);
			
			sbServerAccess = new StringBuilder(100);
			sbServerAccess.append("server: {");
			sbServerAccess.append("username : '");
			sbServerAccess.append(Config.getInstance().getSshUser());
			sbServerAccess.append("', ");
			sbServerAccess.append("pwd : '");
			sbServerAccess.append(Config.getInstance().getSshPassword());
			sbServerAccess.append("', ");
			sbServerAccess.append("serverip : '");
			sbServerAccess.append(Config.getInstance().getServerIP());
			sbServerAccess.append("'} ");
		}
		
		StringBuilder rs = new StringBuilder(100);
		rs.append("directaccess: ");
		rs.append(Config.getInstance().getDirectConnectToPassport());
		rs.append(", ");
		rs.append(sbjson);
		
		if (Config.getInstance().getDirectConnectToPassport() == false){
			rs.append(", ");
			rs.append(sbServerAccess);
		}

		return rs.toString();
	}
	
	// for struts action 
	// dial-up a PPP connection to a passport
	public String dialPPP(){
		
		String errorStr = "系统或设备可能出现网络故障，请联系系统管理员。";
		
		try {
			Passport passport = PassportService.getInstance().findById(passportid);
			String pppNum = passport.getPppnumber();
			if (pppNum != null) 
				pppNum = pppNum.trim();
			
			if (pppNum == null || pppNum.isEmpty()){
				errorStr = "应急通道没有设置电话号码，无法拨号，请联系系统管理员";
				this.setJsonErrorResponse(errorStr);
				return SUCCESS;
			}
			String ifcfg = "digi_" + pppNum;
			String res = DeviceUtil.dialupDigi(ifcfg);
			if (res.equals("success"))
				this.setJsonString("{success:true}"); 
			else 
				this.setJsonErrorResponse(res);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			this.setJsonErrorResponse(errorStr + e.getMessage());
			e.printStackTrace();
		}
		return SUCCESS;
	}

	// for struts action 
	// close dial-up a PPP connection to a passport
	public String closePPP(){
		
		String errorStr = "系统或设备可能出现网络故障，请联系系统管理员。";
		
		try {
			Passport passport = PassportService.getInstance().findById(passportid);
			String pppNum = passport.getPppnumber();
			if (pppNum != null) 
				pppNum = pppNum.trim();
			
			if (pppNum == null || pppNum.isEmpty()){
				errorStr = "应急通道没有设置电话号码，无法执行拨号相关操作，请联系系统管理员";
				this.setJsonErrorResponse(errorStr);
				return SUCCESS;
			}
			String ifcfg = "digi_" + pppNum;
			String res = DeviceUtil.dialdownDigi(ifcfg);
			if (res.equals("success"))
				this.setJsonString("{success:true}"); 
			else {
				this.setJsonErrorResponse(res);
				System.out.println(res);
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			this.setJsonErrorResponse(errorStr + e.getMessage());
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
	// this is for superuser to manage user's passport list
	public String findPassportsByUserId() {
		String userid = getUser().getUserid();

		System.out.println("======= Loading User's Passport List.  Userid = " + userid + "=============");
 
		List<Passport> passportLists = findPassportsByUserId(userid);
		
		JSONArray array = JSONArray.fromObject(passportLists);
		this.setJsonString("{success:true,totalCount:" + passportLists.size() + ",list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}
	
	// this is for superuser to manage user's devices list
	public String findDevicesByUserId() {
		String userid = getUser().getUserid();

		System.out.println("======= Loading User's device List.  Userid = " + userid + "=============");
 
		List<Device> devicesLists = findDevicesByUserId(userid);
		
		JSONArray array = JSONArray.fromObject(devicesLists);
		this.setJsonString("{success:true,totalCount:" + devicesLists.size() + ",list:"
				+ array.toString() + "}");
		System.out.println(array.toString());

		return SUCCESS;
	}
	
	// This is for login user to show his passport list
	public String loadPassportsOfLoginUser() {

		HttpSession session = ServletActionContext.getRequest().getSession();
		Object sUser = SessionUtil.getLoginUser(session);

		if (sUser == null || ! (sUser instanceof User) )
		{
			System.out.println("========== Loading User's Passport List failed, not logged in =============");
			return SUCCESS;
		}

		this.setUser((User)sUser);
		System.out.println("======= Loading User's Passport List.  Userid = " + this.getUser().getUserid() + "=============");

		List<Passport> passportLists = findPassportsByUserId(this.getUser().getUserid());

		JSONArray array = JSONArray.fromObject(passportLists);
		this.setJsonString("{success:true,totalCount:" + passportLists.size() + ",list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}
	/*
	 * action : LoadDevicesOfLoginUser
	 */
	// This is for login user to show his device list
	public String loadDevicesOfLoginUser() {

		HttpSession session = ServletActionContext.getRequest().getSession();
		Object sUser = SessionUtil.getLoginUser(session);
		
		List<Device> deviceLists = null;

		if (sUser == null || ! (sUser instanceof User) )
		{
			System.out.println("========== Loading User's Device List failed, not logged in =============");
			this.setJsonString("{success:false,totalCount:0, list:[]}");
			return SUCCESS;
		}

		this.setUser((User)sUser);
		System.out.println("======= Loading User's Device List.  Userid = " + this.getUser().getUserid() + "=============");

		try {
			if ("root".compareTo(user.getUserid())==0){
				deviceLists = DeviceService.getInstance().findAll();
			}else {
				deviceLists = findDevicesByUserId(this.getUser().getUserid());
			}
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false,totalCount:0, list:[]}");
			return SUCCESS;
		}
		JSONArray array = JSONArray.fromObject(deviceLists);
		this.setJsonString("{success:true,totalCount:" + deviceLists.size() + ",list:" + array.toString() + "}");
		System.out.println(array.toString());

		return SUCCESS;
	}
	
	public String findGroupsByUserId() {
		if (this.user==null){ 
			return INPUT; 
		}
		System.out.println( "findGroupsByUserId(): " + this.user.getUserid());
		
		List<UserGroup> lists;
		List<Groups> groupLists = new ArrayList<Groups>(0);
		try {
			lists = this.getUserService().findGroupsByUserId(this.user.getUserid());
			
			if (lists != null){
				for (int i=0; i < lists.size(); i++) {
					groupLists.add(lists.get(i).getGroup());
				}				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(groupLists);
		this.setJsonString("{success:true,totalCount:" + groupLists.size() + ",list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}
	/**
	 * @return Return all persistent instances of the <code>User</code> entity.
	 */
	public String getAllUsers() {
		try {
			this.users = this.getUserService().findAllUsers();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/**
	 * Make the given instance managed and persistent.
	 * 
	 * @return
	 */
	public String persistUser() {
		System.out.println(this.user.getUserid() + "---" + this.user.getFullname() + "---" + this.user.getPasswd() );
		// System.out.println("Group IDs: " + this.getGroupIDs() );
		// System.out.println("Passport IDs: " + this.getPassportIDs());
		System.out.println("Device IDs: " + this.getDeviceIDs());
		
		this.user.setCreatetime(new Date());
		this.user.setStatus(User.USER_STATUS_NEW);
		this.user.EncodePasswd(user.getPasswd());
		
		this.setJsonString("{success:true}");
		try {
			this.getUserService().persistUser(this.getUser());
			// this.getUserService().persistUserGroup(this.getUser(), this.getGroupIDs());
			// this.getUserService().persistUserPassport(this.getUser(), this.getPassportIDs());
			this.getUserService().persistUserDevice(this.getUser(), this.getDeviceIDs());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	public String updateUser() {
		System.out.println(this.user2.getUserid() + "---"
				+ this.user2.getFullname() + "---"
				+ this.user2.getLastlogin());
		
		// System.out.println("Group IDs: " + this.getGroupIDs() );
		// System.out.println("Passport IDs: " + this.getPassportIDs());
		// System.out.println("Device IDs: " + this.getDeviceIDs());
		
		this.setJsonString("{success:true}");
		try {
			this.user = this.getUserService().findUserById(	this.user2.getUserid());
			
			this.user.setFullname( user2.getFullname() );
			if (user.getGroups().getGroupname().compareTo(user2.getGroups().getGroupname())!=0) {
				Groups grp = GroupService.getInstance().findGroupByGroupname(user2.getGroups().getGroupname());
				this.user.setGroups(grp);
			}
			if ( user.getStatus() != User.USER_STATUS_VALID && 
					user2.getStatus() == User.USER_STATUS_VALID ) {
				user.setLoginretry(0);
			}
			user.setStatus(user2.getStatus());
			// this.user.setUserid( user2.getUserid() );

			this.getUserService().persistUser(this.user);
			// this.getUserService().persistUserGroup(this.getUser(), this.getGroupIDs());
			// this.getUserService().persistUserPassport(this.getUser(), this.getPassportIDs());
			if ( hasDeviceData != 0 )
				this.getUserService().persistUserDevice(this.getUser(), this.getDeviceIDs());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
	// Current logged user changes its own pwd.
	// parameter: user : got from session
	// parameter: user.passwd  
	// new password parameter: user2.passwd  
	// 长度至少6位，至少包含数字、字母大小写和特殊符号四种的三种类型
	public String ChangePassword(){
		// System.out.println(" ======== change password ============");
		// System.out.println(this.user.getPasswd() + "---" + this.user2.getPasswd());
		
		// from session 
		User sUsr = SessionUtil.getLoginUser();	
		if (sUsr == null )
		{
			System.out.println("========== Loading User's Passport List failed, not logged in =============");
			return SUCCESS;
		}	
		String userid = sUsr.getUserid();

		// from request
		String oldPwd = user.getPasswd();
		String newPwd = user2.getPasswd();

		this.setJsonString("{success:true}");
		
		try {
			this.user = this.getUserService().findUserById(	userid );

			if (! this.user.DecodedPasswd().equals(oldPwd)){
				// System.out.println("修改密码：原密码错误");
				this.setJsonString("{success:false,error:{reason:'密码错误，请输入正确的原密码'}}");
				return ERROR;
			}
			if (newPwd == null || newPwd.isEmpty()){
				this.setJsonString("{success:false,error:{reason:'密码错误，请输入新密码'}}");
				return ERROR;
			}
			if (newPwd.equals(user.DecodedPasswd()) || 
					user.isInOldPasswds(newPwd)){
				this.setJsonString("{success:false,error:{reason:'密码不能与之前5个密码相同，请重新输入新密码'}}");
				return ERROR;
			} 
			String tip = checkPasswordValid(newPwd);
			if (!tip.equals("valid")){
				this.setJsonString("{success:false,error:{reason:'" + tip + "，请重新输入新密码'}}");
				return ERROR;
			}
			
			// this.user.setPasswd(newPwd);
			this.user.EncodePasswd(newPwd);
			user.setPwdexpiredate( Config.getInstance().getPwdexpiredate());
			if (user.getStatus() == User.USER_STATUS_PWD_EXPIRED )
				user.setStatus( User.USER_STATUS_VALID ); 
			
			this.getUserService().persistUser(this.user);
			SessionUtil.setLoginUser(user);
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false,error:{reason:'程序异常，请咨询管理人员！'}}");
			return ERROR;
		}
		return SUCCESS;
	}

	// Super user changes other's password, no old password needed.
	// parameter: user.userid  
	// new password parameter: user.passwd 
	// 长度至少6位，至少包含数字、字母大小写和特殊符号四种的三种类型
	public String AdminChangePassword(){
		System.out.println(" ======== change password by super user ============");
		System.out.println(this.user.getUserid() + "---"
				+ this.user.getPasswd());
		
		String userid = user.getUserid();
		String newPwd = user.getPasswd();
		
		this.setJsonString("{success:true}");
		
		try {
			this.user = this.getUserService().findUserById(	userid );
			
			if (newPwd == null || newPwd.isEmpty()){
				this.setJsonString("{success:false,error:{reason:'密码错误，请输入新密码'}}");
				return ERROR;
			}
			String tip = checkPasswordValid(newPwd);
			if (!tip.equals("valid")){
				this.setJsonString("{success:false,error:{reason:'" + tip + "，请重新输入新密码'}}");
				return ERROR;
			}
			this.user.setPasswd(newPwd);
			this.user.EncodePasswd(newPwd);
			user.setPwdexpiredate(Config.getInstance().getPwdexpiredate());
			
			this.getUserService().persistUser(this.user);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
	/**
	 * Remove an entity by its id (primary key). *
	 * 
	 * @return
	 */
	public String removeUserById(String id) {
		try {
			this.getUserService().removeUserById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/**
	 * Remove the given persistent instance.
	 * 
	 * CG: Struts Action: remove User
	 * Param : user.userid
	 */
	public String removeUser() {
		this.setJsonString("{success:true}");
		
		try {
			this.getUserService().removeUserById(this.getUser().getUserid());
			//if (res == 1)
			//	this.setJsonString("{success:false, error:{reason:'请先删除该用户的可用设备信息，然后再删除用户'}}");
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false, error:{reason:'" + e.getMessage() + "'}}");
		}
		return SUCCESS;
	}
	
	private String checkPasswordValid(String pwd){

		String tip="valid";
		if (pwd.length() < 6 || pwd.length() > 20){
			tip = "密码长度不能少于6位, 不能大于20位";
			return tip;
		}
		if (!pwd.matches("^[\\da-zA-Z!@#$%^&]*$")) {
			tip = "密码只能含有字母，数字和特殊符号!@#$%^&";
			return tip;
		}
		if (! stringContains(pwd, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") ){
			tip = "密码必须含有字母";
			return tip;
		}
		if (! stringContains(pwd, "0123456789") ){
			tip = "密码必须含有数字";
			return tip;
		}
		if (! stringContains(pwd, "!@#$%^&") ){
			tip = "密码必须含有特殊符号!@#$%^&";
			return tip;
		}		
		
		return tip;
	}
	
	private boolean stringContains(String pwd, String chars){
		for ( int i=0; i < pwd.length(); i++)
		{
			String s = pwd.substring(i, i+1);
			if (chars.contains(s)){
				return true;
			}
		}
		return false;
	}
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public User getUser2() {
		return user2;
	}

	public void setUser2(User user) {
		this.user2 = user;
	}
	
	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public IUserService getUserService() {
		return userService;
	}

	public void setUserService(IUserService userService) {
		this.userService = userService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}


	public String getGroupIDs() {
		return groupIDs;
	}

	public void setGroupIDs(String groupIDs) {
		this.groupIDs = groupIDs;
	}

	public String getPassportIDs() {
		return passportIDs;
	}

	public void setPassportIDs(String passportIDs) {
		this.passportIDs = passportIDs;
	}

	public int getHasDeviceData() {
		return hasDeviceData;
	}

	public void setHasDeviceData(int hasDeviceData) {
		this.hasDeviceData = hasDeviceData;
	}

	public String getDeviceIDs() {
		return deviceIDs;
	}

	public void setDeviceIDs(String deviceIDs) {
		this.deviceIDs = deviceIDs;
	}

	public int getPassportid() {
		return passportid;
	}

	public void setPassportid(int passportid) {
		this.passportid = passportid;
	}

	public int getPortid() {
		return portid;
	}

	public void setPortid(int portid) {
		this.portid = portid;
	}

	public UserDeviceAcl getUd_acl() {
		return ud_acl;
	}

	public void setUd_acl(UserDeviceAcl ud_acl) {
		this.ud_acl = ud_acl;
	}

}
