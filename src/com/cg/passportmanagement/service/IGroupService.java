package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.database.Groups;

public interface IGroupService {
	public Groups findGroupById(int deptid) throws Exception;
	
	public Groups findGroupByGroupname(String name) throws Exception;

	public List<Groups> findAllGroups() throws Exception;

	public void saveGroup(Groups dept) throws Exception;

	public void removeGroup(Groups dept) throws Exception;

	public void removeGroupById(int deptid) throws Exception;
}
