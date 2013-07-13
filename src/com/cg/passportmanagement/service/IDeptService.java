package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.database.Dept;

public interface IDeptService {
	public Dept findDeptById(int deptid) throws Exception;
	
	public Dept findDeptByDeptname(String name) throws Exception;

	public List<Dept> findAllDepts() throws Exception;

	public void saveDept(Dept dept) throws Exception;

	public void removeDept(Dept dept) throws Exception;

	public void removeDeptById(int deptid) throws Exception;
}
