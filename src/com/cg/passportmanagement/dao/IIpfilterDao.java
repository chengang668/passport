package com.cg.passportmanagement.dao;

import java.util.List;
 
import com.cg.passportmanagement.database.Ipfilter;

public interface IIpfilterDao {
	public void save(Ipfilter transientInstance);

	public void delete(Ipfilter persistentInstance);

	public void deleteById(Integer valueOf);

	public Ipfilter findById(java.lang.Integer id);
	
	public List<Ipfilter> findAll();
}