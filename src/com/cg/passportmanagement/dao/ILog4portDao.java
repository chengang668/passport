package com.cg.passportmanagement.dao;

import java.util.ArrayList;
import java.util.List;

import com.cg.passportmanagement.database.Log4port;

public interface ILog4portDao {

	public abstract List<Log4port> findlike(String queryString,
			ArrayList<String> vlist, int start, int limit);
	
	public abstract int  deletelike(String queryString, ArrayList<String> vlist);

	public abstract long queryCount(String queryString, ArrayList<String> vlist );
}