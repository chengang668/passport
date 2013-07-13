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
			System.out.println("�û��˳�ϵͳ, OnlineUserList.remove(): " + usr.getFullname());
			if ( ul.remove(usr) ){
				System.out.println("�û��˳�ϵͳ, OnlineUserList remove ʧ�� : " + usr.getFullname());
			}
		}
		else {
			// System.out.println("�û��˳�ϵͳ, OnlineUserList remove ʧ�� �� ");
		}
	}

	public List<User> getUserList(){
		return ul;
	}

}
