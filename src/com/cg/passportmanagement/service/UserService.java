package com.cg.passportmanagement.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.common.DeviceUtil;
import com.cg.passportmanagement.common.OnlineUserList;
import com.cg.passportmanagement.common.SessionUtil;
import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.dao.IUserDAO;
import com.cg.passportmanagement.dao.LogsDAO;
import com.cg.passportmanagement.dao.PassportDAO;
import com.cg.passportmanagement.dao.UserDeviceAclDAO;
import com.cg.passportmanagement.dao.UserGroupDAO;
import com.cg.passportmanagement.dao.UserPassportAclDAO;
import com.cg.passportmanagement.database.Logs;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.database.UserDeviceAclId;
import com.cg.passportmanagement.database.UserGroup;
import com.cg.passportmanagement.database.UserGroupId;
import com.cg.passportmanagement.database.UserPassportAcl;
import com.cg.passportmanagement.database.UserPassportAclId;
import com.cg.passportmanagement.common.Config;

public class UserService implements IUserService {
	private IUserDAO dao;
	private UserPassportAclDAO aclDao;
	private UserGroupDAO ugDao;
	
	private static final String SERVICE_BEAN_ID = "UserService";

	public UserService() {
		super();
	}

	public static IUserService getInstance(ApplicationContext context) {
		return (IUserService) context.getBean(SERVICE_BEAN_ID);
	}
	
	public static IUserService getInstance() {
		return (IUserService) SpringContextUtil.getBean(SERVICE_BEAN_ID);
	}
	
	/* return null if password error or user not found
	 * return user, and check user.getStatus() otherwise 
	 */
	public User login(String loginName, String loginPassword) throws Exception {
		User user = getDao().findUserById(loginName); 
		if ( user == null ){
			// this.jsonString = jsonFailurePwd;
			return null;
		}
		
		// account is locked
		if ( user.getStatus() == User.USER_STATUS_LOCKED ){
			long time = user.getLockexpiredate().getTime();
			long now = new Date().getTime();
			// should be still in lock
			if (time > now) {
				// account is still locked
				return user;
			}
			// lock time expired
			user.setLoginretry(0);
			user.setLockexpiredate(null);
			user.setStatus(User.USER_STATUS_VALID);			
		}
		

		String clientip = ServletActionContext.getRequest().getRemoteAddr();
		String host = ServletActionContext.getRequest().getRemoteHost();

		// System.out.println("***********pwd input: '" + loginPassword + "' *************");
		// System.out.println("***********pwd saved: '" + user.DecodedPasswd() + "' *************");
		// password error.
		if (!loginPassword.equals(user.DecodedPasswd())){
			long retry = user.getLoginretry() + 1;
			user.setLoginretry(retry);

			// lock this account if not root
			if ( retry >= Config.getInstance().getMaxPasswordRetry().intValue()){
				
				Logs loginLog = new Logs();
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				loginLog.setDatetime(df.format(new Date()));
				loginLog.setHost("platform");
				loginLog.setFacility("login");
				loginLog.setLevel("warning");
				loginLog.setPriority("1");
				loginLog.setTag("login");
				loginLog.setProgram(user.getUserid());
				loginLog.setMsg("platform: "+ user.getUserid() +" tried " + retry + " times to login from: \"" + clientip + "\" at: " + loginLog.getDatetime());
				LogsDAO.getInstance().save(loginLog);
				
				// if ( "root".compareTo(user.getUserid())!=0 ){
				user.setStatus(User.USER_STATUS_LOCKED);
				Date dt = new Date();
				long time = dt.getTime();
				time += Config.getInstance().getUnlockInterval().longValue() * 3600000;
				dt.setTime(time);
				user.setLockexpiredate(dt);
				persistUser(user);
				return user;					
				// }
			} 
			
			persistUser(user);			
			return null;
		}
		
		// password correct
		
		Date now = new Date();
		if ( user.getStatus() == User.USER_STATUS_NEW ){
			user.setPwdexpiredate(now);
			user.setStatus(User.USER_STATUS_PWD_EXPIRED);
		}
		
		if ( user.getPwdexpiredate() == null ){
			user.setPwdexpiredate(  Config.getInstance().getPwdexpiredate());
		}
		
		if (now.after( user.getPwdexpiredate())) {
			user.setStatus(User.USER_STATUS_PWD_EXPIRED);
		}
		
		if (user.getStatus() == User.USER_STATUS_PWD_EXPIRED )		{
			
		}

		// update user last login time
		user.setLastlogin( new Date() );
		user.setClientip(clientip);
		user.setLoginretry(0);
		user.setLockexpiredate(null);
		
		persistUser(user);
		
		SessionUtil.setLoginUser(user);
		// SessionUtil.setClientIP(clientip);
		
		List<UserGroup> gl = findGroupsByUserId(user.getUserid());
		SessionUtil.setGroupsOfUser(gl);
		
		OnlineUserList.getInstance().add(user); 

		// log.info("用户登陆, " + "登录名: " + user.getUserid() + ":" + user.getFullname() +  ", IP地址：" + ipAddr + " : " + host);
		Logs loginLog = new Logs();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		loginLog.setDatetime(df.format(user.getLastlogin()));
		loginLog.setHost("platform");
		loginLog.setFacility("login");
		loginLog.setLevel("info");
		loginLog.setPriority("1");
		loginLog.setTag("login");
		loginLog.setProgram(user.getUserid());
		loginLog.setMsg("platform: " + user.getUserid() + " login from: \"" + clientip + "\" at: " + loginLog.getDatetime());
		LogsDAO.getInstance().save(loginLog);

		System.out.println("用户登陆, IP地址：" + clientip + " : " + host);
		
		return user;
	}

	public void logout(User user, HttpSession session) throws Exception {
		Logs logoutLog = new Logs();
		
		String ipAddr = user.getClientip();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date now = new Date();
		String logoutTime = df.format(now);	

		logoutLog.setDatetime(logoutTime);
		logoutLog.setHost("platform");
		logoutLog.setFacility("logout");
		logoutLog.setLevel("info");
		logoutLog.setPriority("1");
		logoutLog.setTag("logout");
		logoutLog.setProgram(user.getUserid());
		logoutLog.setMsg("platform: " + user.getUserid() + " logout from: \"" + ipAddr + "\" at: " + logoutLog.getDatetime());
		LogsDAO.getInstance().save(logoutLog);
	}

	public User findUserById(String userid) throws Exception {
		try {
			return getDao().findUserById(userid);
		} catch (RuntimeException e) {
			throw new Exception("finduserById failed with the id " + userid + ": "
					+ e.getMessage());
		}
	}

	public void persistUser(User user) throws Exception {
		try {
			getDao().persistUser(user);
		} catch (RuntimeException e) {
			throw new Exception("persistuser failed: " + e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	public int removeUser(User user) throws Exception {
		if (user==null)
			return 0;
		
		try {
			// check if the device acl is remove first
			
			List<UserDeviceAcl> udacls = UserDeviceAclDAO.getInstance().findByUserId(user.getUserid());
			if (udacls != null && udacls.size()>0){
				// tells user to remove port acl first 
				persistUserDevice(user, "");
			}
			
			// delete this user in all passports
			String[] extraPara = new String[1];
			List<UserPassportAcl> list = UserPassportAclDAO.getInstance().findByUserId(user.getUserid());
			for (UserPassportAcl upacl:list){
				extraPara[0] = user.getUserid();
				DeviceUtil.delUser(upacl.getPassport(), extraPara);
			}

			// hopefully, these can be removed by database in cascade mode, we do it manually
			// UserPassportAclDAO.getInstance().deleteByUser(user);
			UserPassportAclDAO.getInstance().deleteList(list);
			UserDeviceAclDAO.getInstance().deleteByUserId(user.getUserid());
			
			getDao().removeUser(user);
		} catch (RuntimeException e) {
			throw new Exception("removeuser failed: " + e.getMessage());
		}
		return 0;
	}

	//cg: this function seems not used
	public void removeUserById(String userid) throws Exception {
		try {
			// getDao().removeById(userid);
			removeUser(getDao().findUserById(userid));
		} catch (RuntimeException e) {
			throw new Exception("removeuser failed: " + e.getMessage());
		}
	}

	public void setDao(IUserDAO dao) {
		this.dao = dao;
	}

	public IUserDAO getDao() {
		return this.dao;
	}

	public void setAclDao(UserPassportAclDAO dao) {
		this.aclDao = dao;
	}

	public UserPassportAclDAO getAclDao() {
		return this.aclDao;
	}
	
	public UserGroupDAO getUgDao() {
		return ugDao;
	}

	public void setUgDao(UserGroupDAO ugDao) {
		this.ugDao = ugDao;
	}
	
	public List<User> findAllUsers() throws Exception {
		try{
			return getDao().findAllUsers();
		}catch (RuntimeException e) {
			throw new Exception("findAllusers failed: " + e.getMessage());
		}
	}

	public List<User> findUsersByExample(User user) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	public List<UserPassportAcl> findUsersByPassportId(int passportid) throws Exception {
		try{
			return (List<UserPassportAcl>) getAclDao().findByPassportId(passportid);
		}catch (RuntimeException e) {
			throw new Exception("findUsersByPassportId failed: " + e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	public List<UserPassportAcl> findPassportsByUserId(String userid) throws Exception{
		try{
			return (List<UserPassportAcl>) getAclDao().findByUserId(userid);
		}catch (RuntimeException e) {
			throw new Exception("findPassportsByUserId failed: " + e.getMessage());
		}	
	}

	public List<UserDeviceAcl> findDevicesByUserId(String userid) throws Exception{
		try{ 
			return (List<UserDeviceAcl>) UserDeviceAclDAO.getInstance().findByUserId(userid);
		}catch (RuntimeException e) {
			throw new Exception("findPassportsByUserId failed: " + e.getMessage());
		}	
	}
	
	@SuppressWarnings("unchecked")
	public List<UserGroup> findGroupsByUserId(String userid) throws Exception{
		try{
			return (List<UserGroup>) getUgDao().findByUserId(userid);
		}catch (RuntimeException e) {
			throw new Exception("findGroupsByUserId failed: " + e.getMessage());
		}	
	}
	
	public void persistUserGroup(User user, String groupids) throws Exception
	{
		if (user == null || groupids == null || groupids.trim().length()==0)
			return;
		
		try {		
			String uid = user.getUserid();
			
			if (groupids.indexOf(',') < 0){
				UserGroupId ugid = new UserGroupId(uid, Integer.valueOf(groupids));
				UserGroup ug = new UserGroup();
				ug.setId(ugid);
				getUgDao().save(ug);
				
				return;
			}
			else {
				String[] gids = groupids.split(",");
	
				for (int i=0; i<gids.length; i++){
					UserGroupId ugid = new UserGroupId(uid, Integer.valueOf(gids[i]));
					UserGroup ug = new UserGroup();
					ug.setId(ugid);
					getUgDao().save(ug);				
				}
			}
		}catch (RuntimeException e) {
			throw new Exception("persistUserGroup failed: " + e.getMessage());
		}	
	}
	
	public void persistUserPassport(User user, String passportids) throws Exception
	{
		if (user == null || passportids == null || passportids.trim().length()==0)
			return;
		
		try {		
			String uid = user.getUserid();
			
			if (passportids.indexOf(',') < 0){
				UserPassportAclId upid = new UserPassportAclId(uid, Integer.valueOf(passportids));
				UserPassportAcl up = new UserPassportAcl();
				up.setId(upid);
				getAclDao().save(up);
				
				return;
			}
			else {
				String[] gids = passportids.split(",");
	
				for (int i=0; i<gids.length; i++){
					UserPassportAclId upid = new UserPassportAclId(uid, Integer.valueOf(gids[i]));
					UserPassportAcl up = new UserPassportAcl();
					up.setId(upid);
					getAclDao().save(up);				
				}
			}
		}catch (RuntimeException e) {
			throw new Exception("persistUserPassport failed: " + e.getMessage());
		}	
	}
	
	public void persistUserDevice(User user, String deviceids) throws Exception
	{
		if (user == null || deviceids == null)
			return;
		
		try {		
			String uid = user.getUserid();
			
			// remove all old entries and then insert new.
			// this will cause the following save to fail due to exception: persistUserPassport failed: a different object with the same identifier value was already associated with the session: [com.cg.passportmanagement.database.UserDeviceAcl 
			// UserDeviceAclDAO.getInstance().deleteByUserId(uid);
			List<UserDeviceAcl> deletingList = (List<UserDeviceAcl>) UserDeviceAclDAO.getInstance().findByUserId(uid);
			
			List<UserDeviceAcl> addingList = new ArrayList<UserDeviceAcl>(10);
			List<UserDeviceAcl> untouchedList = new ArrayList<UserDeviceAcl>(10);
			
			if (deviceids.indexOf(',') < 0){
				int i = deviceids.indexOf(':');
				if (i > 0 )
				{
					String pptid = deviceids.substring(0, i);
					String portid = deviceids.substring(i+1);
	
					UserDeviceAclId udid = new UserDeviceAclId(uid, Integer.valueOf(pptid), Integer.valueOf(portid));
					UserDeviceAcl ud = new UserDeviceAcl();
					ud.setId(udid);
					int ind;
					if (-1 == (ind = index(deletingList, udid))){
						UserDeviceAclDAO.getInstance().save(ud);
						ud = UserDeviceAclDAO.getInstance().findById(udid);
						addingList.add(ud);
					}
					else{
						UserDeviceAcl old = deletingList.remove(ind);
						untouchedList.add(old);
					}
				}
			}
			else {
				String[] gids = deviceids.split(",");
	
				for (int i=0; i<gids.length; i++){
					int j = gids[i].indexOf(':');
					String pptid = gids[i].substring(0, j);
					String portid = gids[i].substring(j+1);
					
					UserDeviceAclId udid = new UserDeviceAclId(uid, Integer.valueOf(pptid), Integer.valueOf(portid));
					UserDeviceAcl ud = new UserDeviceAcl();
					ud.setId(udid);

					int ind;
					if (-1 == (ind = index(deletingList, udid))){
						UserDeviceAclDAO.getInstance().save(ud);
						ud = UserDeviceAclDAO.getInstance().findById(udid);
						addingList.add(ud);
					}
					else{
						// already exists, no deleting.
						UserDeviceAcl old = deletingList.remove(ind);
						untouchedList.add(old);
					}
					//UserDeviceAclDAO.getInstance().save(ud);				
				}
			}
			
			// deleting the unwanted entries
			if (deletingList.size()>0)
			{
				UserDeviceAclDAO.getInstance().deleteAll(deletingList);
			}

			/*CG: 2010/11/16, cancel the sync between ppt and db on user acl list */
			if (Config.getInstance().getSyncPortAcl())
			{
				addingList.addAll(deletingList);
				
				for (UserDeviceAcl ud : addingList){
					int pptid = ud.getId().getPassportid();
					int portid = ud.getId().getPortid();
					
					// Device dev = new Device();
					List<UserDeviceAcl> tmplist = (List<UserDeviceAcl>) UserDeviceAclDAO.getInstance().findByDevice(pptid, portid);
					String users = "";
					for (UserDeviceAcl tmpud : tmplist){
						users += tmpud.getId().getUserid() + " ";
					}
					// make sure root is always in the list
					if (users.indexOf("root ") < 0){
						users = "root " + users;
					}
	
					String[] extraPara = new String[2];
					extraPara[0] = ud.getId().getPortid().toString();
					extraPara[1] = users.trim();
	
					Passport tmp_ppt = PassportDAO.getInstance().findById(pptid);
					DeviceUtil.userPortAcl(tmp_ppt, extraPara);
				}
			}
		}catch (RuntimeException e) {
			throw new Exception("persistUserDevice failed: " + e.getMessage());
		}	
	}
	
	private int index(List<UserDeviceAcl> list, UserDeviceAclId id){
		UserDeviceAclId oid = null;
		int i = 0;
		for (i=0; i<list.size(); i++)
		{
			UserDeviceAcl o = list.get(i);
			oid = o.getId();
			if (oid.getPassportid().equals(id.getPassportid()) &&
				oid.getPortid().equals(id.getPortid()) &&
				oid.getUserid().equals(id.getUserid()))
				return i;
		}
		return -1;
	}

	@SuppressWarnings("unchecked")
	public List<User> findUserByGroupId(Integer gid) throws Exception {
		try{
			return (List<User>) getDao().findUserByGroupId(gid);
		}catch (RuntimeException e) {
			throw new Exception("findUserByGroupId failed: " + e.getMessage());
		}
	}
}