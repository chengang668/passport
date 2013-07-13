package com.cg.passportmanagement.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.database.UserGroup;
import com.cg.passportmanagement.database.UserPassportAcl;

@SuppressWarnings("unused")
public interface IUserService {
	
	public User login(String loginname, String pwd) throws Exception;
	
	public void logout(User user, HttpSession session ) throws Exception;
	
	public User findUserById(String userid) throws Exception;

	public List<User> findAllUsers() throws Exception;

	public List<User> findUsersByExample(User user) throws Exception;

	public void persistUser(User user) throws Exception;

	public int removeUser(User user) throws Exception;

	public void removeUserById(String userid) throws Exception;
	
	public List<UserPassportAcl> findUsersByPassportId(int passportid) throws Exception;

	public List<UserPassportAcl> findPassportsByUserId(String userid) throws Exception;
	
	public List<UserDeviceAcl> findDevicesByUserId(String userid) throws Exception;

	public List<UserGroup> findGroupsByUserId(String userid) throws Exception;
	
	public void persistUserGroup(User user, String groupids) throws Exception;
	
	public void persistUserPassport(User user, String passportids) throws Exception;
	
	public void persistUserDevice(User user, String deviceids) throws Exception;

	public List<User> findUserByGroupId(Integer gid) throws Exception;
}
