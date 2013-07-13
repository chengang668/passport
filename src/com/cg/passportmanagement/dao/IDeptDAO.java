package com.cg.passportmanagement.dao;

import java.util.List;
import com.cg.passportmanagement.database.Dept;

public interface IDeptDAO {

	public void save(Dept transientInstance);

	public void delete(Dept persistentInstance);
	
	public void deleteById(int SiteID);

	public Dept findById(java.lang.Integer id);
	
	public List<Dept> findByDeptname(Object deptname);

	public List<Dept> findAll();
}