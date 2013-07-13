package com.cg.passportmanagement.service;

import java.util.List;

import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.dao.GroupsDAO;
import com.cg.passportmanagement.database.Groups; 

public class GroupService implements IGroupService {
	private GroupsDAO dao;

	private static final String SERVICE_BEAN_ID = "GroupService";

	public static IGroupService getInstance(ApplicationContext context) {
		return (IGroupService) context.getBean(SERVICE_BEAN_ID);
	}
	public static IGroupService getInstance() {
		return (IGroupService) SpringContextUtil.getBean(SERVICE_BEAN_ID);
	}
	
	public List<Groups> findAllGroups() throws Exception {
		try{
			return getDao().findAll();
		}
		catch (RuntimeException e) {
			throw new Exception("findAllGroups failed: " + e.getMessage());
		}
	}

	public Groups findGroupById(int deptid) throws Exception {
		try{
			return getDao().findById(deptid); 
		}
		catch (RuntimeException e) {
			throw new Exception("findGroupById failed: " + e.getMessage());
		}
	}

	public Groups findGroupByGroupname(String name) throws Exception{
		try{
			return getDao().findByGroupname(name);  
		}
		catch (RuntimeException e) {
			throw new Exception("findGroupByGroupname failed: " + e.getMessage());
		}
	}
	
	public void saveGroup(Groups group) throws Exception {
		try{
			getDao().save(group); 
		}
		catch (RuntimeException e) {
			throw new Exception("saveGroup failed: " + e.getMessage());
		}
	} 

	public void removeGroup(Groups group) throws Exception {
		try{
			getDao().delete(group); 
		}
		catch (RuntimeException e) {
			throw new Exception("removeGroup failed: " + e.getMessage());
		}
	}

	public void removeGroupById(int groupid) throws Exception {
		try{
			if (groupid == 1)			{
				// Admin×é²»ÄÜÉ¾³ý
				return;
			}
			getDao().deleteById(groupid); 
		}
		catch (RuntimeException e) {
			e.printStackTrace();
			throw new Exception("removeGroup failed: " + e.getMessage());
		}
	}
	
	public GroupsDAO getDao() {
		return dao;
	}

	public void setDao(GroupsDAO dao) {
		this.dao = dao;
	}

}
