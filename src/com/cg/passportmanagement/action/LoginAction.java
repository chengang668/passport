package com.cg.passportmanagement.action;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import com.cg.passportmanagement.common.*;
import com.cg.passportmanagement.database.*;
import com.cg.passportmanagement.service.IUserService;
import com.opensymphony.xwork2.ActionSupport;

/*
 *  SiteAction is configured as prototype in spring IoC 
 */

public class LoginAction extends ActionSupport  {
	private static final long serialVersionUID = 1L;
	// private static final Log log = LogFactory.getLog(LoginAction.class);
	
	// input properties
	private String loginUsername = "";
	private String loginPassword = "";
	
	// output properties
	private String jsonString = "";
	
	// constants for output json result
	private final String jsonSuccess = "{success:true}";
	private final String jsonPwdExpired = "{success:true, info: '您的密码已经过期，请立即修改密码'}";
	private final String jsonPwdWillExpire = "{success:true, info: '您的密码还有%1天过期，请尽快修改密码'}";
	private final String jsonFailure = "{success:false,error:{reason:'登陆异常，请重试'}}";
	private final String jsonFailurePwd = "{success:false,error:{reason:'用户名或密码错误，请重试'}}";
	private final String jsonUserLocked = "{success:false,error:{reason:'您的账号已被锁定，请联系系统管理员'}}";

	// Session 
	private User user = null;
	
	// inject
	private IUserService userService = null;
	
	public String doLogin() {
		// 如果已经登陆　session还没退出：
		user = SessionUtil.getLoginUser();
		if (user != null){
			System.out.println("用户已经登陆，尝试再次登陆：" + user.getUserid() + ":" + user.getFullname() + " : " + new Date().toString());

			this.setJsonString(jsonSuccess);
			return SUCCESS;
		}

		// 新登陆
		if (loginUsername == null || loginUsername.trim().length()==0){
			this.setJsonString(jsonFailure);
			return ERROR;
		}
		
		try {
			user = userService.login( loginUsername, loginPassword );
			if ( user == null ){
				this.setJsonString(jsonFailurePwd);
				return ERROR;
			}
			else if (user.getStatus() == User.USER_STATUS_LOCKED){
				this.setJsonString(jsonUserLocked);
				return ERROR;
			}
			else if (user.getStatus() == User.USER_STATUS_PWD_EXPIRED){
				this.setJsonString(jsonPwdExpired);
				return SUCCESS;
			}
			Date now = new Date();
			long tdiff = user.getPwdexpiredate().getTime() - now.getTime();
			long days = tdiff / ( 24 * 3600000);
			if ( days >= 0 && days <= 10 ){
				this.setJsonString(jsonPwdWillExpire.replace("%1", String.valueOf(days)));
				return SUCCESS;
			}
		} 
		catch (Exception e) { 
			e.printStackTrace();
			
			this.setJsonString(jsonFailure);
			return ERROR;
		}

		// log.info("用户登陆成功：" + user.getUserid() + ":" + user.getFullname() + " : " + new Date().toString());
		
		this.setJsonString(jsonSuccess);
		return SUCCESS;
	}

	public String getLoginUser() {
		try {
			User sUser = SessionUtil.getLoginUser();
			
			if (sUser == null)
			{
				this.jsonString = jsonFailure;
				return ERROR;
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
			
			JSONObject jsUser = JSONObject.fromObject(sUser, config);
			this.setJsonString("{success:true,totalCount:1,user:"
					+ jsUser.toString() + "}");
			
			System.out.println(jsUser.toString());

			return SUCCESS;
		} 
		catch (Exception e) { 
			e.printStackTrace();
			
			this.jsonString = jsonFailure;
			return ERROR;
		} 
	}

	public String doLogout() {

		try {
			User sUser = SessionUtil.getLoginUser();
			if (sUser==null){
				this.setJsonString(jsonSuccess);
				return SUCCESS;
			}
			System.out.println("用户登出系统");
			OnlineUserList.getInstance().remove(sUser);
			SessionUtil.setLoginUser(null);
			SessionUtil.terminate();
			
			HttpSession session = ServletActionContext.getRequest().getSession();
			userService.logout(sUser, session);
			
			// System.out.println("用户退出系统: " + sUser.getUserid() + ":" + sUser.getFullname());
		} 
		catch (Exception e) { 
			e.printStackTrace();
			
			this.jsonString = jsonFailure;
			return ERROR;
		}

		this.setJsonString(jsonSuccess);
		return SUCCESS;
	}
	
	public String getOnlineUsers() {
		
		String resEmpty = "{success:true,totalCount:0,list:[]}";
		
		try {
			List <User> users = OnlineUserList.getInstance().getUserList();
			
			if (users==null){
				this.setJsonString(resEmpty);
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
			
			int cnt = users.size();
			JSONArray array = JSONArray.fromObject( users, config); 
			
			this.setJsonString("{success:true,totalCount : " + cnt
					+ ", list:" + array.toString() + "}");
			
			// System.out.println(this.getJsonString());			
		} 
		catch (Exception e) { 
			e.printStackTrace();
			
			this.jsonString = resEmpty;
			return SUCCESS;
		}

		return SUCCESS;
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public IUserService getUserService() {
		return userService;
	}
	public void setUserService(IUserService userService) {
		this.userService = userService;
	}
	public String getLoginUsername() {
		return loginUsername;
	}

	public void setLoginUsername(String loginUsername) {
		this.loginUsername = loginUsername;
	}

	public String getLoginPassword() {
		return loginPassword;
	}

	public void setLoginPassword(String loginPassword) {
		this.loginPassword = loginPassword;
	}

	public String getJsonString() {
		return jsonString;
	}

	public void setJsonString(String jsonString) {
		this.jsonString = jsonString;
	}
}

