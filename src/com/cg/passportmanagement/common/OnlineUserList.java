package com.cg.passportmanagement.common;

import java.util.ArrayList;
import java.util.List;

import com.cg.passportmanagement.database.User;

public final class OnlineUserList {
	
	List<User> ul = null;
	private static OnlineUserList instance = new OnlineUserList();
	
	private OnlineUserList(){
		this.ul = new ArrayList<User>();
	}
	public static synchronized OnlineUserList getInstance(){
		return instance;
	}
	
	public synchronized void add(User usr){
		if (usr!=null)
			ul.add(usr);
	}
	
	public synchronized void remove(User usr){
		if (usr!=null){
			System.out.println("用户退出系统, OnlineUserList.remove(): " + usr.getFullname());
			if ( ul.remove(usr) ){
				System.out.println("用户退出系统, OnlineUserList remove 失败 : " + usr.getFullname());
			}
		}
		else {
			// System.out.println("用户退出系统, OnlineUserList remove 失败 ！ ");
		}
	}

	public List<User> getUserList(){
		return ul;
	}

}
