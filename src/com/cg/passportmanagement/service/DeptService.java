package com.cg.passportmanagement.service;

import java.util.List;

import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.dao.IDeptDAO;
import com.cg.passportmanagement.database.Dept;
import com.cg.passportmanagement.database.Site;

public class DeptService implements IDeptService {
	private IDeptDAO dao;

	private static final String SERVICE_BEAN_ID = "DeptService";

	public static IDeptService getInstance(ApplicationContext context) {
		return (IDeptService) context.getBean(SERVICE_BEAN_ID);
	}
	
	public List<Dept> findAllDepts() throws Exception {
		try{
			return getDao().findAll();
		}
		catch (RuntimeException e) {
			throw new Exception("findAllDepts failed: " + e.getMessage());
		}
	}

	public Dept findDeptById(int deptid) throws Exception {
		try{
			return getDao().findById(deptid); 
		}
		catch (RuntimeException e) {
			throw new Exception("findDeptById failed: " + e.getMessage());
		}
	}

	public Dept findDeptByDeptname(String name) throws Exception{
		try{
			List<Dept> rs = getDao().findByDeptname(name); 
			if (rs != null && rs.size()>0)
				return rs.get(0);
			return null;
		}
		catch (RuntimeException e) {
			throw new Exception("findDeptByDeptname failed: " + e.getMessage());
		}
	}
	
	public void saveDept(Dept dept) throws Exception {
		try{
			getDao().save(dept); 
		}
		catch (RuntimeException e) {
			throw new Exception("saveDept failed: " + e.getMessage());
		}
	} 

	public void removeDept(Dept dept) throws Exception {
		try{
			getDao().delete(dept); 
		}
		catch (RuntimeException e) {
			throw new Exception("removeDept failed: " + e.getMessage());
		}
	}

	public void removeDeptById(int deptid) throws Exception {
		try{
			getDao().deleteById(deptid); 
		}
		catch (RuntimeException e) {
			throw new Exception("removeDept failed: " + e.getMessage());
		}
	}
	
	public IDeptDAO getDao() {
		return dao;
	}

	public void setDao(IDeptDAO dao) {
		this.dao = dao;
	}

}
