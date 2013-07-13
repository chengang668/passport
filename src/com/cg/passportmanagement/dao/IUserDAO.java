package com.cg.passportmanagement.dao;

import java.util.List;

import com.cg.passportmanagement.database.*;

public interface IUserDAO {
	public User findUserById(String userid);

	public List<User> findAllUsers();
	public List<User> findUserByGroupId(Integer gid);

	public void persistUser(User user);

	public void removeUser(User user);

	public void removeById(String userid);
}