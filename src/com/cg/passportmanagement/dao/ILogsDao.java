package com.cg.passportmanagement.dao;

import java.util.ArrayList;
import java.util.List;

import com.cg.passportmanagement.database.Dept;
import com.cg.passportmanagement.database.Logs;

public interface ILogsDao {

	public abstract List<Logs> findlike(String queryString,
			ArrayList<String> vlist, int start, int limit);
	
	public abstract int deletelike(String queryString, ArrayList<String> vlist);

	public abstract long queryCount(String queryString, ArrayList<String> vlist );
	
	public void save(Logs transientInstance);
}