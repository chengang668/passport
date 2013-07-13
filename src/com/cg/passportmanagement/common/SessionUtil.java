package com.cg.passportmanagement.common;

import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserGroup;

public class SessionUtil {
	
	public static final String SESSION_LOGIN_USER = "LOGIN_USER";
	public static final String SESSION_CLIENT_IP = "CLIENT_IP";
	public static final String SESSION_GROUPS_OF_USER = "GROUPS_OF_USER";
	public static final String SESSION_USER_LEVEL = "LEVEL_OF_USER";
	public static final String ONLINE_USER_LIST = "ONLINE_USER_LIST";
	
	public static void setLoginUser(User user){
		HttpSession session = ServletActionContext.getRequest().getSession();
		if (session != null)
			session.setAttribute(SESSION_LOGIN_USER, user);
	}
	
	public static User getLoginUser(){
		HttpSession session = ServletActionContext.getRequest().getSession();
		
		if (session != null){
			Object obj = session.getAttribute(SESSION_LOGIN_USER);
			
			if (obj != null && (obj instanceof User) )
			{
				return (User) obj;
			}
		}
		return null;
	}

	public static User getLoginUser(HttpSession session){		
		if (session != null){
			Object obj = session.getAttribute(SESSION_LOGIN_USER);
			
			if (obj != null && (obj instanceof User) )
			{
				return (User) obj;
			}
		}
		return null;
	}

	public static void setClientIP(String clientip){
		HttpSession session = ServletActionContext.getRequest().getSession();
		if (session != null)
			session.setAttribute(SESSION_CLIENT_IP, clientip);
	}
	
	public static String getClientIP(){
		HttpSession session = ServletActionContext.getRequest().getSession();
		
		if (session != null){
			Object obj = session.getAttribute(SESSION_CLIENT_IP);
			
			if (obj != null && (obj instanceof String) )
			{
				return (String) obj;
			}
		}
		return null;
	}

	public static String getClientIP(HttpSession session){		
		if (session != null){
			Object obj = session.getAttribute(SESSION_CLIENT_IP);
			
			if (obj != null && (obj instanceof String) )
			{
				return (String) obj;
			}
		}
		return null;
	}

	
	public static void setGroupsOfUser(List grouplist){
		HttpSession session = ServletActionContext.getRequest().getSession();
		if (session != null)
			session.setAttribute(SESSION_GROUPS_OF_USER, grouplist);
	}
	
	public static List<UserGroup> getGroupsOfUser(){
		HttpSession session = ServletActionContext.getRequest().getSession();
		
		if (session != null){
			Object obj = session.getAttribute(SESSION_GROUPS_OF_USER);
			
			if (obj != null && (obj instanceof List) )
			{
				return (List<UserGroup>) obj;
			}
		}
		return null;
	}

	public static List<UserGroup> getGroupsOfUser(HttpSession session){		
		if (session != null){
			Object obj = session.getAttribute(SESSION_GROUPS_OF_USER);
			
			if (obj != null && (obj instanceof List) )
			{
				return (List<UserGroup>) obj;
			}
		}
		return null;
	}
	
	public static void terminate(){
		HttpSession session = ServletActionContext.getRequest().getSession();
		if (session != null)
			session.invalidate();
	}

	public static int userLevel(HttpSession session, User usr){ 
		int level = 99;
		
		if (session == null || usr == null)
			return level;
		
		if (usr.getUserid().compareTo("root")==0)
			return 1;

		return usr.getGroups().getGroupid();
		/*
		Integer sl = (Integer) session.getAttribute(SESSION_USER_LEVEL);
		if (sl != null && sl instanceof Integer)
			return sl.intValue();
		
		List<UserGroup> gl = getGroupsOfUser(session);

		if (gl==null) 
			return level;
		for(UserGroup ug : gl){
			if (ug.getGroup().getGroupid() < level){
				level = ug.getGroup().getGroupid();
			}
		}
		
		session.setAttribute(SESSION_USER_LEVEL, Integer.valueOf(level));
		return level; */
	}
	
	public static List<User> getOnlineUsers(){
		List<User> ul = null;
		ServletContext ctx = ServletActionContext.getServletContext(); 
		ul = (List<User> ) ctx.getAttribute(ONLINE_USER_LIST);

		return ul;
	}

}